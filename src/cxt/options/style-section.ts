import { setComponent } from "../../lib/framework";
import { GradientPicker } from "../overlay/gradient-picker";
import { FontsRepository } from "../../lib/api/FontsRepository";
import { StyleState } from "../../lib/state/StyleState";
import { Font } from "../../lib/model/Font";

export class StyleSection extends HTMLElement {
    private hideCountsCheckbox: HTMLInputElement;
    private overlayFilter: HTMLInputElement;
    private backgroundGradient1: GradientPicker;
    private backgroundGradient2: GradientPicker;
    private activeInningColor: HTMLInputElement;
    private inactiveInningColor: HTMLInputElement;
    private activeBaseColor: HTMLInputElement;
    private inactiveBaseColor: HTMLInputElement;
    private fontColor1: HTMLInputElement;
    private fontColor2: HTMLInputElement;
    private fontSelect: HTMLSelectElement;
    private fontLineHeightInput: HTMLInputElement;
    private minimumPlayerNameWidth: HTMLInputElement;
    private borderColorInput: HTMLInputElement;
    private borderSizeInput: HTMLInputElement;
    private hideBasesCheckbox: HTMLInputElement;
    private selectedFont: Font;

    constructor(private state: StyleState) {
        super();

        this.innerHTML = this.render();

        this.overlayFilter = this.querySelector("#overlay-filter-color") as HTMLInputElement;

        this.backgroundGradient1 = new GradientPicker();

        (this.querySelector("#background-gradient-1") as HTMLDivElement).append(this.backgroundGradient1);

        this.backgroundGradient2 = new GradientPicker();

        (this.querySelector("#background-gradient-2") as HTMLDivElement).append(this.backgroundGradient2);

        this.activeInningColor = this.querySelector("#active-inning-color") as HTMLInputElement;
        this.inactiveInningColor = this.querySelector("#inactive-inning-color") as HTMLInputElement;

        this.activeBaseColor = this.querySelector("#active-base-color") as HTMLInputElement;
        this.inactiveBaseColor = this.querySelector("#inactive-base-color") as HTMLInputElement;

        this.fontColor1 = this.querySelector("#font-color-1") as HTMLInputElement;
        this.fontColor2 = this.querySelector("#font-color-2") as HTMLInputElement;

        this.fontSelect = this.querySelector("#font") as HTMLSelectElement;
        this.fontLineHeightInput = this.querySelector("#font-line-height") as HTMLInputElement;
        this.minimumPlayerNameWidth = this.querySelector("#minimum-player-name-width") as HTMLInputElement;

        this.borderColorInput = this.querySelector("#border-color") as HTMLInputElement;
        this.borderSizeInput = this.querySelector("#border-size") as HTMLInputElement;

        this.hideBasesCheckbox = this.querySelector("#hide-bases") as HTMLInputElement;
        this.hideCountsCheckbox = this.querySelector("#hide-counts") as HTMLInputElement;

        this.selectedFont = state.font;

        this.fontSelect.addEventListener("change", async (event) => {
            const select = event.target as HTMLSelectElement;

            this.selectedFont = FontsRepository.findById(select.value);
        });

        this.setState(state);
    }

    public setState(state: StyleState): void {
        this.state = state;

        for (const font of FontsRepository.findAll()) {
            const selected = font.id === state.font.id;

            this.fontSelect.options.add(new Option(font.name, font.id, selected, selected));
        }

        this.backgroundGradient1.gradient = this.state.background1;
        this.backgroundGradient2.gradient = this.state.background2;
        this.overlayFilter.value = this.state.overlayFilterColor;
        this.inactiveInningColor.value = this.state.inactiveInningColor;
        this.activeInningColor.value = this.state.activeInningColor;
        this.inactiveBaseColor.value = this.state.inactiveBaseColor;
        this.activeBaseColor.value = this.state.activeBaseColor;
        this.fontColor1.value = this.state.fontColor1;
        this.fontColor2.value = this.state.fontColor2;
        this.hideBasesCheckbox.checked = this.state.hideBases;
        this.hideCountsCheckbox.checked = this.state.hideCounts;
        this.fontLineHeightInput.value = this.state.fontLineHeight.toString();
        this.minimumPlayerNameWidth.value = this.state.minimumPlayerNameWidth.toString();
        this.borderColorInput.value = this.state.borderColor;
        this.borderSizeInput.value = this.state.borderSize.toString();
    }

