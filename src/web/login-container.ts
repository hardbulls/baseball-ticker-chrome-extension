import { setComponent } from "../framework";
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

        const loginComponent = new LoginComponent(defaultCredentials, async (username, password) => {
            return await handleLogin(username, password);
        });

        this.append(loginComponent);
    }
}

setComponent("login-container", LoginContainer);
