import { SponsorsRepository } from "../../lib/api/SponsorsRepository";
import { sleep } from "../../lib/helper/sleep";
import { SponsorsState } from "../../lib/state/SponsorsState";
import { setComponent } from "../../lib/framework";

export class SponsorsSection extends HTMLElement {
    private updateSponsorsButton: HTMLButtonElement;
    private sponsorsTitleInput: HTMLInputElement;
    private sponsorsIntervalInput: HTMLInputElement;
    private sponsorsCountElement: HTMLSpanElement;
    private sponsors: string[] = [];

    constructor(private state: SponsorsState) {
        super();

        this.sponsors = this.state.sponsors;
        this.innerHTML = this.render();

        this.sponsorsTitleInput = this.querySelector("#sponsors-title") as HTMLInputElement;
        this.sponsorsIntervalInput = this.querySelector("#sponsors-interval") as HTMLInputElement;
        this.updateSponsorsButton = this.querySelector("#update-sponsors") as HTMLButtonElement;
        this.sponsorsCountElement = this.querySelector("#sponsors-count") as HTMLSpanElement;

        this.sponsorsTitleInput.value = state.sponsorsTitle;
        this.sponsorsIntervalInput.value = state.sponsorsInterval.toString();

        this.updateSponsorsButton.addEventListener("click", async () => {
            this.updateSponsorsButton.disabled = true;
            this.sponsorsCountElement.textContent = "Downloading";
            this.sponsorsCountElement.style.opacity = "0.5";

            await Promise.all([this.loadSponsors(), sleep(300)]);
            this.sponsorsCountElement.style.opacity = "1";
            this.updateSponsorCountLabel();

            this.updateSponsorsButton.disabled = false;
        });

        this.updateSponsorCountLabel();
    }

    private updateSponsorCountLabel() {
        this.sponsorsCountElement.textContent = `${this.sponsors.length} Sponsors`;
    }

    private async loadSponsors() {
        this.sponsors = await SponsorsRepository.download();
    }

    public getState(): SponsorsState {
        return {
            sponsors: this.sponsors,
            sponsorsInterval: Number.parseInt(this.sponsorsIntervalInput.value) || this.state.sponsorsInterval,
            sponsorsTitle: this.sponsorsTitleInput.value,
        };
    }

    private render(): string {
        return `
      <h3>Sponsor Settings</h3>
      <div class="settings-row">
        <label for="sponsors-title">Sponsors Title</label>
        <input type="text" id="sponsors-title" />
      </div>
      <div class="settings-row">
        <div class="settings-column">
            <label for="sponsors-interval">Sponsors Interval</label>
        </div>
        <div class="settings-column">
            <input type="number" id="sponsors-interval" min="1000" step="1000" />
        </div>
      </div>

      <div class="settings-row">
        <div class="settings-column">
            <button id="update-sponsors">Download Sponsors</button>
        </div>
        <div class="settings-column">
          <span id="sponsors-count"></span>
        </div>
      </div>
   `;
    }
}

setComponent("sponsors-section", SponsorsSection);
