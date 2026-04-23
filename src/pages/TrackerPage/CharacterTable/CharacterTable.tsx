import { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper,
    type Row,
    type SortingState,
} from "@tanstack/react-table";
import type {
    CharacterData,
    CharacterId,
    Constellation,
    TalentLevel,
    TalentKey,
} from "@/types/character";
import { TALENT_KEYS } from "@/types/character";
import { REGION_ELEMENT } from "@/data/regions";
import { ASCENSION_LEVEL_CAPS } from "@/data/ascension";
import { talentBookLookupMap } from "@/data/talentBooks";
import { useTrackerStore } from "@/store/useTrackerStore";
import "./style.css";

const TALENT_HEADERS: Record<TalentKey, string> = {
    normal: "NA",
    skill: "E",
    burst: "Q",
};

const columnHelper = createColumnHelper<CharacterData>();

const useScrollInput = () => {
    return (el: HTMLInputElement | null) => {
        if (!el) return;
        const handler = (e: WheelEvent) => {
            if (document.activeElement === el) e.stopPropagation();
        };
        el.addEventListener("wheel", handler, { passive: false });
    };
};

const OwnedCell = ({ charId }: { charId: CharacterId }) => {
    const isOwned = !!useTrackerStore((state) => state.progress[charId]);
    const initializeCharacter = useTrackerStore((state) => state.initializeCharacter);
    const removeCharacter = useTrackerStore((state) => state.removeCharacter);

    return (
        <input
            type="checkbox"
            checked={isOwned}
            onChange={(e) =>
                e.target.checked ? initializeCharacter(charId) : removeCharacter(charId)
            }
        />
    );
};

const LevelCell = ({ charId }: { charId: CharacterId }) => {
    const scrollRef = useScrollInput();
    const level = useTrackerStore((state) => state.progress[charId]?.level);
    const ascension = useTrackerStore((state) => state.progress[charId]?.ascension);
    const ascensionMax = ASCENSION_LEVEL_CAPS[ascension ?? 0][1];
    const updateLevel = useTrackerStore((state) => state.updateLevel);
    const stepLevel = useTrackerStore((state) => state.stepLevel);

    if (level === undefined) return null;
    return (
        <label className="level-cell">
            <input
                type="number"
                value={level}
                ref={scrollRef}
                onChange={(e) => {
                    const newLevel = Math.max(1, Math.min(90, Number(e.target.value)));
                    if (Math.abs(newLevel - level) === 1) {
                        stepLevel(charId, newLevel);
                    } else {
                        updateLevel(charId, newLevel);
                    }
                }}
                min={1}
                max={90}
            />
            <span className="ascension-max">/{ascensionMax}</span>
        </label>
    );
};

const ConstellationCell = ({ charId }: { charId: CharacterId }) => {
    const scrollRef = useScrollInput();
    const constellation = useTrackerStore((state) => state.progress[charId]?.constellation);
    const updateConstellation = useTrackerStore((state) => state.updateConstellation);

    if (constellation === undefined) return null;
    return (
        <input
            type="number"
            value={constellation}
            ref={scrollRef}
            data-c6={constellation === 6}
            onChange={(e) =>
                updateConstellation(
                    charId,
                    Math.max(0, Math.min(6, Number(e.target.value))) as Constellation,
                )
            }
            min={0}
            max={6}
        />
    );
};

const TalentLevelCell = ({ charId, talentKey }: { charId: CharacterId; talentKey: TalentKey }) => {
    const scrollRef = useScrollInput();
    const talentLevel = useTrackerStore((state) => state.progress[charId]?.talents?.[talentKey]);
    const updateTalent = useTrackerStore((state) => state.updateTalent);

    if (talentLevel === undefined) return null;
    return (
        <input
            type="number"
            value={talentLevel}
            ref={scrollRef}
            data-crowned={talentLevel === 10}
            onChange={(e) => updateTalent(charId, talentKey, Number(e.target.value) as TalentLevel)}
            min={1}
            max={10}
        />
    );
};

