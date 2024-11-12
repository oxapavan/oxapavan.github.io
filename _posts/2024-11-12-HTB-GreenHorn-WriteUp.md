---
layout: post
title: Hackthebox GreenHorn Machine Writeup
tags: [Revershell Recon]
description: Detailed writeup of [PermX](https://app.hackthebox.com/machines/617)?
---



<div style="display: flex; justify-content: center;">
  <img src="/assets/HTB/banner.png" alt="HTB Banner" style="max-width: 100%; height: auto; text-align: center;">
</div>

### overview

Greenhorn is a beginner-friendly machine. Starting with credential harvesting to revershell upload & then trying with pdf extraction 

- OS Linux
- Point's 20

###  (CVE-2022-26965) Pluck Remote Code Execution
#### The attacker who already has an account can upload a fake module to the system and can execute the content from this module on the server. The attacker executes an info file from the already fake uploaded module and gets all information for this system. This is a CRITICAL Vulnerability. The problem is that these developers are not making a strong sanitizing upload function and do not restrict the execution from inside of the server.

## Recon
### nmap
```
┌──(angrybird㉿kali)-[~/Desktop/Openvpn]
└─$ nmap -sV -sC 10.10.11.25  
Starting Nmap 7.94SVN ( https://nmap.org ) 
Stats: 0:02:13 elapsed; 0 hosts completed (1 up), 1 undergoing Connect Scan
Connect Scan Timing: About 71.12% done;
Nmap scan report for 10.10.11.25
Host is up (0.37s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 57:d6:92:8a:72:44:84:17:29:eb:5c:c9:63:6a:fe:fd (ECDSA)
|_  256 40:ea:17:b1:b6:c5:3f:42:56:67:4a:3c:ee:75:23:2f (ED25519)
80/tcp   open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://greenhorn.htb/
3000/tcp open  ppp?
| fingerprint-strings: 
|   GenericLines, Help, RTSPRequest: 
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   GetRequest: 
|     HTTP/1.0 200 OK
|     Cache-Control: max-age=0, private, must-revalidate, no-transform
|     Content-Type: text/html; charset=utf-8
|     Set-Cookie: i_like_gitea=b8fecf263c1e35a9; Path=/; HttpOnly; SameSite=Lax
|     Set-Cookie: _csrf=bxkgOSoV_o-2Ply3BAH0UWmMAPU6MTczMTQzMTQ0NDUxMzAyMTk0MQ; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax
|     X-Frame-Options: SAMEORIGIN
|     <!DOCTYPE html>
|     <html lang="en-US" class="theme-auto">
|     <head>
|     <meta name="viewport" content="width=device-width, initial-scale=1">
|     <title>GreenHorn</title>
|     <link rel="manifest" href="data:application/json;base64,eyJuYW1lIjoiR3JlZW5Ib3JuIiwic2hvcnRfbmFtZSI6IkdyZWVuSG9ybiIsInN0YXJ0X3VybCI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvIiwiaWNvbnMiOlt7InNyYyI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvYXNzZXRzL2ltZy9sb2dvLnBuZyIsInR5cGUiOiJpbWFnZS9wbmciLCJzaXplcyI6IjUxMng1MTIifSx7InNyYyI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvYX
|   HTTPOptions: 
|     HTTP/1.0 405 Method Not Allowed
|     Allow: HEAD
|     Allow: HEAD
|     Allow: GET
|     Cache-Control: max-age=0, private, must-revalidate, no-transform
|     Set-Cookie: i_like_gitea=b0bc6ae68de3fbb6; Path=/; HttpOnly; SameSite=Lax
|     Set-Cookie: _csrf=GoskDxug-DQHcGB4MQuqxdNJXCk6MTczMTQzMTQ2MjM2MjAzMTY4OA; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax
|     X-Frame-Options: SAMEORIGIN
|_    Content-Length: 0
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port3000-TCP:V=7.94SVN%I=7%D=11/12%Time=67338C13%P=x86_64-pc-linux-gnu%
SF:r(GenericLines,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\
SF:x20text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20B
SF:ad\x20Request")%r(GetRequest,2A5C,"HTTP/1\.0\x20200\x20OK\r\nCache-Cont
SF:rol:\x20max-age=0,\x20private,\x20must-revalidate,\x20no-transform\r\nC
SF:ontent-Type:\x20text/html;\x20charset=utf-8\r\nSet-Cookie:\x20i_like_gi
SF:tea=b8fecf263c1e35a9;\x20Path=/;\x20HttpOnly;\x20SameSite=Lax\r\nSet-Co
SF:okie:\x20_csrf=bxkgOSoV_o-2Ply3BAH0UWmMAPU6MTczMTQzMTQ0NDUxMzAyMTk0MQ;\
SF:x20Path=/;\x20Max-Age=86400;\x20HttpOnly;\x20SameSite=Lax\r\nX-Frame-Op
SF:tions:\x20SAMEORIGIN\r\nDate:\x20Tue,\x2012\x20Nov\x202024\x2017:10:44\
SF:x20GMT\r\n\r\n<!DOCTYPE\x20html>\n<html\x20lang=\"en-US\"\x20class=\"th
SF:eme-auto\">\n<head>\n\t<meta\x20name=\"viewport\"\x20content=\"width=de
SF:vice-width,\x20initial-scale=1\">\n\t<title>GreenHorn</title>\n\t<link\
SF:x20rel=\"manifest\"\x20href=\"data:application/json;base64,eyJuYW1lIjoi
SF:R3JlZW5Ib3JuIiwic2hvcnRfbmFtZSI6IkdyZWVuSG9ybiIsInN0YXJ0X3VybCI6Imh0dHA
SF:6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvIiwiaWNvbnMiOlt7InNyYyI6Imh0dHA6Ly9ncmVlbm
SF:hvcm4uaHRiOjMwMDAvYXNzZXRzL2ltZy9sb2dvLnBuZyIsInR5cGUiOiJpbWFnZS9wbmciL
SF:CJzaXplcyI6IjUxMng1MTIifSx7InNyYyI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAv
SF:YX")%r(Help,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20
SF:text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\
SF:x20Request")%r(HTTPOptions,1A4,"HTTP/1\.0\x20405\x20Method\x20Not\x20Al
SF:lowed\r\nAllow:\x20HEAD\r\nAllow:\x20HEAD\r\nAllow:\x20GET\r\nCache-Con
SF:trol:\x20max-age=0,\x20private,\x20must-revalidate,\x20no-transform\r\n
SF:Set-Cookie:\x20i_like_gitea=b0bc6ae68de3fbb6;\x20Path=/;\x20HttpOnly;\x
SF:20SameSite=Lax\r\nSet-Cookie:\x20_csrf=GoskDxug-DQHcGB4MQuqxdNJXCk6MTcz
SF:MTQzMTQ2MjM2MjAzMTY4OA;\x20Path=/;\x20Max-Age=86400;\x20HttpOnly;\x20Sa
SF:meSite=Lax\r\nX-Frame-Options:\x20SAMEORIGIN\r\nDate:\x20Tue,\x2012\x20
SF:Nov\x202024\x2017:11:02\x20GMT\r\nContent-Length:\x200\r\n\r\n")%r(RTSP
SF:Request,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text
SF:/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20R
SF:equest");
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 402.11 seconds

```





```
echo "$ip GreenHorn.htb" | sudo tee -a /etc/hosts
```



```
┌──(root㉿kali)-[/home/angrybird/Desktop/Openvpn]
└─# dirb http://GreenHorn.htb

-----------------
DIRB v2.22    
By The Dark Raver
-----------------

START_TIME: Tue Nov 12 22:51:10 2024
URL_BASE: http://GreenHorn.htb/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt

-----------------

GENERATED WORDS: 4612                                                          

---- Scanning URL: http://GreenHorn.htb/ ----
+ http://GreenHorn.htb/admin.php (CODE:200|SIZE:4026)                                    
==> DIRECTORY: http://GreenHorn.htb/data/                                                
==> DIRECTORY: http://GreenHorn.htb/docs/                                                
==> DIRECTORY: http://GreenHorn.htb/files/                                               
==> DIRECTORY: http://GreenHorn.htb/images/                                              
+ http://GreenHorn.htb/javadoc (CODE:200|SIZE:92)                                        
+ http://GreenHorn.htb/java-plugin (CODE:200|SIZE:92)                                    
+ http://GreenHorn.htb/javascript (CODE:200|SIZE:92)                                     
+ http://GreenHorn.htb/local (CODE:200|SIZE:92)                                          
+ http://GreenHorn.htb/locale (CODE:200|SIZE:92)                                         
+ http://GreenHorn.htb/localstart (CODE:200|SIZE:92)                                     
+ http://GreenHorn.htb/location (CODE:200|SIZE:92)                                       
+ http://GreenHorn.htb/locations (CODE:200|SIZE:92)                                      
+ http://GreenHorn.htb/locator (CODE:200|SIZE:92)                                        
+ http://GreenHorn.htb/lock (CODE:200|SIZE:92)
+ http://GreenHorn.htb/locked (CODE:200|SIZE:92)                                         
+ http://GreenHorn.htb/lockout (CODE:200|SIZE:92)                                        
+ http://GreenHorn.htb/lofiversion (CODE:200|SIZE:92)                                    
+ http://GreenHorn.htb/log (CODE:200|SIZE:92)                                            
+ http://GreenHorn.htb/Log (CODE:200|SIZE:92)                                            
+ http://GreenHorn.htb/log4j (CODE:200|SIZE:92)                                          
+ http://GreenHorn.htb/robots.txt (CODE:200|SIZE:47)                                     
+ http://GreenHorn.htb/send_pwd (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/send_to_friend (CODE:200|SIZE:2)                                  
+ http://GreenHorn.htb/sendform (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/sendfriend (CODE:200|SIZE:2)                                      
+ http://GreenHorn.htb/sendmail (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/sendmessage (CODE:200|SIZE:2)                                     
+ http://GreenHorn.htb/send-password (CODE:200|SIZE:2)                                   
+ http://GreenHorn.htb/sendpm (CODE:200|SIZE:2)                                          
+ http://GreenHorn.htb/sendthread (CODE:200|SIZE:2)                                      
+ http://GreenHorn.htb/sendto (CODE:200|SIZE:2)                                          
+ http://GreenHorn.htb/sendtofriend (CODE:200|SIZE:2)                                    
+ http://GreenHorn.htb/sensepost (CODE:200|SIZE:2)                                       
+ http://GreenHorn.htb/sensor (CODE:200|SIZE:2)                                          
+ http://GreenHorn.htb/sent (CODE:200|SIZE:2)                                            
+ http://GreenHorn.htb/seo (CODE:200|SIZE:2)                                             
+ http://GreenHorn.htb/serial (CODE:200|SIZE:2)                                          
+ http://GreenHorn.htb/serv (CODE:200|SIZE:2)                                            
+ http://GreenHorn.htb/serve (CODE:200|SIZE:2)                                           
+ http://GreenHorn.htb/server (CODE:200|SIZE:2)                                          
+ http://GreenHorn.htb/Server (CODE:200|SIZE:2)                                          
+ http://GreenHorn.htb/server_admin_small (CODE:200|SIZE:2)                              
+ http://GreenHorn.htb/server_stats (CODE:200|SIZE:2)                                    
+ http://GreenHorn.htb/ServerAdministrator (CODE:200|SIZE:2)                             
+ http://GreenHorn.htb/SERVER-INF (CODE:200|SIZE:2)                                      
+ http://GreenHorn.htb/server-info (CODE:200|SIZE:2)                                     
+ http://GreenHorn.htb/servers (CODE:200|SIZE:2)                                         
+ http://GreenHorn.htb/server-status (CODE:200|SIZE:2)                                   
+ http://GreenHorn.htb/service (CODE:200|SIZE:2)                                         
+ http://GreenHorn.htb/servicelist (CODE:200|SIZE:2)                                     
+ http://GreenHorn.htb/services (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/Services (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/servicio (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/servicios (CODE:200|SIZE:2)                                       
+ http://GreenHorn.htb/servlet (CODE:200|SIZE:2)                                         
+ http://GreenHorn.htb/Servlet (CODE:200|SIZE:2)                                         
+ http://GreenHorn.htb/servlets (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/Servlets (CODE:200|SIZE:2)                                        
+ http://GreenHorn.htb/servlets-examples (CODE:200|SIZE:2)
```

After some scanning i got this directory's & files 












