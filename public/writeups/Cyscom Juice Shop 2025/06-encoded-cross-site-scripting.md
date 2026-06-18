
Most websites sanitize the user inputs to prevent XSS vulnerabilities in their webpages by not allowing syntax or text for certain formats. We can bypass this using encoding text to their ascii values or decimal values and injecting the XSS. Browsers decode these before rendering, reactivating the payload.

Eg: `<script>&#97;&#108;&#101;&#114;&#116;(1)</script>`

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture21.png)

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture22.png)
