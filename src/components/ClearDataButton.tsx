import { useTrackerStore } from "@/store/useTrackerStore";

export const ClearDataButton = () => {
    const progress = useTrackerStore((state) => state.progress);
    const clearProgress = useTrackerStore((state) => state.clearProgress);

    const handleClear = () => {
        const isEmpty = Object.keys(progress).length === 0;
        if (isEmpty || window.confirm("Delete all data?")) clearProgress();
    };

    return <button onClick={handleClear}>Clear Data</button>;
};