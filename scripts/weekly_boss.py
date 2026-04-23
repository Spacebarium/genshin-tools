import requests
import json

# export const WEEKLY_BOSS_DATA = {
#     DVALIN: {
#         displayName: "Stormterror",
#         materials: {
#             "Dvalin's Sigh": { id: 113006 },
#             "Dvalin's Claw": { id: 113007 }
#         }
#     }
# } as const;

item_ids = [113003, 113006, 113013, 113017, 113025, 113032, 113041, 113046, 113054, 113060, 113068, 113073, 113081]
boss_keys = [
    "DVALIN",
    "ANDRIUS",
    "CHILDE",
    "AZHDAHA",
    "SIGNORA",
    "RAIDEN",
    "SCARAMOUCHE",
    "APEP",
    "NARHWAL",
    "KNAVE",
    "GOSOYTOTH",
    "CHESS",
    "DOTTORE",
]
result = {}

for idx, item_id in enumerate(item_ids):
    # group of 3 items
    materials = {}

    for id in range(item_id, item_id + 3):
        url = f"https://gi.yatta.moe/api/v2/EN/material/{id}"
        response = requests.get(url)
        data = response.json()
        data = data["data"]

        item_name = data["name"]

        item_data = {item_name: {"id": id}}
        materials.update(item_data)

        try:
            boss_display_name = data["additions"]["droppedBy"][0]["name"]
        except:
            boss_display_name = ""
        # print(boss_display_name)

    boss_data = {
        boss_keys[idx]: {
            "displayName": boss_display_name,
            "materials": materials,
        }
    }
    result.update(boss_data)

print(json.dumps(result, indent=4))