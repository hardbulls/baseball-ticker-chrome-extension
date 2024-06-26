import "./login-container.css";
import { setComponent } from "../lib/framework";
import { LoginComponent } from "./login-component";

export class LoginContainer extends HTMLElement {
    constructor(
        handleLogin: (username: string, password: string) => Promise<undefined | Error>,
        defaultCredentials: {
            username?: string;
            password?: string;
        }
    ) {
        super();

        this.innerHTML = this.render();
        this.style.marginInline = "24px";

        const loginComponent = new LoginComponent(defaultCredentials, async (username, password) => {
            return await handleLogin(username, password);
        });

        (this.querySelector("#login-form-container") as HTMLDivElement).append(loginComponent);
        const downloadCxtButton = this.querySelector("#download-cxt-button") as HTMLButtonElement;

        downloadCxtButton.addEventListener("click", () => {
            window.open("./hard-bulls-baseball-ticker-cxt.zip");
        });
    }

    private render(): string {
        return `
            <div style="margin-inline: 24px;">
              <div id="login-form-container"></div>
              <div>
                <button id="download-cxt-button">Download Chrome Extension</button>
              </div>
            </div>
        `;
    }
}

setComponent("login-container", LoginContainer);
