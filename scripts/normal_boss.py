import requests
import json

ids = [
    113001,
    113002,
    113009,
    113010,
    113011,
    113012,
    113016,
    113020,
    113022,
    113023,
    113024,
    113028,
    113029,
    113030,
    113031,
    113035,
    113036,
    113037,
    113038,
    113039,
    113040,
    113044,
    113045,
    113049,
    113050,
    113051,
    113052,
    113053,
    113057,
    113058,
    113059,
    113064,
    113065,
    113066,
    113067,
    113071,
    113072,
    113076,
    113077,
    113078,
    113079,
    113080,
    113084,
    113085,
]
result = {}

for id in ids:
    url = f"https://gi.yatta.moe/api/v2/EN/material/{id}"
    response = requests.get(url)
    data = response.json()
    data = data["data"]

    item_name = data["name"]
    boss_display_name = data["additions"]["droppedBy"][0]["name"]

    to_add = {
        boss_display_name.replace(" ", "_").upper(): {
            "displayName": boss_display_name,
            "materials": {item_name: {"id": id}},
        }
    }
    result.update(to_add)
    print(f"Added {item_name} from {boss_display_name}")

print(json.dumps(result, indent=4))