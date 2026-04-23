import json
import requests
from PIL import Image
from io import BytesIO

with open("./output-lunaris.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# https://static.nanoka.cc/assets/gi/UI_Gacha_AvatarIcon_Linnea.webp

for id, data in data.items():
    filename = data["assets"]["cardImg"]
    url = f"https://static.nanoka.cc/assets/gi/{filename}.webp"

    # get image
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))

    # crop image with specifics
    cropped = img.crop(0, 135, 320, 320+135)

    # save image
    cropped.save