    public getState(): StyleState {
        return {
            fontColor1: this.fontColor1.value,
            fontColor2: this.fontColor2.value,
            overlayFilterColor: this.overlayFilter.value,
            background1: this.backgroundGradient1.gradient,
            background2: this.backgroundGradient2.gradient,
            activeInningColor: this.activeInningColor.value,
            inactiveInningColor: this.inactiveInningColor.value,
            activeBaseColor: this.activeBaseColor.value,
            inactiveBaseColor: this.inactiveBaseColor.value,
            font: this.selectedFont,
            hideBases: this.hideBasesCheckbox.checked,
            hideCounts: this.hideCountsCheckbox.checked,
            fontLineHeight: this.fontLineHeightInput.valueAsNumber,
            minimumPlayerNameWidth: this.minimumPlayerNameWidth.valueAsNumber,
            borderColor: this.borderColorInput.value,
            borderSize: this.borderSizeInput.valueAsNumber,
        };
    }

    private render(): string {
        return `
      <h3>Scoreboard Style</h3>
      
      <div>
        <div class="settings-row">
          <label for="overlay-filter-color">Overlay Filter Color</label>
          <input type="color" id="overlay-filter-color">
        </div>
        <div class="settings-row">
          <label for="active-inning-color">Active Inning Color</label>
          <input type="color" id="active-inning-color">
        </div>

        <div class="settings-row">
          <label for="inactive-inning-color">Inactive Inning Color</label>
          <input type="color" id="inactive-inning-color">
        </div>

        <div class="settings-row">
          <label for="active-base-color">Active Base Color</label>
          <input type="color" id="active-base-color">
        </div>


        <div class="settings-row">
          <label for="inactive-base-color">Inactive Base Color</label>
          <input type="color" id="inactive-base-color">
        </div>

        <div class="settings-row">
          <label>Background Gradient 1</label>
          <div id="background-gradient-1"></div>
        </div>
        <div class="settings-row">
          <label>Background Gradient 2</label>
          <div id="background-gradient-2"></div>
        </div>


        <div class="settings-row">
          <label for="font-color-1">Font Color 1</label>
          <input type="color" id="font-color-1">
        </div>

        <div class="settings-row">
          <label for="font-color-2">Font Color 2</label>
          <input type="color" id="font-color-2">
        </div>

        <div class="settings-row">
          <label for="font">Select Font</label>
          <select id="font"></select>
        </div>

        <div class="settings-row">
          <label for="font-line-height">Font Line Height</label>
          <input type="number" min="0" step="0.05" max="2" id="font-line-height">
        </div>

        <div class="settings-row">
          <label for="minimum-player-name-width">Player Name Label Width</label>
          <input type="number" min="0" id="minimum-player-name-width">
        </div>

        <div class="settings-row">
          <label for="border-color">Border Color</label>
          <input type="color" id="border-color">
        </div>

        <div class="settings-row">
          <label for="border-size">Border Size</label>
          <input type="number" min="0" step="1" id="border-size">
        </div>
      </div>

        <div class="checkbox-group">
          <div>
            <label for="hide-bases">Hide Bases</label>
            <input type="checkbox" id="hide-bases" />
          </div>

          <div>
            <label for="hide-counts">Hide Counts</label>
            <input type="checkbox" id="hide-counts" />
          </div>
        </div>
    `;
    }
}

setComponent("style-section", StyleSection);
