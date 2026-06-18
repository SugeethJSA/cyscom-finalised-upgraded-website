
Type juggling or type casting refers to a PHP functionality. Since PHP does not require explicit type definition in variable declaration, a string can be assigned to a variable 'a' and later on an int can also be assigned to variable 'a'. 

```php
'0e12345' == '0e54321' // true in PHP
```

If the computed hash only contains numbers after the first `0e`, PHP will treat the hash as a float. A password hash that begins with `0e` will always appear to match the strings, regardless of what they actually are.
This can be used to bypass authentication in vulnerable PHP programs. We can emulate this in our webpage by sending a POST request as:

```bash
curl -X POST "https://SERVER_IP/api/v1/verify_backup" -H "Content-Type: application/json" -H "Cookie: session=YOUR_SESSION_COOKIE" -d "{\"id\":123,\"hash\":\"0e123456789\"}"
```

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture38.png)

This request sends a request with these parameters:
```json
{
 "id": 123,
 "hash": "0e123456789"
}
```

To the `/api/v1/verify_backup` endpoint, which bypasses the authentication with an hash starting with 0e.

> [!NOTE]
> In the above request, replace SERVER\_IP with the website IP address & YOUR\_SESSION\_COOKIE with your session token. This can be found using inspect element. In Firefox, it can be found at:
> ![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture39.png)
