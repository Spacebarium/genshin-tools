import json
import requests
from pprint import pprint

char_ids = [
    (2, "2.0"),
    (3, "1.0"),
    (6, "1.0"),
    (14, "1.0"),
    (15, "1.0"),
    (16, "1.0"),
    (20, "1.0"),
    (21, "1.0"),
    (22, "1.0"),
    (23, "1.0"),
    (24, "1.0"),
    (25, "1.0"),
    (26, "1.3"),
    (27, "1.0"),
    (29, "1.0"),
    (30, "1.1"),
    (31, "1.0"),
    (32, "1.0"),
    (33, "1.1"),
    (34, "1.0"),
    (35, "1.0"),
    (36, "1.0"),
    (37, "1.2"),
    (38, "1.2"),
    (39, "1.1"),
    (41, "1.0"),
    (42, "1.0"),
    (43, "1.0"),
    (44, "1.1"),
    (45, "1.4"),
    (46, "1.3"),
    (47, "1.6"),
    (48, "1.5"),
    (49, "2.0"),
    (50, "2.2"),
    (51, "1.5"),
    (52, "2.1"),
    (53, "2.0"),
    (54, "2.1"),
    (55, "2.3"),
    (56, "2.1"),
    (57, "2.3"),
    (58, "2.5"),
    (59, "2.8"),
    (60, "2.7"),
    (61, "3.7"),
    (62, "2.1"),
    (63, "2.4"),
    (64, "2.4"),
    (65, "2.7"),
    (66, "2.6"),
    (67, "3.0"),
    (68, "3.0"),
    (69, "3.0"),
    (70, "3.1"),
    (71, "3.1"),
    (72, "3.1"),
    (73, "3.2"),
    (74, "3.2"),
    (75, "3.3"),
    (76, "3.3"),
    (77, "3.4"),
    (78, "3.4"),
    (79, "3.5"),
    (80, "3.5"),
    (81, "3.6"),
    (82, "3.6"),
    (83, "4.0"),
    (84, "4.0"),
    (85, "4.0"),
    (86, "4.1"),
    (87, "4.1"),
    (88, "4.2"),
    (89, "4.2"),
    (90, "4.3"),
    (91, "4.3"),
    (92, "4.4"),
    (93, "4.4"),
    (94, "4.5"),
    (95, "4.7"),
    (96, "4.6"),
    (97, "4.7"),
    (98, "4.7"),
    (99, "4.8"),
    (100, "5.0"),
    (101, "5.0"),
    (102, "5.0"),
    (103, "5.1"),
    (104, "5.2"),
    (105, "5.2"),
    (106, "5.3"),
    (107, "5.3"),
    (108, "5.3"),
    (109, "5.4"),
    (110, "5.5"),
    (111, "5.5"),
    (112, "5.6"),
    (113, "5.6"),
    (114, "5.7"),
    (115, "5.7"),
    (116, "5.8"),
    (119, "6.0"),
    (120, "6.0"),
    (121, "6.0"),
    (122, "6.1"),
    (123, "6.2"),
    (124, "6.2"),
    (125, "6.3"),
    (126, "6.3"),
    (127, "6.3"),
    (128, "6.4"),
]

ELEMENT_MAP = {
    "Wind": "Anemo",
    "Fire": "Pyro",
    "Water": "Hydro",
    "Electric": "Electro",
    "Ice": "Cryo",
    "Grass": "Dendro",
    "Rock": "Geo",
}

WEAPON_TYPE_MAP = {
    "WEAPON_SWORD_ONE_HAND": "Sword",
    "WEAPON_CLAYMORE": "Claymore",
    "WEAPON_CATALYST": "Catalyst",
    "WEAPON_BOW": "Bow",
    "WEAPON_POLE": "Polearm",
}

SHORT_NAME_MAP = {
    "Kamisato Ayaka": "Ayaka",
    "Kaedehara Kazuha": "Kazuha",
    "Raiden Shogun": "Raiden",
    "Sangonomiya Kokomi": "Kokomi",
    "Kujou Sara": "Sara",
    "Arataki Itto": "Itto",
    "Shikanoin Heizou": "Heizou",
    "Kamisato Ayato": "Ayato",
    "Yumemizuki Mizuki": "Mizuki",
}

