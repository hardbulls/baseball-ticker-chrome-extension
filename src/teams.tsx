import "./index.css";
import { DEFAULT_TEAMS_STATE } from "./state/DefaultState";
import { Local } from "./storage/Local";
import { TeamState } from "./teams/TeamState";
import { sleep } from "./helper/sleep";
import { TeamsRepository } from "./api/TeamsRepository";
import { resizeImage } from "./service/image-resize";
import { convertFileToBase64 } from "./service/file-to-base64";
import { GradientPicker } from "./web-components/gradient-picker";

const convertAndResizeImage = async (file: File | Blob) => {
  return await resizeImage(100, await convertFileToBase64(file));
};

(async () => {
  const INITIAL_STATE = {
    ...DEFAULT_TEAMS_STATE,
    ...((await Local.getTeams()))
  };

  const saveButton = document.querySelector("#save-button") as HTMLButtonElement;
  const homeNameInput = document.querySelector("#home-name") as HTMLInputElement;
  const homeTeamSelect = document.querySelector("#home-team-select") as HTMLSelectElement;
  const awayNameInput = document.querySelector("#away-name") as HTMLInputElement;
  const awayTeamSelect = document.querySelector("#away-team-select") as HTMLSelectElement;
  const homeGradient = document.querySelector("#home-gradient") as GradientPicker;
  const awayGradient = document.querySelector("#away-gradient") as GradientPicker;
  const homeShadowInput = document.querySelector("#home-shadow-color") as HTMLInputElement;
  const awayShadowInput = document.querySelector("#away-shadow-color") as HTMLInputElement;
  const homeLogoInput = document.querySelector("#home-logo") as HTMLInputElement;
  const awayLogoInput = document.querySelector("#away-logo") as HTMLInputElement;

  homeNameInput.value = INITIAL_STATE.home;
  awayNameInput.value = INITIAL_STATE.away;

  homeGradient.gradient = INITIAL_STATE.homeGradient
  awayGradient.gradient = INITIAL_STATE.awayGradient
  homeShadowInput.value = INITIAL_STATE.homeLogoShadow;
  awayShadowInput.value = INITIAL_STATE.awayLogoShadow;

  let uploadedHomeFile: string|undefined = INITIAL_STATE.homeLogo;
  let uploadedAwayFile: string|undefined = INITIAL_STATE.awayLogo;


  for (const [teamId, team] of Object.entries(TeamsRepository.findAll())) {
    homeTeamSelect.options.add(new Option(team.name, teamId))
    awayTeamSelect.options.add(new Option(team.name, teamId))
  }

  homeLogoInput.addEventListener('change', async (event) => {
    const upload = event.target as HTMLInputElement
    const file = upload.files?.[0];

    if (file) {
      uploadedHomeFile = await convertAndResizeImage(file)
    }
  })

  awayLogoInput.addEventListener('change', async (event) => {
    const upload = event.target as HTMLInputElement
    const file = upload.files?.[0];

    if (file) {
      uploadedAwayFile = await convertAndResizeImage(file)
    }
  })

  homeTeamSelect.addEventListener('change', async (event) => {
    const select = event.target as HTMLSelectElement
    const homeTeam = TeamsRepository.findById(select.value);

    homeGradient.gradient = homeTeam.gradient
    homeShadowInput.value = homeTeam.logoShadow
    homeNameInput.value = homeTeam.name
    uploadedHomeFile = homeTeam.logo
  })

  awayTeamSelect.addEventListener('change', async (event) => {
    const select = event.target as HTMLSelectElement
    const awayTeam = TeamsRepository.findById(select.value);

    awayGradient.gradient = awayTeam.gradient
    awayShadowInput.value = awayTeam.logoShadow
    awayNameInput.value = awayTeam.name
    uploadedAwayFile = awayTeam.logo
  })

  saveButton.addEventListener("click", async () => {
    saveButton.disabled = true;
    const homeLogoShadow = homeShadowInput.value || INITIAL_STATE.homeLogoShadow;
    const awayLogoShadow = awayShadowInput.value || INITIAL_STATE.awayLogoShadow;

    const state: TeamState = {
      ...INITIAL_STATE,
      home: homeNameInput.value,
      away: awayNameInput.value,
      homeLogo: uploadedHomeFile,
      awayLogo: uploadedAwayFile,
      homeGradient: homeGradient.gradient,
      awayGradient: awayGradient.gradient,
      homeLogoShadow: homeLogoShadow,
      awayLogoShadow: awayLogoShadow,
    };

    await Promise.all([Local.setTeams(state), sleep(300)]);

    saveButton.disabled = false;
  });
})();

