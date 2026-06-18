
Unsensitized input can sometimes be passed into server-side template engines (like Jinja2). If expressions are interpreted, attackers can run arbitrary code.

For example: 
```text
{{7*7}} => 49
```

This can lead to full server compromise if RCE is possible.

You can inject Server-side templates to the file search of option to reveal sensitive data. This happens when the user input is not sanitized.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture23.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture24.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture25.png)
