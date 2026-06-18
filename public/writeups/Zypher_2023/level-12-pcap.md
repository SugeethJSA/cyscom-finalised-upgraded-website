
## Challenge

You are given a [network_mitm.pcap](writeupfiles/level12/network_mitm.pcap) file

## Solution

Extract contents using [NetworkMiner](https://www.netresec.com/?page=NetworkMiner)

![](/writeups/Zypher_2023/writeupfiles/level12/1.png)

Load in the pcap file and extract the zip file

![](/writeups/Zypher_2023/writeupfiles/level12/2.png)

Extract flag.zip using hashed password inside welcome.pdf

Decrypt hashing using [CrackStation](https://crackstation.net/)

![](/writeups/Zypher_2023/writeupfiles/level12/3.png)

Extract the files using password `welC0me`

![](/writeups/Zypher_2023/writeupfiles/level12/4.png)

```bash
$ cat flag.txt
```
