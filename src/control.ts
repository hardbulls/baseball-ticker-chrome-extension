import "./reset.css";
import "./shared.css";
import "./control.css";
import { Local } from "./storage/Local";
import { InningHalfEnum } from "./baseball/model/InningHalfEnum";
import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { BaseEnum } from "./baseball/model/BasesEnum";
import { removeOptions } from "./service/select";
import { DEFAULT_PLAYERS_STATE, DEFAULT_SCOREBOARD_STATE } from "./state/DefaultState";

document.title = `${document.title} | Version ${PACKAGE_VERSION}`;

function BaseButtonElement(id: string): HTMLButtonElement & { toggle: () => void; setActive: (active: boolean) => void } {
    const button = document.querySelector(id) as HTMLButtonElement & {
        toggle: () => void;
        setActive: (active: boolean) => void;
    };

    button["toggle"] = () => {
        button.classList.toggle("inactive-base");
        button.classList.toggle("active-base");
    };

    button["setActive"] = (active: boolean) => {
        if (active) {
            button.classList.remove("inactive-base");
            button.classList.add("active-base");
        } else {
            button.classList.add("inactive-base");
            button.classList.remove("active-base");
        }
    };

    return button;
}

(async () => {
    let scoreboard = {
        ...DEFAULT_SCOREBOARD_STATE,
        ...(await Local.getScoreboard()),
    };
    let playerState = {
        ...DEFAULT_PLAYERS_STATE,
        ...(await Local.getPlayers()),
    };

    const homeAddButton = document.querySelector("#home-add-button") as HTMLButtonElement;
    const homeMinusButton = document.querySelector("#home-minus-button") as HTMLButtonElement;
    const awayAddButton = document.querySelector("#away-add-button") as HTMLButtonElement;
    const awayMinusButton = document.querySelector("#away-minus-button") as HTMLButtonElement;

    const firstBaseButton = BaseButtonElement("#first-base-button");
    const secondBaseButton = BaseButtonElement("#second-base-button");
    const thirdBaseButton = BaseButtonElement("#third-base-button");

    const strikeButton = document.querySelector("#strike-button") as HTMLButtonElement;
    const ballButton = document.querySelector("#ball-button") as HTMLButtonElement;
    const outButton = document.querySelector("#out-button") as HTMLButtonElement;

    const inningAddButton = document.querySelector("#inning-add-button") as HTMLButtonElement;
    const inningMinusButton = document.querySelector("#inning-minus-button") as HTMLButtonElement;

    const resetBasesButton = document.querySelector("#reset-bases-button") as HTMLButtonElement;
    const resetCountButton = document.querySelector("#reset-count-button") as HTMLButtonElement;

    const homeBatterSelect = document.querySelector("#home-batter") as HTMLSelectElement;
    const awayBatterSelect = document.querySelector("#away-batter") as HTMLSelectElement;
    const homePitcherSelect = document.querySelector("#home-pitcher") as HTMLSelectElement;
    const awayPitcherSelect = document.querySelector("#away-pitcher") as HTMLSelectElement;

    function updatePlayerSelects() {
        removeOptions(homeBatterSelect);
        removeOptions(homePitcherSelect);
        removeOptions(awayBatterSelect);
        removeOptions(awayPitcherSelect);

        for (const player of playerState.homePlayers) {
            const selectedBatter = player.name === scoreboard.homeBatterName;
            const selectedPitcher = player.name === scoreboard.homePitcherName;

            if (player.isPlaying) {
                homeBatterSelect.options.add(new Option(`${player.number}: ${player.name}`, player.name, selectedBatter, selectedBatter));
                homePitcherSelect.options.add(
                    new Option(`${player.number}: ${player.name}`, player.name, selectedPitcher, selectedPitcher)
                );
            }
        }

        for (const player of playerState.awayPlayers) {
            const selectedBatter = player.name === scoreboard.awayBatterName;
            const selectedPitcher = player.name === scoreboard.awayPitcherName;

            if (player.isPlaying) {
                awayBatterSelect.options.add(new Option(`${player.number}: ${player.name}`, player.name, selectedBatter, selectedBatter));
                awayPitcherSelect.options.add(
                    new Option(`${player.number}: ${player.name}`, player.name, selectedPitcher, selectedPitcher)
                );
            }
        }
    }

    homeMinusButton.disabled = scoreboard.score[0] === 0;
    awayMinusButton.disabled = scoreboard.score[1] === 0;

    inningMinusButton.disabled = scoreboard.inning.value === 1 && scoreboard.inning.half === InningHalfEnum.TOP;

    resetBasesButton.disabled = scoreboard.bases.length === 0;
    resetCountButton.disabled = scoreboard.balls === 0 && scoreboard.strikes === 0;

    firstBaseButton.setActive(scoreboard.bases.includes(BaseEnum.FIRST));
    secondBaseButton.setActive(scoreboard.bases.includes(BaseEnum.SECOND));
    thirdBaseButton.setActive(scoreboard.bases.includes(BaseEnum.THIRD));

    homeBatterSelect.addEventListener("change", async (event) => {
        const select = event.target as HTMLSelectElement;

        scoreboard = {
            ...scoreboard,
            homeBatterName: select.value,
        };

        await Local.setScoreboard(scoreboard);
    });

    awayBatterSelect.addEventListener("change", async (event) => {
        const select = event.target as HTMLSelectElement;

        scoreboard = {
            ...scoreboard,
            awayBatterName: select.value,
        };

        await Local.setScoreboard(scoreboard);
    });

    homePitcherSelect.addEventListener("change", async (event) => {
        const select = event.target as HTMLSelectElement;

        scoreboard = {
            ...scoreboard,
            homePitcherName: select.value,
        };

        await Local.setScoreboard(scoreboard);
    });

    awayPitcherSelect.addEventListener("change", async (event) => {
        const select = event.target as HTMLSelectElement;

        scoreboard = {
            ...scoreboard,
            awayPitcherName: select.value,
        };

        await Local.setScoreboard(scoreboard);
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.players) {
            if (changes.players.newValue !== undefined) {
                playerState = changes.players.newValue;

                updatePlayerSelects();
            }
        }
    });

    updateValueLabels();
    updatePlayerSelects();

    const updateScoreValue = async <T extends keyof ScoreboardState>(key: T, value: ScoreboardState[T]) => {
        scoreboard = {
            ...scoreboard,
            [key]: value,
        };

        updateValueLabels();

        await Local.setScoreboard(scoreboard);
    };

    const resetCounts = async () => {
        scoreboard = {
            ...scoreboard,
            balls: 0,
            strikes: 0,
        };

        updateValueLabels();

        await Local.setScoreboard(scoreboard);

        resetCountButton.disabled = scoreboard.balls === 0 && scoreboard.strikes === 0;
    };

    function updateValueLabels() {
        (homeAddButton.querySelector(".value") as HTMLSpanElement).textContent = scoreboard.score[0].toString();
        (awayAddButton.querySelector(".value") as HTMLSpanElement).textContent = scoreboard.score[1].toString();
        (inningAddButton.querySelector(".value") as HTMLSpanElement).textContent = `${
            scoreboard.inning.half === InningHalfEnum.TOP ? "T" : "B"
        }${scoreboard.inning.value}`;
        (strikeButton.querySelector(".value") as HTMLSpanElement).textContent = scoreboard.strikes.toString();
        (ballButton.querySelector(".value") as HTMLSpanElement).textContent = scoreboard.balls.toString();
        (outButton.querySelector(".value") as HTMLSpanElement).textContent = scoreboard.outs.toString();
    }

    const updateInning = (value: number) => {
        let inningHalf = scoreboard.inning.half;
        let inningValue = scoreboard.inning.value;

        if (value < 0) {
            if (inningHalf === InningHalfEnum.TOP) {
                inningHalf = InningHalfEnum.BOTTOM;
                inningValue = Math.max(1, scoreboard.inning.value - 1);
            } else if (inningHalf === InningHalfEnum.BOTTOM) {
                inningHalf = InningHalfEnum.TOP;
                inningValue = Math.max(1, scoreboard.inning.value);
            }
        } else {
            if (inningHalf === InningHalfEnum.TOP) {
                inningHalf = InningHalfEnum.BOTTOM;
                inningValue = Math.max(1, scoreboard.inning.value);
            } else if (inningHalf === InningHalfEnum.BOTTOM) {
                inningHalf = InningHalfEnum.TOP;
                inningValue = Math.max(1, scoreboard.inning.value + 1);
            }
        }

        updateScoreValue("inning", {
            half: inningHalf,
            value: inningValue,
        });
    };

    function updateBase(base: BaseEnum, active: boolean) {
        if (active) {
            updateScoreValue("bases", [...scoreboard.bases, base]);

            return;
        }

        updateScoreValue(
            "bases",
            scoreboard.bases.filter((v) => v !== base)
        );
    }

    function clearBases() {
        updateScoreValue("bases", []);

        firstBaseButton.setActive(false);
        secondBaseButton.setActive(false);
        thirdBaseButton.setActive(false);
        resetBasesButton.disabled = scoreboard.bases.length === 0;
    }

    homeAddButton.addEventListener("click", () => {
        const value = scoreboard.score[0] + 1;
        updateScoreValue("score", [value, scoreboard.score[1]]);

        homeMinusButton.disabled = value === 0;
    });

    homeMinusButton.addEventListener("click", () => {
        const value = Math.max(0, scoreboard.score[0] - 1);
        updateScoreValue("score", [value, scoreboard.score[1]]);

        homeMinusButton.disabled = value === 0;
    });

    awayAddButton.addEventListener("click", () => {
        const value = scoreboard.score[1] + 1;

        updateScoreValue("score", [scoreboard.score[0], value]);

        awayMinusButton.disabled = value === 0;
    });

    awayMinusButton.addEventListener("click", () => {
        const value = Math.max(0, scoreboard.score[1] - 1);

        updateScoreValue("score", [scoreboard.score[0], value]);

        awayMinusButton.disabled = value === 0;
    });

    strikeButton.addEventListener("click", () => {
        const value = scoreboard.strikes === 2 ? 0 : scoreboard.strikes + 1;

        updateScoreValue("strikes", value);

        resetCountButton.disabled = scoreboard.balls === 0 && value === 0;
    });

    ballButton.addEventListener("click", () => {
        const value = scoreboard.balls === 3 ? 0 : scoreboard.balls + 1;

        updateScoreValue("balls", value);

        resetCountButton.disabled = value === 0 && scoreboard.strikes === 0;
    });

    outButton.addEventListener("click", () => {
        if (scoreboard.outs === 2) {
            updateScoreValue("outs", 0);

            return;
        }

        updateScoreValue("outs", scoreboard.outs + 1);
    });

    inningAddButton.addEventListener("click", () => {
        updateInning(1);
        clearBases();
        resetCounts();
        updateScoreValue("outs", 0);

        inningMinusButton.disabled = false;
    });

    inningMinusButton.addEventListener("click", () => {
        updateInning(-1);

        inningMinusButton.disabled = scoreboard.inning.value === 1 && scoreboard.inning.half === InningHalfEnum.TOP;
    });

    firstBaseButton.addEventListener("click", () => {
        const active = !scoreboard.bases.includes(BaseEnum.FIRST);

        updateBase(BaseEnum.FIRST, active);

        firstBaseButton.setActive(active);
        resetBasesButton.disabled = scoreboard.bases.length === 0;
    });

    secondBaseButton.addEventListener("click", () => {
        const active = !scoreboard.bases.includes(BaseEnum.SECOND);

        updateBase(BaseEnum.SECOND, active);

        secondBaseButton.setActive(active);
        resetBasesButton.disabled = scoreboard.bases.length === 0;
    });

    thirdBaseButton.addEventListener("click", () => {
        const active = !scoreboard.bases.includes(BaseEnum.THIRD);

        updateBase(BaseEnum.THIRD, active);

        thirdBaseButton.setActive(active);
        resetBasesButton.disabled = scoreboard.bases.length === 0;
    });

    resetCountButton.addEventListener("click", () => {
        resetCounts();
    });

    resetBasesButton.addEventListener("click", () => {
        clearBases();
    });
})();
