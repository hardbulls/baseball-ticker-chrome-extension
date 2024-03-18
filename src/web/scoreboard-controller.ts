import "../reset.css";
import "../shared.css";
import "./index.css";
import { InningHalfEnum } from "../baseball/model/InningHalfEnum";
import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { BaseEnum } from "../baseball/model/BasesEnum";
import { BaseButton } from "./base-button";
import { LocalStorage } from "../storage/LocalStorage";
import { setComponent } from "../framework";

export class ScoreboardController extends HTMLElement {
    private homeAddButton: HTMLButtonElement;
    private homeMinusButton: HTMLButtonElement;
    private awayAddButton: HTMLButtonElement;
    private awayMinusButton: HTMLButtonElement;
    private readonly firstBaseButton: BaseButton;
    private readonly thirdBaseButton: BaseButton;
    private readonly secondBaseButton: BaseButton;
    private strikeButton: HTMLButtonElement;
    private outButton: HTMLButtonElement;
    private ballButton: HTMLButtonElement;
    private resetBasesButton: HTMLButtonElement;
    private inningAddButton: HTMLButtonElement;
    private inningMinusButton: HTMLButtonElement;
    private resetCountButton: HTMLButtonElement;

    constructor(private scoreboardState: ScoreboardState, private handleUpdate: (scoreboardState: ScoreboardState) => Promise<void>) {
        super();

        this.innerHTML = this.render();

        this.homeAddButton = this.querySelector("#home-add-button") as HTMLButtonElement;
        this.homeMinusButton = this.querySelector("#home-minus-button") as HTMLButtonElement;
        this.awayAddButton = this.querySelector("#away-add-button") as HTMLButtonElement;
        this.awayMinusButton = this.querySelector("#away-minus-button") as HTMLButtonElement;

        this.firstBaseButton = new BaseButton(BaseEnum.FIRST, scoreboardState.bases.includes(BaseEnum.FIRST), () =>
            this.handleBaseClick(this.firstBaseButton)
        );
        this.secondBaseButton = new BaseButton(BaseEnum.SECOND, scoreboardState.bases.includes(BaseEnum.SECOND), () =>
            this.handleBaseClick(this.secondBaseButton)
        );
        this.thirdBaseButton = new BaseButton(BaseEnum.THIRD, scoreboardState.bases.includes(BaseEnum.THIRD), () =>
            this.handleBaseClick(this.thirdBaseButton)
        );

        const baseContainer = this.querySelector("#base-buttons") as HTMLDivElement;

        baseContainer.append(this.thirdBaseButton, this.secondBaseButton, this.firstBaseButton);

        this.strikeButton = this.querySelector("#strike-button") as HTMLButtonElement;
        this.ballButton = this.querySelector("#ball-button") as HTMLButtonElement;
        this.outButton = this.querySelector("#out-button") as HTMLButtonElement;

        this.inningAddButton = this.querySelector("#inning-add-button") as HTMLButtonElement;
        this.inningMinusButton = this.querySelector("#inning-minus-button") as HTMLButtonElement;

        this.resetBasesButton = this.querySelector("#reset-bases-button") as HTMLButtonElement;
        this.resetCountButton = this.querySelector("#reset-count-button") as HTMLButtonElement;

        this.homeAddButton.addEventListener("click", () => {
            const value = this.scoreboardState.score[0] + 1;
            this.updateScoreValue("score", [value, scoreboardState.score[1]]);

            this.homeMinusButton.disabled = value === 0;
        });

        this.homeMinusButton.addEventListener("click", () => {
            const value = Math.max(0, scoreboardState.score[0] - 1);
            this.updateScoreValue("score", [value, scoreboardState.score[1]]);

            this.homeMinusButton.disabled = value === 0;
        });

        this.awayAddButton.addEventListener("click", () => {
            const value = this.scoreboardState.score[1] + 1;

            this.updateScoreValue("score", [this.scoreboardState.score[0], value]);

            this.awayMinusButton.disabled = value === 0;
        });

        this.awayMinusButton.addEventListener("click", () => {
            const value = Math.max(0, this.scoreboardState.score[1] - 1);

            this.updateScoreValue("score", [this.scoreboardState.score[0], value]);

            this.awayMinusButton.disabled = value === 0;
        });

        this.strikeButton.addEventListener("click", () => {
            const value = this.scoreboardState.strikes === 2 ? 0 : this.scoreboardState.strikes + 1;

            this.updateScoreValue("strikes", value);

            this.resetCountButton.disabled = this.scoreboardState.balls === 0 && value === 0;
        });

        this.ballButton.addEventListener("click", () => {
            const value = this.scoreboardState.balls === 3 ? 0 : this.scoreboardState.balls + 1;

            this.updateScoreValue("balls", value);

            this.resetCountButton.disabled = value === 0 && this.scoreboardState.strikes === 0;
        });

        this.outButton.addEventListener("click", () => {
            if (this.scoreboardState.outs === 2) {
                this.updateScoreValue("outs", 0);

                return;
            }

            this.updateScoreValue("outs", this.scoreboardState.outs + 1);
        });

        this.resetBasesButton.addEventListener("click", () => {
            this.clearBases();
        });

        this.resetCountButton.addEventListener("click", () => {
            this.resetCounts();
        });

        this.inningAddButton.addEventListener("click", () => {
            this.updateInning(1);
            this.clearBases();
            this.resetCounts();
            this.updateScoreValue("outs", 0);

            this.inningMinusButton.disabled = false;
        });

        this.inningMinusButton.addEventListener("click", () => {
            this.updateInning(-1);

            this.inningMinusButton.disabled =
                this.scoreboardState.inning.value === 1 && this.scoreboardState.inning.half === InningHalfEnum.TOP;
        });

        this.setState(scoreboardState);
    }

