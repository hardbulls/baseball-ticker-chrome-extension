import { setComponent } from "../framework";
import { BaseEnum } from "../baseball/model/BasesEnum";

export class BaseButton extends HTMLElement {
    private button: HTMLButtonElement;

    constructor(public readonly base: BaseEnum, private isActive: boolean = false, onClick: () => void) {
        super();

        this.innerHTML = this.render();
        this.button = this.querySelector(`#base-${this.base}-button`) as HTMLButtonElement;

        this.button.addEventListener("click", () => {
            onClick();
        });

        this.style.width = "100%";

        this.setActive(isActive);
    }

    public toggle() {
        this.isActive = !this.isActive;

        this.button.classList.toggle("inactive-base");
        this.button.classList.toggle("active-base");
    }

    public setActive(active: boolean) {
        this.isActive = active;

        if (active) {
            this.button.classList.remove("inactive-base");
            this.button.classList.add("active-base");
        } else {
            this.button.classList.add("inactive-base");
            this.button.classList.remove("active-base");
        }
    }

    private render(): string {
        return `
      <button id="base-${this.base}-button">${this.base}. Base</button>
    `;
    }
}

setComponent("base-button", BaseButton);
