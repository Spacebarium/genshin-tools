import { ClearDataButton } from "@/components/ClearDataButton";
import { ImportDataButton } from "@/components/ImportDataButton";
import { CHARACTER_DATABASE } from "@/data/characters";
import {
    BOSS_MATERIAL_DROPS_CUMULATIVE,
    LEVELING_MORA_CUMULATIVE,
    TALENT_BOOKS_CUMULATIVE,
    TALENT_MORA_CUMULATIVE,
} from "@/data/costs";
import { DAY_NAMES, SERVER_TIMEZONES, type ServerRegion } from "@/data/servers";
import { TALENT_DOMAIN_DATA } from "@/data/talentBooks";
import { useTrackerStore } from "@/store/useTrackerStore";
import type {
    AscensionPhase,
    CharacterProgress,
    CharacterTalents,
    TalentLevel,
    TravelerTwin,
} from "@/types/character";
import { TALENT_KEYS } from "@/types/character";
import { isPreNatlan } from "@/utils/helper";
import { Fragment, useEffect, useState } from "react";
import "./style.css";

const RESET_HOUR = 4; // 04:00 server time
const DAY_TO_INDEX: Partial<Record<(typeof DAY_NAMES)[number], number>> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 0,
    Friday: 1,
    Saturday: 2,
};

function formatDateTime(date: Date) {
    // 30/03/2026 17:08:27
    return date
        .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
        .replace(",", "");
}

function formatTime(date: Date) {
    // 17:08:27
    return date.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

function getServerTime(date: Date, region: ServerRegion): Date {
    const tzString = date.toLocaleString("en-US", {
        timeZone: SERVER_TIMEZONES[region],
    });
    return new Date(tzString);
}

function getTimeUntilReset(serverTime: Date): string {
    const next = new Date(serverTime);
    next.setHours(RESET_HOUR, 0, 0, 0);
    if (serverTime.getHours() >= RESET_HOUR) next.setDate(next.getDate() + 1);
    const diff = next.getTime() - serverTime.getTime();

    return new Date(diff).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
}

function getTodayBooks(serverTime: Date) {
    const offsetServerTime = new Date(serverTime.getTime() - RESET_HOUR * 60 * 60 * 1000);
    const day = DAY_NAMES[offsetServerTime.getDay()];
    const index = DAY_TO_INDEX[day];
    if (index === undefined) return null; // Sunday

    return Object.entries(TALENT_DOMAIN_DATA).map(([region, books]) => ({
        region,
        book: Object.keys(books)[index],
    }));
}

const TodayWidget = () => {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const serverRegion = useTrackerStore((state) => state.serverRegion);
    const serverTime = getServerTime(now, serverRegion);
    const todayBooks = getTodayBooks(serverTime);
    const offsetServerTime = new Date(serverTime.getTime() - RESET_HOUR * 60 * 60 * 1000);

    return (
        <div className="sidebar-card">
            <div className="today-local">{formatDateTime(now)}</div>
            <div className="today-server">
                <span className="today-region">{serverRegion}</span>
                <span>{formatTime(serverTime)}</span>
            </div>
            <div className="today-reset">
                Reset in <span className="reset-countdown">{getTimeUntilReset(serverTime)}</span>
            </div>
            <div className="today-grid">
                <span className="header-row">Daily Reset</span>
                <span className="header-row">{DAY_NAMES[offsetServerTime.getDay()]}</span>
                {todayBooks === null ? (
                    <span className="full-width">All books available :)</span>
                ) : (
                    todayBooks.map(({ region, book }) => (
                        <Fragment key={region}>
                            <span className="region">{region}</span>
                            <span className="book">{book}</span>
                        </Fragment>
                    ))
                )}
            </div>
        </div>
    );
};

function getCumulativeTalentMora(talents: CharacterTalents): number {
    return TALENT_KEYS.reduce((sum, key) => sum + (TALENT_MORA_CUMULATIVE[talents[key]] ?? 0), 0);
}

