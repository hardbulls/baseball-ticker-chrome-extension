import "./index.css"
import "./web-components/gradient-picker"
import { GradientPicker } from "./web-components/gradient-picker"
import { Local } from "./storage/Local"
import { DEFAULT_OPTIONS_STATE } from "./state/DefaultState"
import { FontsRepository } from "./api/FontsRepository"
import { LeagueRepository } from "./api/LeagueRepository"
import { resizeImage } from "./service/image-resize"
import { convertFileToBase64 } from "./service/file-to-base64"
import { sleep } from "./helper/sleep"
import { OptionsState } from "./options/OptionsState"
import { League } from "./model/League"
import { Font } from "./model/Font"

const convertAndResizeImage = async (file: File | Blob) => {
    return await resizeImage(200, await convertFileToBase64(file))
}

;(async () => {
    const INITIAL_STATE = {
        ...DEFAULT_OPTIONS_STATE,
        ...(await Local.getOptions()),
    }
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

    const fontLineHeight = document.querySelector("#font-line-height") as HTMLInputElement

    const fontSelect = document.querySelector("#font") as HTMLSelectElement
    const leagueLogoShadow = document.querySelector("#league-logo-shadow") as HTMLInputElement
    const leagueSelect = document.querySelector("#league-select") as HTMLSelectElement
    const leagueLogoUpload = document.querySelector("#league-logo-upload") as HTMLInputElement

    const hideBasesCheckbox = document.querySelector("#hide-bases") as HTMLInputElement
    const hideCountsCheckbox = document.querySelector("#hide-counts") as HTMLInputElement

    backgroundGradient1.gradient = INITIAL_STATE.background1
    backgroundGradient2.gradient = INITIAL_STATE.background2
    overlayFilter.value = INITIAL_STATE.overlayFilterColor
    inactiveInningColor.value = INITIAL_STATE.inactiveInningColor
    activeInningColor.value = INITIAL_STATE.activeInningColor
    inactiveBaseColor.value = INITIAL_STATE.inactiveBaseColor
    activeBaseColor.value = INITIAL_STATE.activeBaseColor
    fontColor1.value = INITIAL_STATE.fontColor1
    fontColor2.value = INITIAL_STATE.fontColor2
    hideBasesCheckbox.checked = INITIAL_STATE.hideBases
    hideCountsCheckbox.checked = INITIAL_STATE.hideCounts

    fontLineHeight.value = INITIAL_STATE.fontLineHeight.toString()

    leagueLogoShadow.value = INITIAL_STATE.leagueLogoShadow

    let selectedFont: Font = INITIAL_STATE.font
    let selectedLeague: League | undefined = INITIAL_STATE.league

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
        const selected = font.id === INITIAL_STATE.font.id

        fontSelect.options.add(new Option(font.name, font.id, selected, selected))
    }

    for (const league of LeagueRepository.findAll()) {
        const selected = league.id === INITIAL_STATE.league?.id

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

        const state: OptionsState = {
            ...INITIAL_STATE,
            league: selectedLeague,
            leagueLogoShadow: leagueLogoShadow.value || INITIAL_STATE.leagueLogoShadow,
            fontColor1: fontColor1.value || INITIAL_STATE.fontColor1,
            fontColor2: fontColor2.value || INITIAL_STATE.fontColor2,
            fontLineHeight: Number.parseFloat(fontLineHeight.value) || INITIAL_STATE.fontLineHeight,
            overlayFilterColor: overlayFilter.value || INITIAL_STATE.overlayFilterColor,
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

        await Promise.all([Local.setOptions(state), sleep(300)])

        saveButton.disabled = false
    })
})()
