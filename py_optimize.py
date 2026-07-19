from PIL import Image
import os

paths = [
    r'public\img\contact\nihara.jpg',
    r'public\img\contact\shruti.jpg',
    r'public\img\contact\team.jpg',
    r'public\img\events\cyber-converge1.jpg',
    r'public\img\events\finaltrace2.jpg',
    r'public\img\theshowcase.jpg'
]

for p in paths:
    if os.path.exists(p):
        try:
            with Image.open(p) as img:
                out_path = p.rsplit('.', 1)[0] + '.webp'
                img.save(out_path, 'WEBP')
                print(f"Successfully converted {p} to {out_path}")
                os.remove(p)
        except Exception as e:
            print(f"Failed to convert {p}: {e}")
