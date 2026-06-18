
The login form is susceptible to SQL Injection, allowing attackers to bypass authentication without knowing valid credentials. This is due to improperly sanitized user inputs in SQL queries.

Examples of payloads:
```sql
admin' –
admin';--
admin' /*
' UNION SELECT 1,2,3,1,'admin
```

Entering these in the username followed by any password lets the user login as admin.

> [!NOTE]
> OR-based injections are filtered, requiring alternative payloads.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture2.png)  ![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture3.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture4.png)