ASCENSION_BOSS_DATA = {
    "Anemo Hypostasis": {"material": {"name": "Hurricane Seed", id: 113001}},
    "Electro Hypostasis": {"material": {"name": "Lightning Prism", id: 113002}},
    "Geo Hypostasis": {"material": {"name": "Basalt Pillar", id: 113009}},
    "Cryo Regisvine": {"material": {"name": "Hoarfrost Core", id: 113010}},
    "Pyro Regisvine": {"material": {"name": "Everflame Seed", id: 113011}},
    "Oceanid": {"material": {"name": "Cleansing Heart", id: 113012}},
    "Primo Geovishap": {"material": {"name": "Juvenile Jade", id: 113016}},
    "Cryo Hypostasis": {"material": {"name": "Crystalline Bloom", id: 113020}},
    "Maguu Kenki": {"material": {"name": "Marionette Core", id: 113022}},
    "Perpetual Mechanical Array": {"material": {"name": "Perpetual Heart", id: 113023}},
    "Pyro Hypostasis": {"material": {"name": "Smoldering Pearl", id: 113024}},
    "Hydro Hypostasis": {"material": {"name": "Dew of Repudiation", id: 113028}},
    "Thunder Manifestation": {"material": {"name": "Storm Beads", id: 113029}},
    "Golden Wolflord": {"material": {"name": "Riftborn Regalia", id: 113030}},
    "Coral Defenders": {"material": {"name": "Dragonheir's False Fin", id: 113031}},
    "Ruin Serpent": {"material": {"name": "Runic Fang", id: 113035}},
    "Jadeplume Terrorshroom": {"material": {"name": "Majestic Hooked Beak", id: 113036}},
    "Electro Regisvine": {"material": {"name": "Thunderclap Fruitcore", id: 113037}},
    "Aeonblight Drake": {"material": {"name": "Perpetual Caliber", id: 113038}},
    "Algorithm of Semi-Intransient Matrix of Overseer Network": {"material": {"name": "Light Guiding Tetrahedron", id: 113039}},
    "Dendro Hypostasis": {"material": {"name": "Quelled Creeper", id: 113040}},
    "Setekh Wenut": {"material": {"name": "Pseudo-Stamens", id: 113044}},
    "Iniquitous Baptist": {"material": {"name": "Evergloom Ring", id: 113045}},
    "Icewind Suite: Dirge of Coppelia": {"material": {"name": "Artificed Spare Clockwork Component \u2014 Coppelia", id: 113049}},
    "Icewind Suite: Nemesis of Coppelius": {"material": {"name": "Artificed Spare Clockwork Component \u2014 Coppelius", id: 113050}},
    "Emperor of Fire and Iron": {"material": {"name": "Emperor's Resolution", id: 113051}},
    "Experimental Field Generator": {"material": {"name": '"Tourbillon Device"', id: 113052}},
    "Millennial Pearl Seahorse": {"material": {"name": "Fontemer Unihorn", id: 113053}},
    "Hydro Tulpa": {"material": {"name": "Water That Failed To Transcend", id: 113057}},
    "Solitary Suanni": {"material": {"name": "Cloudseam Scale", id: 113058}},
    "Legatus Golem": {"material": {"name": "Fragment of a Golden Melody", id: 113059}},
    "Goldflame Qucusaur Tyrant": {"material": {"name": "Mark of the Binding Blessing", id: 113064}},
    "Gluttonous Yumkasaur Mountain King": {"material": {"name": "Overripe Flamegranate", id: 113065}},
    "Secret Source Automaton: Configuration Device": {"material": {"name": "Gold-Inscribed Secret Source Core", id: 113066}},
    "Tenebrous Papilla: Type I": {"material": {"name": "Ensnaring Gaze", id: 113067}},
    "Wayward Hermetic Spiritspeaker": {"material": {"name": "Talisman of the Enigmatic Land", id: 113071}},
    "Lava Dragon Statue": {"material": {"name": "Sparkless Statue Core", id: 113072}},
    "Secret Source Automaton: Overseer Device": {"material": {"name": "Secret Source Airflow Accumulator", id: 113076}},
    "Knuckle Duckle": {"material": {"name": "Precision Kuuvahki Stamping Die", id: 113077}},
    "Radiant Moonfly": {"material": {"name": "Lightbearing Scale-Feather", id: 113078}},
    "Frostnight Herra": {"material": {"name": "Radiant Antler", id: 113079}},
    "Super-Heavy Landrover: Mechanized Fortress": {"material": {"name": "Cyclic Military Kuuvahki Core", id: 113080}},
    "Lord of the Hidden Depths: Whisperer of Nightmares": {"material": {"name": "Remnant of the Dreadwing", id: 113084}},
    "Radiant Moongecko": {"material": {"name": "Prismatic Severed Tail", id: 113085}},
}

asc_boss_drops = {v["material"]["name"]: k for k, v in ASCENSION_BOSS_DATA.items()}

