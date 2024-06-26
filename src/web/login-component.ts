import { setComponent } from "../lib/framework";
import "./login-component.css";

export class LoginComponent extends HTMLElement {
    private usernameInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;
    private loginButton: HTMLButtonElement;
    private loginErrorDiv: HTMLDivElement;

    constructor(
        defaultCredentials: { username?: string; password?: string },
        private onSubmit: (username: string, password: string) => Promise<undefined | Error>
    ) {
        super();

        this.style.height = "100%";

        this.innerHTML = this.render();

        this.usernameInput = this.querySelector("#login-username") as HTMLInputElement;
        this.passwordInput = this.querySelector("#login-password") as HTMLInputElement;
        this.loginButton = this.querySelector("#login-button") as HTMLButtonElement;
        this.loginErrorDiv = this.querySelector("#login-error") as HTMLDivElement;

        this.usernameInput.value = defaultCredentials.username || "";
        this.passwordInput.value = defaultCredentials.password || "";
        const form = this.querySelector("#login-form") as HTMLFormElement;

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            await this.submit();
        });
    }

    private async submit(): Promise<void> {
        this.loginButton.disabled = true;
        this.passwordInput.disabled = true;
        this.usernameInput.disabled = true;

        const error = await this.onSubmit(this.usernameInput.value, this.passwordInput.value);

        if (error) {
            this.usernameInput.classList.add("has-error");
            this.passwordInput.classList.add("has-error");
            this.loginErrorDiv.textContent = (error as Error).message;
        }

        this.passwordInput.disabled = false;
        this.usernameInput.disabled = false;
        this.loginButton.disabled = false;
    }

    private render(): string {
        return `
            <form id="login-form">
              <div>
                  <label for="login-username">Username</label>
                <input autocomplete="username" required type="email" id="login-username"/>
              </div>
              <div>
                  <label for="login-password">Password</label>
                <input autocomplete="current-password" required type="password" id="login-password"/>
              </div>
              <div>
                <button id="login-button">Login</button>
              </div>
              <div id="login-error"></div>
            </form>
        `;
    }
}

setComponent("login-component", LoginComponent);