function getCumulativeTalentBooks(talents: CharacterTalents): number {
    return Object.values(talents).reduce((sum, level) => {
        return sum + TALENT_BOOKS_CUMULATIVE[level as TalentLevel];
    }, 0);
}

function formatAmount(n: number): string {
    return n.toLocaleString("en", { maximumFractionDigits: 0 });
}

function getLevelingResin(ascension: AscensionPhase, releasePatch: string): number {
    const drops = BOSS_MATERIAL_DROPS_CUMULATIVE[ascension];
    // extremely rough guesstimates
    const dropRate = isPreNatlan(releasePatch)
        ? 2.5 // pre-natlan
        : 3.1; // post-natlan
    return (drops / dropRate) * 40; // 40 resin per boss
}

const SpendingSummary = () => {
    const progress = useTrackerStore((state) => state.progress);
    const owned = Object.values(progress).filter(Boolean) as CharacterProgress[];

    const totals = owned.reduce(
        (acc, char) => {
            const charData = CHARACTER_DATABASE[char.id];
            acc.talentMora += getCumulativeTalentMora(char.talents);
            acc.levelingMora += LEVELING_MORA_CUMULATIVE[`${char.level}-${char.ascension}`] ?? 0;
            acc.talentBooks += getCumulativeTalentBooks(char.talents);
            if (charData)
                // manekina is kill
                acc.levelingResin += getLevelingResin(char.ascension, charData.releasePatch);
            return acc;
        },
        { talentMora: 0, levelingMora: 0, talentBooks: 0, levelingResin: 0 },
    );

    const totalTalentResin = (totals.talentBooks / 10.12) * 20; // 10.12 avg per run, 20 resin per run

    return (
        <div className="sidebar-card">
            <div className="spending-grid">
                <span></span>
                <span className="header-row">Mora</span>
                <span className="header-row">Resin*</span>
                <span>Talents</span>
                <span className="spending-amount">{formatAmount(totals.talentMora)}</span>
                <span className="spending-amount">~{formatAmount(totalTalentResin)}</span>
                <span>Leveling</span>
                <span className="spending-amount">{formatAmount(totals.levelingMora)}</span>
                <span className="spending-amount">~{formatAmount(totals.levelingResin)}</span>
                <span>Total</span>
                <span className="spending-amount">
                    {formatAmount(totals.talentMora + totals.levelingMora)}
                </span>
                <span className="spending-amount">
                    ~{formatAmount(totalTalentResin + totals.levelingResin)}
                </span>
            </div>
            <p className="card-note">
                *Not 100% accurate due to Overflowing Mastery, exploration and event rewards,
                Parametric Transformer, etc.
            </p>
            <p className="card-note">
                *WL9 was introduced in 5.0, increasing the average drop rate from WL8's 2.5 to 3.1.
                Additionally, limited time quest rewards can give ascension materials.
            </p>
        </div>
    );
};

export const Sidebar = () => {
    const playerTwin = useTrackerStore((state) => state.playerTwin);
    const setPlayerTwin = useTrackerStore((state) => state.setPlayerTwin);
    const serverRegion = useTrackerStore((state) => state.serverRegion);
    const setServerRegion = useTrackerStore((state) => state.setServerRegion);

    return (
        <aside className="tracker-sidebar">
            <div className="tracker-actions">
                <ImportDataButton />
                <ClearDataButton />
            </div>

            <div className="tracker-actions">
                <select
                    value={playerTwin}
                    onChange={(e) => setPlayerTwin(e.target.value as TravelerTwin)}
                    className="tracker-selector"
                >
                    <option value="Aether">Aether</option>
                    <option value="Lumine">Lumine</option>
                </select>
                <select
                    value={serverRegion}
                    onChange={(e) => setServerRegion(e.target.value as ServerRegion)}
                    className="tracker-selector"
                >
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="America">America</option>
                    <option value="TW/HK/MO">TW, HK, MO</option>
                </select>
            </div>

            <TodayWidget />
            <SpendingSummary />
        </aside>
    );
};
