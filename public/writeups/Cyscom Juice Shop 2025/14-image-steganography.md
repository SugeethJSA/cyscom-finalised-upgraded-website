
Data is hidden within image files using LSB or metadata techniques. Tools like zsteg extract such hidden data.
Logging into user `Unknown` gives us an image in the notes.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture41.png)

We can download this image and try to run text extraction techniques on it such as steghide, zsteg, etc.

![Screenshot](/writeups/Cyscom%20Juice%20Shop%202025/imagedata/Picture42.png)

Using `zsteg`, we can see the flag hidden in the image.
