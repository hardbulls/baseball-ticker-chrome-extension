import { setComponent } from "../framework";
import { LogoutComponent } from "./logout-component";
import { ScoreboardController } from "./scoreboard-controller";
import { ScoreboardState } from "../baseball/model/ScoreboardState";

export class ScoreboardContainer extends HTMLElement {
    constructor(handleLogout: () => void, scoreboardState: ScoreboardState) {
        super();

        const logoutComponent = new LogoutComponent(() => {
            handleLogout();
        });

        logoutComponent.style.height = "10%";

        const scoreboardController = new ScoreboardController(scoreboardState);

        scoreboardController.style.height = "90%";

        this.style.height = "100%";
        this.style.display = "flex";
        this.style.flexDirection = "column";
        this.style.justifyContent = "stretch";

        this.append(scoreboardController);
        this.append(logoutComponent);
    }
}

setComponent("scoreboard-container", ScoreboardContainer);
