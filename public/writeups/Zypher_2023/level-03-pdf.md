
## Challenge

You are given a [PDF](writeupfiles/level3/unknown.pdf)

## Solution

You need to first extract the crackable information from the file using `John the Ripper` tool.

```bash
$ pdf2john.py unknown.pdf > hash
```

![](/writeups/Zypher_2023/writeupfiles/level3/1.png)

Now, crack the hash using `John the Ripper` tool.

```bash
$ john hash --wordlist=/usr/share/wordlists/rockyou.txt hash
```

![](/writeups/Zypher_2023/writeupfiles/level3/2.png)

Now, you can see the password for the PDF file is `mystery`. Use this password to open the PDF file and you will get the flag.

![](/writeups/Zypher_2023/writeupfiles/level3/3.png)
