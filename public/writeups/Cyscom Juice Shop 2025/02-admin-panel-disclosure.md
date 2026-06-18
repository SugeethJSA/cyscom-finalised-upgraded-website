
The `/admin` endpoint, typically hidden, becomes accessible post-SQL injection login. This panel leaks usernames and passwords of all registered users, indicating a **Sensitive Data Exposure** vulnerability.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture5.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture6.png)

**Flag Retrieval:** Visiting this hidden endpoint grant the user a flag. 

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture7.png)

The leaked credentials can be used to authenticate normally to 'admin' user and retrieve the corresponding flag. 

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture8.png)
