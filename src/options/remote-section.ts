import { RemoteState } from "./RemoteState";

export class RemoteSection extends HTMLElement {
    private firebaseConfigInput: HTMLTextAreaElement;
    private usernameInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;

    constructor(private state?: RemoteState) {
        super();

        this.innerHTML = this.render();

        this.firebaseConfigInput = this.querySelector("#firebase-config") as HTMLTextAreaElement;
        this.usernameInput = this.querySelector("#firebase-username") as HTMLInputElement;
        this.passwordInput = this.querySelector("#firebase-password") as HTMLInputElement;

        if (this.state?.firebaseConfig) {
            this.firebaseConfigInput.value = JSON.stringify(this.state.firebaseConfig, null, 2);
        }

        if (this.state?.username) {
            this.usernameInput.value = this.state?.username;
        }

        if (this.state?.password) {
            this.passwordInput.value = this.state?.password;
        }
    }

    public getState(): RemoteState {
        return {
            firebaseConfig: this.firebaseConfigInput.value && JSON.parse(this.firebaseConfigInput.value),
            username: this.usernameInput.value,
            password: this.passwordInput.value,
        };
    }

    private render(): string {
        return `
      <h3>Remote Settings</h3>
      <div class="settings-row">
         <div class="settings-column">
           <label for="firebase-config">Firebase Config</label>
         </div>
      </div>
    
      <div class="settings-row">
        <div class="settings-column">
          <textarea id="firebase-config" rows="15" style="width: 100%; resize: both" cols="40"></textarea>
        </div>
      </div>
      
      <div class="settings-row">
        <div class="settings-column">
           <label for="firebase-username">Username</label>
        </div>
        <div class="settings-column">
          <input type="text" id="firebase-username"/>
        </div>
      </div>
      
      <div class="settings-row">
        <div class="settings-column">
           <label for="firebase-password">Password</label>
        </div>
        <div class="settings-column">
          <input type="password" id="firebase-password"/>
        </div>
      </div>
   `;
    }
}
