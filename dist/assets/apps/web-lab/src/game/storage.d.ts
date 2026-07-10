export interface SavedProgress {
    highScore: number;
    lastProtein: string;
    completedGames: number;
}
export declare function loadProgress(storage?: Storage): SavedProgress;
export declare function saveProgress(progress: SavedProgress, storage?: Storage): void;
