import { SponsorsComponent } from "./sponsors-component";
import { GradientPicker } from "./gradient-picker";
import { TeamSection } from "../options/teams-section";
import { PlayersSection } from "../options/players-section";
import { SponsorsSection } from "../options/sponsors-section";

window.customElements.define("sponsors-component", SponsorsComponent);
window.customElements.define("gradient-picker", GradientPicker);
window.customElements.define("teams-section", TeamSection);
window.customElements.define("players-section", PlayersSection);
window.customElements.define("sponsors-section", SponsorsSection);
