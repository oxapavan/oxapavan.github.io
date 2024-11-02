---
layout: post
title: Hack Havoc 2.0 CTF Adventure
date: 2024-11-02 10:00:00
tags: ['Web', 'Rev', OSINT, 'Crypto']
---

## Overview
I participated in Hack Havoc 2.0 CTF and secured 6th position. The competition featured various categories including Web, Crypto, Forensics, Mobile, and Cloud challenges. This writeup details my approach to each challenge, explaining the thought process and methodology.




## The Treasure Chest (Prizes) 
- PJPT Certification by TCM 
- HackTheBox VIP access (3 months of pure hacking goodness) + an Ebook
- 1-hour career consultation with a Cybersecurity Leader (Top 10)
- Internship opportunities at CyberMaterial and 911Cyber (Top 20)



## Welcome Challenges

### Welcome To CyberMaterial
**Description:** 
```
Welcome to Hack Havoc 2.0. The Premiere CTF Hosted by Cybermaterial.
Before we start the journey, let's make a detour to our Discord Server and Instagram.
Friends are crucial for every adventure...
Flag Format: CM{String}
```

**Analysis & Solution:**
1. Initial Approach:
   - Challenge mentioned Discord and Instagram
   - Flag format suggested two parts would need to be combined
   
2. Discord Investigation:
   - Joined the Discord server
   - Explored various channels
   - Checked Discord bot commands
   - Found that `/flag` command returned first part of the flag

3. Instagram Search:
   - Visited CyberMaterial's Instagram profile (@cybermaterial_)
   - Found second part of flag in profile

### Bonus Challenge
**Description:** Follow CyberMaterial on LinkedIn and submit proof for bonus points.

**Solution:**
1. Simple process:
   - Follow LinkedIn page
   - Take screenshot
   - Submit through Google form
   - Points automatically added
  

## Mobile Challenge

### APK-ocalypse Now!
**Description:**
```
Put on your detective hat and dive into our mysterious APK! 
Get it and uncover hidden treasures—will it be memes, cat videos, or just code? 
Get ready to crack the APK-ocalypse!
```

**Analysis & Solution:**
1. Initial Analysis:
   - Downloaded APK file
   - Used jadx-gui for decompilation
   - Strategy: Check common locations for hidden data
     - AndroidManifest.xml
     - Resource files
     - String resources
     - Layout files

2. Investigation Steps:
   - Opened APK in jadx-gui
   - Analyzed manifest file first (common place for configuration data)
   - Found suspicious string: `PZ{U1qq3a_7Y4t_1a_Z4aVS35G}`
   
3. Decoding Process:
   - String looked like encoded flag
   - Pattern suggested simple substitution
   - Tested ROT13 first (common CTF encoding)
   - Successfully decoded to: `CM{H1dd3n_7L4g_1n_M4nIF35T}`


## PEB and TEB

* `!peb`: display PEB
* `dt nt!_PEB -r @$peb`: full PEB dump
* `!teb`: display TEB

Many WinDbg commands (`lm`, `!dlls`, `!imgreloc`, `!tls`, `!gle`) rely on the data retrieved from PEB and TEB

## Process and Module

* `lm`: list modules
* `lm vm kernel32`: verbose output for kernel32
* `!dlls`: dislay list of modules with loader-specific information
* `!dlls -c kernel32`: only display information of `kernel32`
* `!imgreloc`: display relocation information 
* `!dh kernel32`: display the header for kernel32

# Threads Information 

* `~`: thread status for all threads
* `~0`: thread status for thread 0
* `~.`: thread status for currently active thread
* `~*`: thread status for all threads with some extra info
* `~* k`: call stacks for all threads ~ !uniqstack
