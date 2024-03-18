import { setComponent } from "../framework";
import { LogoutComponent } from "./logout-component";
import { ScoreboardController } from "./scoreboard-controller";
import { ScoreboardState } from "../baseball/model/ScoreboardState";

export class ScoreboardContainer extends HTMLElement {
    private readonly scoreboardController: ScoreboardController;

    constructor(
        handleLogout: () => void,
        scoreboardState: ScoreboardState,
        handleScoreboardUpdate: (scoreboardState: ScoreboardState) => Promise<void>
    ) {
        super();

        const logoutComponent = new LogoutComponent(() => {
            handleLogout();
        });

        logoutComponent.style.height = "10%";

        this.scoreboardController = new ScoreboardController(scoreboardState, (state) => handleScoreboardUpdate(state));

        this.scoreboardController.style.height = "90%";

        this.style.height = "100%";
        this.style.display = "flex";
        this.style.flexDirection = "column";
        this.style.justifyContent = "stretch";

        this.append(this.scoreboardController);
        this.append(logoutComponent);
    }

    public setScoreboardState(scoreboardState: ScoreboardState): void {
        this.scoreboardController.setState(scoreboardState);
    }
}

setComponent("scoreboard-container", ScoreboardContainer);
