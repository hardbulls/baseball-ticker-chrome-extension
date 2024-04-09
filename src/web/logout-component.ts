import { setComponent } from "../lib/framework";
import "./logout-component.css";

export class LogoutComponent extends HTMLElement {
    private logoutButton: HTMLButtonElement;

    constructor(private onLogout: () => void) {
        super();

        this.style.height = "100%";

        this.innerHTML = this.render();

        this.logoutButton = this.querySelector("#logout-button") as HTMLButtonElement;

        this.logoutButton.addEventListener("click", () => {
            this.logout();
        });
    }

    private logout(): void {
        this.logoutButton.disabled = true;

        if (window.confirm("Logout from scoreboard?")) {
            this.onLogout();
        }

        this.logoutButton.disabled = false;
    }

    private render(): string {
        return `
          <button id="logout-button">Logout</button>
    `;
    }
}

setComponent("logout-component", LogoutComponent);
