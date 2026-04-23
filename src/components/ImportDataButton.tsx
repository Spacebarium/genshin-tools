import React, { useRef } from "react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { mapJsonToCharacterProgress } from "@/utils/importHandler";

export const ImportDataButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const progress = useTrackerStore((state) => state.progress);
    const setProgress = useTrackerStore((state) => state.setProgress);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);

                if (!json || !Array.isArray(json.characters)) {
                    throw new Error("Invalid JSON structure. Expected an array of characters.");
                }

                const isEmpty = Object.keys(progress).length === 0;
                const mappedData = mapJsonToCharacterProgress(json, progress);

                if (isEmpty || window.confirm("Overwrite current progress?")) {
                    setProgress(mappedData);
                }
            } catch (err) {
                alert(`Import failed: ${err instanceof Error ? err.message : "Invalid file"}`);
            }

            event.target.value = "";
        };
        reader.readAsText(file);
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
                accept=".json"
            />
            <button onClick={() => fileInputRef.current?.click()}>Import from Irminsul / GO</button>
        </>
    );
};
