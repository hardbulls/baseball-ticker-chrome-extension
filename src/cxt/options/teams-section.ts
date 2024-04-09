import { GradientPicker } from "../overlay/gradient-picker";
import { TeamState } from "../../lib/state/TeamState";
import { TeamsRepository } from "../../lib/api/TeamsRepository";
import { resizeImage } from "../../lib/helper/image-resize";
import { convertFileToBase64 } from "../../lib/helper/file-to-base64";
import { setComponent } from "../../lib/framework";

const convertAndResizeImage = async (file: File | Blob) => {
    return await resizeImage(100, await convertFileToBase64(file));
};

export class TeamSection extends HTMLElement {
    private homeNameInput: HTMLInputElement;
    private awayLogoInput: HTMLInputElement;
    private homeGradient: GradientPicker;
    private awayTeamSelect: HTMLSelectElement;
    private homeTeamSelect: HTMLSelectElement;
    private awayNameInput: HTMLInputElement;
    private awayGradient: GradientPicker;
    private homeShadowInput: HTMLInputElement;
    private awayShadowInput: HTMLInputElement;
    private homeLogoInput: HTMLInputElement;
    private uploadedHomeFile?: string | undefined = undefined;
    private uploadedAwayFile?: string | undefined = undefined;

    constructor(private state: TeamState) {
        super();

        this.innerHTML = this.render();

        this.homeNameInput = this.querySelector("#home-name") as HTMLInputElement;
        this.homeTeamSelect = this.querySelector("#home-team-select") as HTMLSelectElement;
        this.awayNameInput = this.querySelector("#away-name") as HTMLInputElement;
        this.awayTeamSelect = this.querySelector("#away-team-select") as HTMLSelectElement;

        this.homeGradient = new GradientPicker();

        (this.querySelector("#home-gradient") as HTMLDivElement).append(this.homeGradient);

        this.awayGradient = new GradientPicker();

        (this.querySelector("#away-gradient") as HTMLDivElement).append(this.awayGradient);

        this.homeShadowInput = this.querySelector("#home-shadow-color") as HTMLInputElement;
        this.awayShadowInput = this.querySelector("#away-shadow-color") as HTMLInputElement;
        this.homeLogoInput = this.querySelector("#home-logo") as HTMLInputElement;
        this.awayLogoInput = this.querySelector("#away-logo") as HTMLInputElement;

        this.homeNameInput.value = this.state.home;
        this.awayNameInput.value = this.state.away;

        this.homeGradient.gradient = this.state.homeGradient;
        this.awayGradient.gradient = this.state.awayGradient;
        this.homeShadowInput.value = this.state.homeLogoShadow;
        this.awayShadowInput.value = this.state.awayLogoShadow;

        this.uploadedHomeFile = this.state.homeLogo;
        this.uploadedAwayFile = this.state.awayLogo;

        for (const [teamId, team] of Object.entries(TeamsRepository.findAll())) {
            this.homeTeamSelect.options.add(new Option(team.name, teamId));
            this.awayTeamSelect.options.add(new Option(team.name, teamId));
        }

        this.homeLogoInput.addEventListener("change", async (event) => {
            const upload = event.target as HTMLInputElement;
            const file = upload.files?.[0];

            if (file) {
                this.uploadedHomeFile = await convertAndResizeImage(file);
            }
        });

        this.awayLogoInput.addEventListener("change", async (event) => {
            const upload = event.target as HTMLInputElement;
            const file = upload.files?.[0];

            if (file) {
                this.uploadedAwayFile = await convertAndResizeImage(file);
            }
        });

        this.homeTeamSelect.addEventListener("change", async (event) => {
            const select = event.target as HTMLSelectElement;
            const homeTeam = TeamsRepository.findById(select.value);

            this.homeGradient.gradient = homeTeam.gradient;
            this.homeShadowInput.value = homeTeam.logoShadow;
            this.homeNameInput.value = homeTeam.nameShort;
            this.uploadedHomeFile = homeTeam.logo;
        });

        this.awayTeamSelect.addEventListener("change", async (event) => {
            const select = event.target as HTMLSelectElement;
            const awayTeam = TeamsRepository.findById(select.value);

            this.awayGradient.gradient = awayTeam.gradient;
            this.awayShadowInput.value = awayTeam.logoShadow;
            this.awayNameInput.value = awayTeam.nameShort;
            this.uploadedAwayFile = awayTeam.logo;
        });
    }

    private render(): string {
        return `
    <h3>Teams</h3>
    <div class="settings-row">
      <div class="settings-column">
        <label for="home-name">Home Name</label>
      </div>
      <div class="settings-column">
        <input type="text" id="home-name" />
      </div>
    </div>


    <div class="settings-row">
      <div class="settings-column">
        <label for="home-team-select">Select Home Team</label>
      </div>
      <div class="settings-column">
        <select id="home-team-select">
          <option></option>
        </select>
      </div>
    </div>

    <div class="settings-row">
      <div class="settings-column">
        <label>Home Gradient</label>
      </div>
      <div class="settings-column">
          <div id="home-gradient"></div>
      </div>
    </div>

    <div class="settings-row">
      <div class="settings-column">
        <label for="home-shadow-color">Home Shadow Color</label>
      </div>
      <div class="settings-column">
        <input type="color" id="home-shadow-color">
      </div>
    </div>

    <div class="settings-row">
      <label for="home-logo">Home Logo</label>
      <input type="file" id="home-logo" />
    </div>

    <div class="settings-row">
      <label for="away-name">Away Name</label>
      <input type="text" id="away-name" />
    </div>
    <div class="settings-row">
      <label for="away-team-select">Select Away Team</label>
      <select id="away-team-select">
        <option></option>
      </select>
    </div>

      <div class="settings-row">
        <div class="settings-column">
          <label>Away Gradient</label>
        </div>
        <div class="settings-column">
          <div id="away-gradient"></div>
        </div>
    </div>

      <div class="settings-row">
      <label for="away-shadow-color">Away Shadow Color</label>
      <input type="color" id="away-shadow-color">
    </div>
    <div class="settings-row">
      <label for="away-logo">Away Logo</label>
      <input type="file" id="away-logo" />
    </div>
    `;
    }

    public getState(): TeamState {
        return {
            ...this.state,
            home: this.homeNameInput.value,
            away: this.awayNameInput.value,
            homeLogo: this.uploadedHomeFile,
            awayLogo: this.uploadedAwayFile,
            homeGradient: this.homeGradient.gradient,
            awayGradient: this.awayGradient.gradient,
            homeLogoShadow: this.homeShadowInput.value || this.state.homeLogoShadow,
            awayLogoShadow: this.awayShadowInput.value || this.state.awayLogoShadow,
        };
    }
}

setComponent("teams-section", TeamSection);
