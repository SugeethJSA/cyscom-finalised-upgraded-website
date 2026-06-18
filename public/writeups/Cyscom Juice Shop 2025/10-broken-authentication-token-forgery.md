
The application allows password resets via a token which is easily found on the "/admin" endpoint. Lack of proper validation enables unauthorized access.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture31.png)

We need to make a base64 encode token of format:
```text
username:date (eg: user:02, cabinet:21)
```

And convert it to `base64`.

We can then use this token to reset password of the account.
This gives us the broken authentication flag.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture32.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture33.png)

Only few accounts have the ability to reset password. Not all accounts can reset the password.
