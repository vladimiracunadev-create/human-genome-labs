import { calculateQuestionScore, createQuestion } from "../game/game-engine.js";
import { loadProgress, saveProgress } from "../game/storage.js";
import { all, byId, escapeHtml } from "./dom.js";
export class ChallengeController {
    #database;
    #state;
    #progress = loadProgress();
    constructor(database) {
        this.#database = database;
        this.#state = { active: false, score: 0, round: 0, streak: 0, lives: database.game.scoring.lives, answered: false };
        this.#populateModes();
        this.#bindEvents();
        this.#updateHud();
        byId("highScore").textContent = this.#progress.highScore.toString();
    }
    #populateModes() {
        byId("modeSelect").innerHTML = this.#database.game.modes
            .map((mode) => `<option value="${mode.id}">${escapeHtml(mode.name_es)}</option>`)
            .join("");
    }
    #bindEvents() {
        byId("startGame").addEventListener("click", () => this.#start());
        byId("nextQuestion").addEventListener("click", () => this.#next());
    }
    #start() {
        this.#state = { active: true, score: 0, round: 0, streak: 0, lives: this.#database.game.scoring.lives, answered: false };
        this.#updateHud();
        this.#next();
    }
    #next() {
        if (!this.#state.active)
            return;
        const rounds = this.#database.game.scoring.rounds;
        if (this.#state.round >= rounds || this.#state.lives <= 0) {
            this.#end();
            return;
        }
        this.#state.round += 1;
        this.#state.answered = false;
        const mode = byId("modeSelect").value;
        this.#state.current = createQuestion(mode, this.#database);
        byId("nextQuestion").classList.add("hidden");
        const feedback = byId("feedback");
        feedback.textContent = "";
        feedback.className = "feedback";
        this.#renderQuestion(this.#state.current);
        this.#updateHud();
    }
    #renderQuestion(question) {
        byId("questionTag").textContent = question.label;
        byId("questionText").textContent = question.text;
        byId("questionVisual").textContent = question.visual;
        byId("answerOptions").innerHTML = question.options
            .map((option) => `<button class="answer" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`)
            .join("");
        all(".answer").forEach((button) => {
            button.addEventListener("click", () => this.#answer(button.dataset.answer ?? ""));
        });
    }
    #answer(answer) {
        const question = this.#state.current;
        if (!question || this.#state.answered)
            return;
        this.#state.answered = true;
        const correct = answer === question.correct;
        all(".answer").forEach((button) => {
            button.disabled = true;
            if (button.dataset.answer === question.correct)
                button.classList.add("correct");
            else if (button.dataset.answer === answer)
                button.classList.add("wrong");
        });
        const feedback = byId("feedback");
        if (correct) {
            const gained = calculateQuestionScore(true, this.#state.streak, this.#database.game.scoring.correct_base, this.#database.game.scoring.streak_bonus);
            this.#state.streak += 1;
            this.#state.score += gained;
            feedback.textContent = `¡Correcto! +${gained} puntos. ${question.explanation}`;
            feedback.className = "feedback good";
        }
        else {
            this.#state.streak = 0;
            this.#state.lives -= 1;
            feedback.textContent = `La respuesta era ${question.correct}. ${question.explanation}`;
            feedback.className = "feedback bad";
        }
        this.#updateHud();
        const nextButton = byId("nextQuestion");
        const finished = this.#state.round >= this.#database.game.scoring.rounds || this.#state.lives <= 0;
        nextButton.textContent = finished ? "Ver resultado" : "Siguiente";
        nextButton.classList.remove("hidden");
    }
    #end() {
        this.#state.active = false;
        this.#progress.highScore = Math.max(this.#progress.highScore, this.#state.score);
        this.#progress.completedGames += 1;
        saveProgress(this.#progress);
        byId("highScore").textContent = this.#progress.highScore.toString();
        byId("questionTag").textContent = "PARTIDA TERMINADA";
        byId("questionText").textContent = this.#state.lives > 0 ? "¡Misión completada!" : "El ribosoma necesita una nueva oportunidad.";
        byId("questionVisual").textContent = `${this.#state.score} pts`;
        byId("answerOptions").innerHTML = "";
        const feedback = byId("feedback");
        feedback.textContent = `Completaste ${this.#state.round} de ${this.#database.game.scoring.rounds} rondas. Récord personal: ${this.#progress.highScore} puntos.`;
        feedback.className = "feedback good";
        byId("nextQuestion").classList.add("hidden");
    }
    #updateHud() {
        byId("score").textContent = this.#state.score.toString();
        byId("round").textContent = `${this.#state.round}/${this.#database.game.scoring.rounds}`;
        byId("streak").textContent = this.#state.streak.toString();
        const totalLives = this.#database.game.scoring.lives;
        byId("lives").textContent = "♥".repeat(this.#state.lives) + "♡".repeat(Math.max(0, totalLives - this.#state.lives));
    }
}
//# sourceMappingURL=challenge-controller.js.map