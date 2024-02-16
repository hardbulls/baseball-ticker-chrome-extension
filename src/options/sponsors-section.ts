import { SponsorsRepository } from "../api/SponsorsRepository"
import { sleep } from "../helper/sleep"
import { SponsorsState } from "./SponsorsState"

export class SponsorsSection extends HTMLElement {
    private updateSponsorsButton: HTMLButtonElement
    private sponsorsTitleInput: HTMLInputElement
    private sponsorsIntervalInput: HTMLInputElement
    private sponsors: string[] = []

    constructor(private state: SponsorsState) {
        super()

        this.sponsors = this.state.sponsors
        this.innerHTML = this.render()

        this.sponsorsTitleInput = this.querySelector("#sponsors-title") as HTMLInputElement
        this.sponsorsIntervalInput = this.querySelector("#sponsors-interval") as HTMLInputElement
        this.updateSponsorsButton = this.querySelector("#update-sponsors") as HTMLButtonElement

        this.sponsorsTitleInput.value = state.sponsorsTitle
        this.sponsorsIntervalInput.value = state.sponsorsInterval.toString()

        this.updateSponsorsButton.addEventListener("click", async () => {
            this.updateSponsorsButton.disabled = true

            await Promise.all([this.loadSponsors(), sleep(300)])

            this.updateSponsorsButton.disabled = false
        })
    }

    private async loadSponsors() {
        this.sponsors = await SponsorsRepository.download()
    }

    public getState(): SponsorsState {
        return {
            sponsors: this.sponsors,
            sponsorsInterval: Number.parseInt(this.sponsorsIntervalInput.value) || this.state.sponsorsInterval,
            sponsorsTitle: this.sponsorsTitleInput.value,
        }
    }

    private render(): string {
        return `
      <h3>Sponsor Settings</h3>
      <div class="settings-row">
        <label for="sponsors-title">Sponsors Title</label>
        <input type="text" id="sponsors-title" />
      </div>
      <div class="settings-row">
        <label for="sponsors-interval">Sponsors Interval</label>
        <input type="number" id="sponsors-interval" min="1000" step="1000" />
      </div>

      <div class="settings-row">
        <button id="update-sponsors">Download Sponsors</button>
      </div>
   `
    }
}
