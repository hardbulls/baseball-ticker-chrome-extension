import { ScoreboardState } from "../../lib/state/ScoreboardState";
import { DEFAULT_SCOREBOARD_STATE } from "../../lib/state/DefaultState";

export abstract class LocalStorage {
    public static getScoreboard = (): ScoreboardState => {
        return JSON.parse(localStorage.getItem("__scoreboard_state") || JSON.stringify(DEFAULT_SCOREBOARD_STATE)) as ScoreboardState;
    };

    public static setScoreboard = (scoreboard: ScoreboardState) => {
        localStorage.setItem("__scoreboard_state", JSON.stringify(scoreboard));
    };

    public static setDefaultCredentials = (username: string, password: string) => {
        localStorage.setItem("__scoreboard_user", JSON.stringify({ username, password }));
    };

    public static getDefaultCredentials(): { username: string; password: string } {
        return JSON.parse(localStorage.getItem("__scoreboard_user") || JSON.stringify({ username: "", password: "" })) as {
            username: string;
            password: string;
        };
    }
}
