import "./web-components"
import "./reset.css"
import "./shared.css"
import "./options.css"
import { GradientPicker } from "./web-components/gradient-picker"
import { Local } from "./storage/Local"
import {
    DEFAULT_OPTIONS_STATE,
    DEFAULT_PLAYERS_STATE,
    DEFAULT_SPONSORS_STATE,
    DEFAULT_TEAMS_STATE,
} from "./state/DefaultState"
import { FontsRepository } from "./api/FontsRepository"
import { LeagueRepository } from "./api/LeagueRepository"
import { resizeImage } from "./service/image-resize"
import { convertFileToBase64 } from "./service/file-to-base64"
import { sleep } from "./helper/sleep"
import { OptionsState } from "./options/OptionsState"
import { League } from "./model/League"
import { Font } from "./model/Font"
import { TeamSection } from "./options/teams-section"
import { PlayersSection } from "./options/players-section"
import { SponsorsSection } from "./options/sponsors-section"

const convertAndResizeImage = async (file: File | Blob) => {
    return await resizeImage(200, await convertFileToBase64(file))
}

;(async () => {
    const OPTIONS_STATE = {
        ...DEFAULT_OPTIONS_STATE,
        ...(await Local.getOptions()),
    }

    const TEAM_STATE = {
        ...DEFAULT_TEAMS_STATE,
        ...(await Local.getTeams()),
    }

    const PLAYERS_STATE = {
        ...DEFAULT_PLAYERS_STATE,
        ...(await Local.getPlayers()),
    }
    const SPONSORS_STATE = {
        ...DEFAULT_SPONSORS_STATE,
        ...(await Local.getSponsors()),
    }

    const teamSection = new TeamSection(TEAM_STATE)
    const playersSection = new PlayersSection(PLAYERS_STATE)
    const sponsorsSection = new SponsorsSection(SPONSORS_STATE)

    ;(document.querySelector("#team-settings") as HTMLDivElement).append(teamSection)
    ;(document.querySelector("#players-settings") as HTMLDivElement).append(playersSection)
    ;(document.querySelector("#sponsors-settings") as HTMLDivElement).append(sponsorsSection)

    const saveButton = document.querySelector("#save-button") as HTMLButtonElement
    const overlayFilter = document.querySelector("#overlay-filter-color") as HTMLInputElement
    const backgroundGradient1 = document.querySelector("#background-gradient-1") as GradientPicker
    const backgroundGradient2 = document.querySelector("#background-gradient-2") as GradientPicker
    const activeInningColor = document.querySelector("#active-inning-color") as HTMLInputElement
    const inactiveInningColor = document.querySelector("#inactive-inning-color") as HTMLInputElement

    const activeBaseColor = document.querySelector("#active-base-color") as HTMLInputElement
    const inactiveBaseColor = document.querySelector("#inactive-base-color") as HTMLInputElement

    const fontColor1 = document.querySelector("#font-color-1") as HTMLInputElement
    const fontColor2 = document.querySelector("#font-color-2") as HTMLInputElement

    const fontSelect = document.querySelector("#font") as HTMLSelectElement
    const leagueLogoShadow = document.querySelector("#league-logo-shadow") as HTMLInputElement
    const leagueSelect = document.querySelector("#league-select") as HTMLSelectElement
    const leagueLogoUpload = document.querySelector("#league-logo-upload") as HTMLInputElement

    const hideBasesCheckbox = document.querySelector("#hide-bases") as HTMLInputElement
    const hideCountsCheckbox = document.querySelector("#hide-counts") as HTMLInputElement

    backgroundGradient1.gradient = OPTIONS_STATE.background1
    backgroundGradient2.gradient = OPTIONS_STATE.background2
    overlayFilter.value = OPTIONS_STATE.overlayFilterColor
    inactiveInningColor.value = OPTIONS_STATE.inactiveInningColor
    activeInningColor.value = OPTIONS_STATE.activeInningColor
    inactiveBaseColor.value = OPTIONS_STATE.inactiveBaseColor
    activeBaseColor.value = OPTIONS_STATE.activeBaseColor
    fontColor1.value = OPTIONS_STATE.fontColor1
    fontColor2.value = OPTIONS_STATE.fontColor2
    hideBasesCheckbox.checked = OPTIONS_STATE.hideBases
    hideCountsCheckbox.checked = OPTIONS_STATE.hideCounts
    leagueLogoShadow.value = OPTIONS_STATE.leagueLogoShadow

    let selectedFont: Font = OPTIONS_STATE.font
    let selectedLeague: League | undefined = OPTIONS_STATE.league

    fontSelect.addEventListener("change", async (event) => {
        const select = event.target as HTMLSelectElement
        selectedFont = FontsRepository.findById(select.value)
    })

    leagueSelect.addEventListener("change", async (event) => {
        const select = event.target as HTMLSelectElement

        if (select.value !== "none") {
            selectedLeague = LeagueRepository.findById(select.value)
        } else {
            selectedLeague = undefined
        }
    })

    for (const font of FontsRepository.findAll()) {
        const selected = font.id === OPTIONS_STATE.font.id

        fontSelect.options.add(new Option(font.name, font.id, selected, selected))
    }

    for (const league of LeagueRepository.findAll()) {
        const selected = league.id === OPTIONS_STATE.league?.id

        leagueSelect.options.add(new Option(league.name, league.id, selected, selected))

        if (selected) {
            selectedLeague = league
        }
    }

    leagueLogoUpload.addEventListener("change", async (event) => {
        const upload = event.target as HTMLInputElement
        const file = upload.files?.[0]

        if (file) {
            selectedLeague = {
                id: selectedLeague?.id || "_custom",
                name: selectedLeague?.name || "",
                data: await convertAndResizeImage(file),
            }
        }
    })

    saveButton.addEventListener("click", async () => {
        saveButton.disabled = true

        const optionsState: OptionsState = {
            ...OPTIONS_STATE,
            league: selectedLeague,
            leagueLogoShadow: leagueLogoShadow.value || OPTIONS_STATE.leagueLogoShadow,
            fontColor1: fontColor1.value || OPTIONS_STATE.fontColor1,
            fontColor2: fontColor2.value || OPTIONS_STATE.fontColor2,
            overlayFilterColor: overlayFilter.value || OPTIONS_STATE.overlayFilterColor,
            background1: backgroundGradient1.gradient,
            background2: backgroundGradient2.gradient,
            activeInningColor: activeInningColor.value,
            inactiveInningColor: inactiveInningColor.value,
            activeBaseColor: activeBaseColor.value,
            inactiveBaseColor: inactiveBaseColor.value,
            font: selectedFont,
            hideBases: hideBasesCheckbox.checked,
            hideCounts: hideCountsCheckbox.checked,
        }

        await Promise.all([
            Local.setOptions(optionsState),
            Local.setPlayers(playersSection.getState()),
            Local.setTeams(teamSection.getState()),
            Local.setSponsors(sponsorsSection.getState()),
            sleep(300),
        ])

        saveButton.disabled = false
    })
})()
