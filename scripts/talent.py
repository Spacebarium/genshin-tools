import requests
import json

# export const TALENT_DOMAIN_DATA = {
#     MONDSTADT: {
#         region: "Mondstadt",
#         books: {
#             Freedom: {
#                 id: 104303,
#             },
#             Resistance: {
#                 id: 104306,
#             },
#             Ballad: {
#                 id: 104309,
#             },
#         },
#     },
# } as const;

start_id = 104303
result = {}
crown_id = 104319  # only here because need to +1 after this id to skip it

region_keys = [
    "MONDSTADT",
    "LIYUE",
    "INAZUMA",
    "SUMERU",
    "FONTAINE",
    "NATLAN",
    "NOD-KRAI",
]
current_region_count = len(region_keys)
book_count = 3  # per region
book_tiers = 3  # per book

# for id in range(start_id, start_id + (current_region_count * book_count * book_tiers), 3):
#     if id > crown_id:
#         id += 1 # skip crown id
#     print(id)

#     url = f"https://gi.yatta.moe/api/v2/EN/material/{id}"
#     response = requests.get(url)
#     data = response.json()
#     data = data["data"]

#     # skip first two words
#     talent_name = data["name"].split(" ")[2:]
#     talent_name = " ".join(talent_name)
#     talent_data = {talent_name: {"id": id}}

#     result.update(talent_data)

# print(json.dumps(result, indent=4))

copied = {
    "Freedom": {"id": 104303},
    "Resistance": {"id": 104306},
    "Ballad": {"id": 104309},
    "Prosperity": {"id": 104312},
    "Diligence": {"id": 104315},
    "Gold": {"id": 104318},
    "Transience": {"id": 104322},
    "Elegance": {"id": 104325},
    "Light": {"id": 104328},
    "Admonition": {"id": 104331},
    "Ingenuity": {"id": 104334},
    "Praxis": {"id": 104337},
    "Equity": {"id": 104340},
    "Justice": {"id": 104343},
    "Order": {"id": 104346},
    "Contention": {"id": 104349},
    "Kindling": {"id": 104352},
    "Conflict": {"id": 104355},
    "Moonlight": {"id": 104358},
    "Elysium": {"id": 104361},
    "Vagrancy": {"id": 104364},
}

# map 3 books to each region (alr in order)
d_keys = list(copied.keys())

for idx, region in enumerate(region_keys):
    materials = {}

    for i in range(book_count):
        book_name = d_keys[idx * book_count + i]
        book_id = copied[book_name]["id"]
        materials.update({book_name: {"id": book_id}})

    region_data = {
        region: {
            "region": region.capitalize(),
            "books": materials,
        }
    }
    result.update(region_data)

print(json.dumps(result, indent=4))