WEEKLY_BOSS_DATA = {
    "dvalin": {
        "displayName": "Stormterror",
        "materials": {
            "Dvalin's Plume": {
                id: 113003,
            },
            "Dvalin's Claw": {
                id: 113004,
            },
            "Dvalin's Sigh": {
                id: 113005,
            },
        },
    },
    "andrius": {
        "displayName": "Lupus Boreas, Dominator of Wolves",
        "materials": {
            "Tail of Boreas": {
                id: 113006,
            },
            "Ring of Boreas": {
                id: 113007,
            },
            "Spirit Locket of Boreas": {
                id: 113008,
            },
        },
    },
    "childe": {
        "displayName": "Childe",
        "materials": {
            "Tusk of Monoceros Caeli": {
                id: 113013,
            },
            "Shard of a Foul Legacy": {
                id: 113014,
            },
            "Shadow of the Warrior": {
                id: 113015,
            },
        },
    },
    "azhdaha": {
        "displayName": "Azhdaha",
        "materials": {
            "Dragon Lord's Crown": {
                id: 113017,
            },
            "Bloodjade Branch": {
                id: 113018,
            },
            "Gilded Scale": {
                id: 113019,
            },
        },
    },
    "signora": {
        "displayName": "La Signora",
        "materials": {
            "Molten Moment": {
                id: 113025,
            },
            "Hellfire Butterfly": {
                id: 113026,
            },
            "Ashen Heart": {
                id: 113027,
            },
        },
    },
    "raiden": {
        "displayName": "Magatsu Mitake Narukami no Mikoto",
        "materials": {
            "Mudra of the Malefic General": {
                id: 113032,
            },
            "Tears of the Calamitous God": {
                id: 113033,
            },
            "The Meaning of Aeons": {
                id: 113034,
            },
        },
    },
    "scaramouche": {
        "displayName": "Shouki no Kami, the Prodigal",
        "materials": {
            "Puppet Strings": {
                id: 113041,
            },
            "Mirror of Mushin": {
                id: 113042,
            },
            "Daka's Bell": {
                id: 113043,
            },
        },
    },
    "apep": {
        "displayName": "Guardian of Apep's Oasis",
        "materials": {
            "Worldspan Fern": {
                id: 113046,
            },
            "Primordial Greenbloom": {
                id: 113047,
            },
            "Everamber": {
                id: 113048,
            },
        },
    },
    "narwhal": {
        "displayName": "All-Devouring Narwhal",
        "materials": {
            "Lightless Silk String": {
                id: 113054,
            },
            "Lightless Eye of the Maelstrom": {
                id: 113055,
            },
            "Lightless Mass": {
                id: 113056,
            },
        },
    },
    "knave": {
        "displayName": "The Knave",
        "materials": {
            "Fading Candle": {
                id: 113060,
            },
            "Silken Feather": {
                id: 113061,
            },
            "Denial and Judgment": {
                id: 113062,
            },
        },
    },
    "gosoytoth": {
        "displayName": "Lord of Eroded Primal Fire",
        "materials": {
            "Eroded Horn": {
                id: 113068,
            },
            "Eroded Sunfire": {
                id: 113069,
            },
            "Eroded Scale-Feather": {
                id: 113070,
            },
        },
    },
    "chess": {
        "displayName": "The Game Before the Gate",
        "materials": {
            "Ascended Sample: Knight": {
                id: 113073,
            },
            "Ascended Sample: Rook": {
                id: 113074,
            },
            "Ascended Sample: Queen": {
                id: 113075,
            },
        },
    },
    "dottore": {
        "displayName": "The Doctor",
        "materials": {
            "Mask of the Virtuous Doctor": {
                id: 113081,
            },
            "Madman's Restraint": {
                id: 113082,
            },
            "Elixir of the Heretic": {
                id: 113083,
            },
        },
    },
}

weekly_boss_mats = []
for boss in WEEKLY_BOSS_DATA.values():
    for mat in boss["materials"].keys():
        weekly_boss_mats.append(mat)

# "kaedehara-kazuha": {
#         id: "kaedehara-kazuha",
#         gameId: 10000047,
#         name: "Kaedehara Kazuha",
#         shortName: "Kazuha",
#         element: "Anemo",
#         weaponType: "Sword",
#         rarity: 5,
#         releasePatch: "1.6",
#         materials: {
#             ascensionBoss: "Maguu Kenki",
#             weeklyBossMaterial: "Gilded Scale",
#             talentBook: "Diligence",
#         },
#         cardImg: ""
#         gachaImg: ""
#     },

result = {}

for char_id, release_patch in char_ids:
    game_id = 10000000 + char_id

    url = f"https://gi.yatta.moe/api/v2/en/avatar/{game_id}"
    response = requests.get(url)
    data = response.json()
    data = data["data"]

    name = data["name"]
    print(name)
    short_name = SHORT_NAME_MAP.get(name)
    id = name.lower().replace(" ", "-")
    element = ELEMENT_MAP[data["element"]]
    weapon_type = WEAPON_TYPE_MAP[data["weaponType"]]
    rarity = data["rank"]

    items = data["items"]
    item_keys = list(items.keys())
    
    for k, v in items.items():
        if v["name"] in asc_boss_drops:
            ascension_boss_mat = v["name"]

        if v["name"] in weekly_boss_mats:
            weekly_boss_mat = v["name"]

        if "Philosophies" in v["name"]:
            talent_name = v["name"].split(" ")[-1]
    
    # print(asc_boss_drops[ascension_boss_mat])
    # print(weekly_boss_mat)
    # print(talent_name)
    # print()

    char_data = {
        "id": id,
        "gameId": game_id,
        "name": name,
        **({"shortName": short_name} if short_name else {}),
        "element": element,
        "weaponType": weapon_type,
        "rarity": rarity,
        "releasePatch": release_patch,
        "materials": {
            "ascensionBoss": asc_boss_drops[ascension_boss_mat],
            "weeklyBossMaterial": weekly_boss_mat,
            "talentBook": talent_name,
        },
    }

    result.update({id: char_data})

# pprint(result)

with open("output.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=4)
