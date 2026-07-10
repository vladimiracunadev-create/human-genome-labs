import { calculateQuestionScore, createQuestion } from "../game/game-engine.js";
import type { BiologyDatabase, GameMode, GameQuestion } from "../../../../packages/biology-data/src/index.js";
import { loadProgress, saveProgress } from "../game/storage.js";
import { all, byId, escapeHtml } from "./dom.js";

interface GameState {
  active: boolean;
  score: number;
  round: number;
  streak: number;
  lives: number;
  answered: boolean;
  current?: GameQuestion;
}

export class ChallengeController {
  readonly #database: BiologyDatabase;
  #state: GameState;
  #progress = loadProgress();

  constructor(database: BiologyDatabase) {
    this.#database = database;
    this.#state = { active: false, score: 0, round: 0, streak: 0, lives: database.game.scoring.lives, answered: false };
    this.#populateModes();
    this.#bindEvents();
    this.#updateHud();
    byId<HTMLElement>("highScore").textContent = this.#progress.highScore.toString();
  }

  #populateModes(): void {
    byId<HTMLSelectElement>("modeSelect").innerHTML = this.#database.game.modes
      .map((mode) => `<option value="${mode.id}">${escapeHtml(mode.name_es)}</option>`)
      .join("");
  }

  #bindEvents(): void {
    byId<HTMLButtonElement>("startGame").addEventListener("click", () => this.#start());
    byId<HTMLButtonElement>("nextQuestion").addEventListener("click", () => this.#next());
  }

  #start(): void {
    this.#state = { active: true, score: 0, round: 0, streak: 0, lives: this.#database.game.scoring.lives, answered: false };
    this.#updateHud();
    this.#next();
  }

  #next(): void {
    if (!this.#state.active) return;
    const rounds = this.#database.game.scoring.rounds;
    if (this.#state.round >= rounds || this.#state.lives <= 0) {
      this.#end();
      return;
    }

    this.#state.round += 1;
    this.#state.answered = false;
    const mode = byId<HTMLSelectElement>("modeSelect").value as GameMode;
    this.#state.current = createQuestion(mode, this.#database);
    byId<HTMLButtonElement>("nextQuestion").classList.add("hidden");
    const feedback = byId<HTMLParagraphElement>("feedback");
    feedback.textContent = "";
    feedback.className = "feedback";
    this.#renderQuestion(this.#state.current);
    this.#updateHud();
  }

  #renderQuestion(question: GameQuestion): void {
    byId<HTMLElement>("questionTag").textContent = question.label;
    byId<HTMLElement>("questionText").textContent = question.text;
    byId<HTMLElement>("questionVisual").textContent = question.visual;
    byId<HTMLDivElement>("answerOptions").innerHTML = question.options
      .map((option) => `<button class="answer" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`)
      .join("");
    all<HTMLButtonElement>(".answer").forEach((button) => {
      button.addEventListener("click", () => this.#answer(button.dataset.answer ?? ""));
    });
  }

  #answer(answer: string): void {
    const question = this.#state.current;
    if (!question || this.#state.answered) return;
    this.#state.answered = true;
    const correct = answer === question.correct;

    all<HTMLButtonElement>(".answer").forEach((button) => {
      button.disabled = true;
      if (button.dataset.answer === question.correct) button.classList.add("correct");
      else if (button.dataset.answer === answer) button.classList.add("wrong");
    });

    const feedback = byId<HTMLParagraphElement>("feedback");
    if (correct) {
      const gained = calculateQuestionScore(
        true,
        this.#state.streak,
        this.#database.game.scoring.correct_base,
        this.#database.game.scoring.streak_bonus,
      );
      this.#state.streak += 1;
      this.#state.score += gained;
      feedback.textContent = `¡Correcto! +${gained} puntos. ${question.explanation}`;
      feedback.className = "feedback good";
    } else {
      this.#state.streak = 0;
      this.#state.lives -= 1;
      feedback.textContent = `La respuesta era ${question.correct}. ${question.explanation}`;
      feedback.className = "feedback bad";
    }

    this.#updateHud();
    const nextButton = byId<HTMLButtonElement>("nextQuestion");
    const finished = this.#state.round >= this.#database.game.scoring.rounds || this.#state.lives <= 0;
    nextButton.textContent = finished ? "Ver resultado" : "Siguiente";
    nextButton.classList.remove("hidden");
  }

  #end(): void {
    this.#state.active = false;
    this.#progress.highScore = Math.max(this.#progress.highScore, this.#state.score);
    this.#progress.completedGames += 1;
    saveProgress(this.#progress);

    byId<HTMLElement>("highScore").textContent = this.#progress.highScore.toString();
    byId<HTMLElement>("questionTag").textContent = "PARTIDA TERMINADA";
    byId<HTMLElement>("questionText").textContent = this.#state.lives > 0 ? "¡Misión completada!" : "El ribosoma necesita una nueva oportunidad.";
    byId<HTMLElement>("questionVisual").textContent = `${this.#state.score} pts`;
    byId<HTMLDivElement>("answerOptions").innerHTML = "";
    const feedback = byId<HTMLParagraphElement>("feedback");
    feedback.textContent = `Completaste ${this.#state.round} de ${this.#database.game.scoring.rounds} rondas. Récord personal: ${this.#progress.highScore} puntos.`;
    feedback.className = "feedback good";
    byId<HTMLButtonElement>("nextQuestion").classList.add("hidden");
  }

  #updateHud(): void {
    byId<HTMLElement>("score").textContent = this.#state.score.toString();
    byId<HTMLElement>("round").textContent = `${this.#state.round}/${this.#database.game.scoring.rounds}`;
    byId<HTMLElement>("streak").textContent = this.#state.streak.toString();
    const totalLives = this.#database.game.scoring.lives;
    byId<HTMLElement>("lives").textContent = "♥".repeat(this.#state.lives) + "♡".repeat(Math.max(0, totalLives - this.#state.lives));
  }
}
