
This panel is visible only on admin login and shows some open endpoints that we can access.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture9.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture10.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture11.png)

This panel reveals hidden endpoints, accessible only via a Base64-encoded token in the format:

```text
base64("username:date")
```

This mechanism mimics an insecure form of token-based access control and can be exploited for endpoint access.

**Flag Retrieval:** Visiting `/api/v1/internal/users` endpoint:

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture12.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture13.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture14.png)

Also visiting `/api/v1/backup?token=` with the correct token of format `(admin:time)` in base64 format, leads to:

Eg: `https://vul-webapp.onrender.com/api/v1/backup?token=YWRtaW46MjEzCg==`

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture14.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture15.png)
