export interface SavedProgress {
  highScore: number;
  lastProtein: string;
  completedGames: number;
}

const KEY = "human-genome-labs-game-progress-v1";
const DEFAULT_PROGRESS: SavedProgress = { highScore: 0, lastProtein: "", completedGames: 0 };

export function loadProgress(storage: Storage = localStorage): SavedProgress {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<SavedProgress>;
    return {
      highScore: Number.isFinite(parsed.highScore) ? Number(parsed.highScore) : 0,
      lastProtein: typeof parsed.lastProtein === "string" ? parsed.lastProtein : "",
      completedGames: Number.isFinite(parsed.completedGames) ? Number(parsed.completedGames) : 0,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: SavedProgress, storage: Storage = localStorage): void {
  storage.setItem(KEY, JSON.stringify(progress));
}