const CharacterRow = ({ row }: { row: Row<CharacterData> }) => {
    const isOwned = !!useTrackerStore((state) => state.progress[row.original.id]);

    return (
        <tr
            data-owned={isOwned}
            onMouseLeave={() => (document.activeElement as HTMLElement)?.blur()}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    data-col={cell.column.id}
                    onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
                    onMouseEnter={(e) => {
                        const active = document.activeElement;
                        if (
                            active instanceof HTMLInputElement &&
                            active.type === "number" &&
                            active.closest("tr") === e.currentTarget.closest("tr")
                        ) {
                            const input = e.currentTarget.querySelector(
                                'input[type="number"]',
                            ) as HTMLInputElement;
                            input?.focus();
                        }
                    }}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
};

export const CharacterTable = ({ characters }: { characters: CharacterData[] }) => {
    const [sorting, setSorting] = useState<SortingState>([{ id: "release-patch", desc: true }]);

    const columns = useMemo(
        () => [
            columnHelper.accessor((row) => (useTrackerStore.getState().progress[row.id] ? 1 : 0), {
                id: "is-owned",
                header: "",
                cell: (info) => <OwnedCell charId={info.row.original.id} />,
            }),
            columnHelper.accessor("name", {
                header: "Name",
                cell: (info) => (
                    <span
                        style={
                            {
                                "--element-colour": `var(--colour-${info.row.original.element.toLowerCase()})`,
                            } as React.CSSProperties
                        }
                    >
                        {info.getValue()}
                    </span>
                ),
            }),
            columnHelper.accessor("element", {
                header: "Element",
                cell: (info) => {
                    const element = info.getValue();
                    return (
                        <span
                            className="pill"
                            style={
                                {
                                    "--pill-colour": `var(--colour-${element.toLowerCase()})`,
                                    "--pill-text": "var(--text-pill)",
                                } as React.CSSProperties
                            }
                        >
                            {element}
                        </span>
                    );
                },
            }),
            columnHelper.accessor("releasePatch", {
                id: "release-patch",
                header: "Patch",
                cell: (info) => <span className="pill">{info.getValue()}</span>,
            }),
            columnHelper.accessor("rarity", {
                header: "⭐",
                cell: (info) => {
                    const rarity = info.getValue();
                    return (
                        <span
                            className="pill"
                            style={
                                {
                                    "--pill-colour": `var(--colour-rarity-${rarity})`,
                                    "--pill-text": "var(--text-pill)",
                                } as React.CSSProperties
                            }
                        >
                            {rarity}
                        </span>
                    );
                },
            }),
            columnHelper.accessor((row) => useTrackerStore.getState().progress[row.id]?.level, {
                id: "level",
                header: "Lvl",
                sortUndefined: "last",
                cell: (info) => <LevelCell charId={info.row.original.id} />,
            }),
            columnHelper.accessor(
                (row) => useTrackerStore.getState().progress[row.id]?.constellation,
                {
                    id: "constellation",
                    header: "C",
                    sortUndefined: "last",
                    cell: (info) => <ConstellationCell charId={info.row.original.id} />,
                },
            ),
            ...TALENT_KEYS.map((talentKey) =>
                columnHelper.accessor(
                    (row) => useTrackerStore.getState().progress[row.id]?.talents?.[talentKey],
                    {
                        id: `talent-${talentKey}`,
                        header: TALENT_HEADERS[talentKey],
                        sortUndefined: "last",
                        cell: (info) => (
                            <TalentLevelCell charId={info.row.original.id} talentKey={talentKey} />
                        ),
                    },
                ),
            ),
            columnHelper.accessor("materials.talentBook", {
                id: "materials-talent-book",
                header: "Talent",
                cell: (info) => {
                    const material = info.getValue();
                    const bookData =
                        talentBookLookupMap[material as keyof typeof talentBookLookupMap];
                    const regionName = bookData?.region ?? material;
                    const element = REGION_ELEMENT[regionName];
                    return (
                        <span
                            className="pill"
                            style={
                                {
                                    "--pill-colour": `var(--colour-${element.toLowerCase()})`,
                                    "--pill-text": "var(--text-pill)",
                                } as React.CSSProperties
                            }
                        >
                            {material}
                        </span>
                    );
                },
            }),
            columnHelper.accessor("materials.ascensionBoss", {
                id: "materials-ascension-boss",
                header: "Ascension Boss",
                cell: (info) => <span className="pill">{info.getValue() ?? "-"}</span>,
            }),
            columnHelper.accessor("materials.weeklyBossMaterial", {
                id: "materials-weekly-boss-material",
                header: "Weekly Boss Material",
                cell: (info) => <span className="pill">{info.getValue() ?? "-"}</span>,
                // TODO: add weekly boss name?
            }),
        ],
        [],
    );

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: characters,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        onSortingChange: setSorting,
    });

    return (
        <table className="character-table">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <th
                                    key={header.id}
                                    data-col={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                    {{ asc: " ↑", desc: " ↓" }[
                                        header.column.getIsSorted() as string
                                    ] ?? ""}
                                </th>
                            );
                        })}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <CharacterRow key={row.id} row={row} />
                ))}
            </tbody>
        </table>
    );
};
