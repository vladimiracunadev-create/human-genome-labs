import type { BiologyDatabase, GameMode, GameQuestion } from "../../../../packages/biology-data/src/index.js";
export declare function resolveGameMode(mode: GameMode, random?: () => number): Exclude<GameMode, "mixed">;
export declare function createQuestion(mode: GameMode, database: BiologyDatabase, random?: () => number): GameQuestion;
export declare function calculateQuestionScore(correct: boolean, previousStreak: number, base: number, bonus: number): number;
