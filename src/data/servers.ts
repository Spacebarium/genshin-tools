export const SERVER_TIMEZONES = {
    Asia: "Asia/Shanghai",
    Europe: "Europe/Paris",
    America: "America/New_York",
    "TW/HK/MO": "Asia/Shanghai",
} as const;

export type ServerRegion = keyof typeof SERVER_TIMEZONES;

export const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
] as const;
