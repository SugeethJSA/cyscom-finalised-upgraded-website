
This is an OSINT challenge that starts by logging in to the `cabinet` user. This user already has a note with a heading "remember the date" and a link to a webpage.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture34.png)

It also has another note that states that the official account `cyscom` is scheduled for deletion because the password was too easy to guess (a date).

On clicking the link to the webpage, we can scroll down to find a timeline to events.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture35.png)

Trying the date 15012022 (15 January 2022) as the password for `cyscom` user, we get access to the account that is to be removed. 

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture36.png)

Clicking the `view Flags` button, we are given the Lost User flag.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture37.png)
