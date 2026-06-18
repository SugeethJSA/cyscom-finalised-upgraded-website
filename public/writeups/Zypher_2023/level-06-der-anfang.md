
## Challenge

An image file is given. [Der Anfang](writeupfiles/level6/der_Anfang.jpg)

## Solution

The link to the social media post is given in the meta data of the image file in the id name of UserComment and the meta data can be viewed using exiftool.

```bash
$ exiftool der_Anfang.jpg
```

![exiftool](/writeups/Zypher_2023/writeupfiles/level6/exiftool.png)

In the reddit post the link to the git history is salted and placed

![reddit](/writeups/Zypher_2023/writeupfiles/level6/reddit.png)

Link after removing unwanted special characters 👇🏻

[https://github.com/yshui/picom/commit/a2bcf94ce8fa7216f69fb6ace2c1b3776bdce823](https://github.com/yshui/picom/commit/a2bcf94ce8fa7216f69fb6ace2c1b3776bdce823)

The flag is in the commit message.

![flag](/writeups/Zypher_2023/writeupfiles/level6/flag.png)
