import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { DEFAULT_SCOREBOARD_STATE } from "../state/DefaultState";

export abstract class LocalStorage {
    public static getScoreboard = (): ScoreboardState => {
        return JSON.parse(localStorage.getItem("__scoreboard_state") || JSON.stringify(DEFAULT_SCOREBOARD_STATE)) as ScoreboardState;
    };

    public static setScoreboard = (scoreboard: ScoreboardState) => {
        localStorage.setItem("__scoreboard_state", JSON.stringify(scoreboard));
    };
}