    private handleBaseClick = (button: BaseButton) => {
        const active = !this.scoreboardState.bases.includes(button.base);

        this.updateBase(button.base, active);

        button.setActive(active);
        this.resetBasesButton.disabled = this.scoreboardState.bases.length === 0;
    };

    public setState(scoreboardState: ScoreboardState): void {
        this.scoreboardState = scoreboardState;
        this.updateValueLabels();

        this.resetBasesButton.disabled = this.scoreboardState.bases.length === 0;
        this.resetCountButton.disabled = this.scoreboardState.balls === 0 && this.scoreboardState.strikes === 0;
        this.homeMinusButton.disabled = this.scoreboardState.score[0] === 0;
        this.awayMinusButton.disabled = this.scoreboardState.score[1] === 0;
        this.inningMinusButton.disabled =
            this.scoreboardState.inning.value === 1 && this.scoreboardState.inning.half === InningHalfEnum.TOP;

        if (this.scoreboardState.bases.includes(BaseEnum.FIRST)) {
            this.firstBaseButton.setActive(true);
        }

        if (this.scoreboardState.bases.includes(BaseEnum.SECOND)) {
            this.secondBaseButton.setActive(true);
        }

        if (this.scoreboardState.bases.includes(BaseEnum.THIRD)) {
            this.thirdBaseButton.setActive(true);
        }
    }

    private updateValueLabels() {
        (this.homeAddButton.querySelector(".value") as HTMLSpanElement).textContent = this.scoreboardState.score[0].toString();
        (this.awayAddButton.querySelector(".value") as HTMLSpanElement).textContent = this.scoreboardState.score[1].toString();
        (this.inningAddButton.querySelector(".value") as HTMLSpanElement).textContent = `${
            this.scoreboardState.inning.half === InningHalfEnum.TOP ? "T" : "B"
        }${this.scoreboardState.inning.value}`;

        (this.strikeButton.querySelector(".value") as HTMLSpanElement).textContent = this.scoreboardState.strikes.toString();
        (this.ballButton.querySelector(".value") as HTMLSpanElement).textContent = this.scoreboardState.balls.toString();
        (this.outButton.querySelector(".value") as HTMLSpanElement).textContent = this.scoreboardState.outs.toString();
    }

    private updateScoreValue = <T extends keyof ScoreboardState>(key: T, value: ScoreboardState[T]) => {
        this.scoreboardState = {
            ...this.scoreboardState,
            [key]: value,
        };

        this.updateValueLabels();
        this.handleUpdate(this.scoreboardState);
    };

    private updateBase(base: BaseEnum, active: boolean) {
        if (active) {
            this.updateScoreValue("bases", [...this.scoreboardState.bases, base]);

            return;
        }

        this.updateScoreValue(
            "bases",
            this.scoreboardState.bases.filter((v) => v !== base)
        );
    }

    private clearBases() {
        this.updateScoreValue("bases", []);

        this.firstBaseButton.setActive(false);
        this.secondBaseButton.setActive(false);
        this.thirdBaseButton.setActive(false);
        this.resetBasesButton.disabled = this.scoreboardState.bases.length === 0;
    }

    private resetCounts = () => {
        this.scoreboardState = {
            ...this.scoreboardState,
            balls: 0,
            strikes: 0,
        };

        this.updateValueLabels();

        LocalStorage.setScoreboard(this.scoreboardState);

        this.resetCountButton.disabled = this.scoreboardState.balls === 0 && this.scoreboardState.strikes === 0;
    };

    private updateInning = (value: number) => {
        let inningHalf = this.scoreboardState.inning.half;
        let inningValue = this.scoreboardState.inning.value;

        if (value < 0) {
            if (inningHalf === InningHalfEnum.TOP) {
                inningHalf = InningHalfEnum.BOTTOM;
                inningValue = Math.max(1, this.scoreboardState.inning.value - 1);
            } else if (inningHalf === InningHalfEnum.BOTTOM) {
                inningHalf = InningHalfEnum.TOP;
                inningValue = Math.max(1, this.scoreboardState.inning.value);
            }
        } else {
            if (inningHalf === InningHalfEnum.TOP) {
                inningHalf = InningHalfEnum.BOTTOM;
                inningValue = Math.max(1, this.scoreboardState.inning.value);
            } else if (inningHalf === InningHalfEnum.BOTTOM) {
                inningHalf = InningHalfEnum.TOP;
                inningValue = Math.max(1, this.scoreboardState.inning.value + 1);
            }
        }

        this.updateScoreValue("inning", {
            half: inningHalf,
            value: inningValue,
        });
    };

    private render(): string {
        return `
    <div class="controller-scoreboard">
      <div class="controller-row">
        <button id="home-add-button">Home +<span class="value"></span></button>
        <button id="home-minus-button">Home -</button>
        <button id="away-add-button">Away +<span class="value"></span></button>
        <button id="away-minus-button">Away -</button>
      </div>
      <div class="controller-row" id="base-buttons">
      </div>
      <div class="controller-row">
        <button id="strike-button">Strike<span class="value"></span></button>
        <button id="ball-button">Ball<span class="value"></span></button>
        <button id="out-button">Out<span class="value"></span></button>
      </div>
      <div class="controller-row">
        <button id="inning-add-button">Inning +<span class="value"></span></button>
        <button id="inning-minus-button">Inning -</button>
        <button id="reset-bases-button">Reset Bases</button>
        <button id="reset-count-button">Reset Count</button>
      </div>
    </div>
    `;
    }
}

setComponent("scoreboard-controller", ScoreboardController);
