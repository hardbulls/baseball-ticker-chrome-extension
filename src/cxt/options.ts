import "../reset.css";
import "../shared.css";
import "./options.css";
import { Local } from "./storage/Local";
import { DEFAULT_OPTIONS_STATE, DEFAULT_PLAYERS_STATE, DEFAULT_SPONSORS_STATE, DEFAULT_TEAMS_STATE } from "../lib/state/DefaultState";
import { LeagueRepository } from "../lib/api/LeagueRepository";
import { resizeImage } from "../lib/helper/image-resize";
import { convertFileToBase64 } from "../lib/helper/file-to-base64";
import { sleep } from "../lib/helper/sleep";
import { OptionsState } from "../lib/state/OptionsState";
import { League } from "../lib/model/League";
import { TeamSection } from "./options/teams-section";
import { PlayersSection } from "./options/players-section";
import { SponsorsSection } from "./options/sponsors-section";
import { RemoteSection } from "./options/remote-section";
import { StyleSection } from "./options/style-section";

const convertAndResizeImage = async (file: File | Blob) => {
    return await resizeImage(200, await convertFileToBase64(file));
};

(async () => {
    const OPTIONS_STATE = {
        ...DEFAULT_OPTIONS_STATE,
        ...(await Local.getOptions()),
    };

    const TEAM_STATE = {
        ...DEFAULT_TEAMS_STATE,
        ...(await Local.getTeams()),
    };

    const PLAYERS_STATE = {
        ...DEFAULT_PLAYERS_STATE,
        ...(await Local.getPlayers()),
    };
    const SPONSORS_STATE = {
        ...DEFAULT_SPONSORS_STATE,
        ...(await Local.getSponsors()),
    };

    const STYLE_STATE = OPTIONS_STATE.style;

    const teamSection = new TeamSection(TEAM_STATE);
    const playersSection = new PlayersSection(PLAYERS_STATE);
    const sponsorsSection = new SponsorsSection(SPONSORS_STATE);
    const remoteSection = new RemoteSection(OPTIONS_STATE.remote);
    const styleSection = new StyleSection(STYLE_STATE);

    (document.querySelector("#style-settings") as HTMLDivElement).append(styleSection);
    (document.querySelector("#team-settings") as HTMLDivElement).append(teamSection);
    (document.querySelector("#players-settings") as HTMLDivElement).append(playersSection);
    (document.querySelector("#sponsors-settings") as HTMLDivElement).append(sponsorsSection);
    (document.querySelector("#remote-settings") as HTMLDivElement).append(remoteSection);

    const saveButton = document.querySelector("#save-button") as HTMLButtonElement;

    const leagueLogoShadow = document.querySelector("#league-logo-shadow") as HTMLInputElement;
    const leagueSelect = document.querySelector("#league-select") as HTMLSelectElement;
    const leagueLogoUpload = document.querySelector("#league-logo-upload") as HTMLInputElement;

    leagueLogoShadow.value = OPTIONS_STATE.leagueLogoShadow;

    let selectedLeague: League | undefined = OPTIONS_STATE.league;

    leagueSelect.addEventListener("change", async (event) => {
        const select = event.target as HTMLSelectElement;

        if (select.value !== "none") {
            selectedLeague = LeagueRepository.findById(select.value);
        } else {
            selectedLeague = undefined;
        }
    });

    for (const league of LeagueRepository.findAll()) {
        const selected = league.id === OPTIONS_STATE.league?.id;

        leagueSelect.options.add(new Option(league.name, league.id, selected, selected));

        if (selected) {
            selectedLeague = league;
        }
    }

    leagueLogoUpload.addEventListener("change", async (event) => {
        const upload = event.target as HTMLInputElement;
        const file = upload.files?.[0];

        if (file) {
            selectedLeague = {
                id: selectedLeague?.id || "_custom",
                name: selectedLeague?.name || "",
                data: await convertAndResizeImage(file),
            };
        }
    });

    saveButton.addEventListener("click", async () => {
        saveButton.disabled = true;

        const optionsState: OptionsState = {
            ...OPTIONS_STATE,
            league: selectedLeague,
            leagueLogoShadow: leagueLogoShadow.value || OPTIONS_STATE.leagueLogoShadow,
        };

        await Promise.all([
            Local.setOptions({
                ...optionsState,
                style: styleSection.getState(),
                remote: remoteSection.getState(),
            }),
            Local.setPlayers(playersSection.getState()),
            Local.setTeams(teamSection.getState()),
            Local.setSponsors(sponsorsSection.getState()),
            sleep(300),
        ]);

        saveButton.disabled = false;
    });
})();
