# Tải về máy: save-images-urls.py
# Cài: pip install requests beautifulsoup4 (nếu chưa có)

import requests
from bs4 import BeautifulSoup
import json

# Thay bằng link album Google Photos của bạn
album_url = "https://photos.app.goo.gl/iWLc8B9yBL6yF4AZA"

# Lấy HTML album (cần session nếu private, nhưng shared thì OK)
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
response = requests.get(album_url, headers=headers)
soup = BeautifulSoup(response.text, 'html.parser')

# Extract URLs (Google Photos dùng data-id, script này lấy img src)
image_urls = []
img_tags = soup.find_all('img', {'class': 's7ggnb'})
for img in img_tags:
    src = img.get('src')
    if src and 'lh3.googleusercontent.com' in src:
        image_urls.append(src)

# Lưu vào images.json
with open('images.json', 'w', encoding='utf-8') as f:
    json.dump(image_urls, f, indent=2, ensure_ascii=False)

print(f"Đã lấy {len(image_urls)} URL ảnh, lưu vào images.json!")