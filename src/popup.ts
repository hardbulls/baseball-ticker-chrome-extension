import "./reset.css"
import { PopupState } from "./popup/PopupState"
import { SponsorsRepository } from "./api/SponsorsRepository"
import { sleep } from "./helper/sleep"
import { Session } from "./storage/Session"
import { Windows } from "./windows/Windows"
import { DEFAULT_POPUP_STATE } from "./state/DefaultState"
;(async () => {
    const INITIAL_STATE = {
        ...DEFAULT_POPUP_STATE,
        ...((await chrome.storage.local.get(["popup"])).popup as PopupState),
    }

    const loadSponsors = async () => {
        await chrome.storage.local.set({ sponsors: await SponsorsRepository.download() })
    }

    chrome.windows.onRemoved.addListener(async (windowId) => {
        if (windowId === (await Session.getControlPanelId())) {
            await Session.resetControlPanelId()
            toggleControllerButton.textContent = "Open Controller"
        }

        if (windowId === (await Session.getOverlayPanelId())) {
            await Session.resetOverlayPanelId()
            toggleOverlayButton.textContent = "Open Overlay"
        }
    })

    const followTickerCheckbox = document.querySelector("#follow-ticker") as HTMLInputElement
    const updateSponsorsButton = document.querySelector("#update-sponsors") as HTMLButtonElement
    const toggleControllerButton = document.querySelector("#toggle-controller") as HTMLButtonElement
    const toggleOverlayButton = document.querySelector("#toggle-overlay") as HTMLButtonElement
    const toggleTeamsButton = document.querySelector("#toggle-teams") as HTMLButtonElement

    if (await Windows.exists(await Session.getControlPanelId())) {
        toggleControllerButton.textContent = "Close Controller"
    }

    if (await Windows.exists(await Session.getOverlayPanelId())) {
        toggleOverlayButton.textContent = "Close Overlay"
    }

    toggleTeamsButton.addEventListener("click", async () => {
        toggleTeamsButton.disabled = true

        const teamsPanelId = await Session.getTeamsPanelId()

        if (!teamsPanelId) {
            const teamsPanel = await chrome.windows.create({
                type: "panel",
                width: 500,
                height: 500,
                top: screen.height - 500,
                left: screen.width - 500,
                url: chrome.runtime.getURL("teams.html"),
            })

            if (teamsPanel.id) {
                await chrome.storage.session.set({ teamsPanelId: teamsPanel.id })
                toggleTeamsButton.textContent = "Close Teams"
            }
        } else {
            toggleTeamsButton.textContent = "Open Teams"
            await Session.resetTeamsPanelId()

            if (await Windows.exists(teamsPanelId)) {
                await chrome.windows.remove(teamsPanelId)
            }
        }

        await sleep(300)

        toggleTeamsButton.disabled = false
    })

    toggleControllerButton.addEventListener("click", async () => {
        toggleControllerButton.disabled = true

        const controlPanelId = await Session.getControlPanelId()

        if (!controlPanelId) {
            const controlPanel = await chrome.windows.create({
                type: "panel",
                width: 500,
                height: 500,
                top: 0,
                left: screen.width - 500,
                url: chrome.runtime.getURL("control.html"),
            })

            if (controlPanel.id) {
                await chrome.storage.session.set({ controlPanelId: controlPanel.id })
                toggleControllerButton.textContent = "Close Controller"
            }
        } else {
            toggleControllerButton.textContent = "Open Controller"
            await Session.resetControlPanelId()

            if (await Windows.exists(controlPanelId)) {
                await chrome.windows.remove(controlPanelId)
            }
        }

        await sleep(300)

        toggleControllerButton.disabled = false
    })

    toggleOverlayButton.addEventListener("click", async () => {
        toggleOverlayButton.disabled = true

        const overlayPanelId = await Session.getOverlayPanelId()

        if (!overlayPanelId) {
            const overlayPanel = await chrome.windows.create({
                type: "panel",
                width: 1000,
                height: 800,
                top: 0,
                left: 0,
                url: chrome.runtime.getURL("overlay.html"),
            })

            if (overlayPanel.id) {
                toggleOverlayButton.textContent = "Close Overlay"
                await chrome.storage.session.set({ overlayPanelId: overlayPanel.id })
            }
        } else {
            toggleOverlayButton.textContent = "Open Overlay"
            await Session.resetOverlayPanelId()

            if (await Windows.exists(overlayPanelId)) {
                await chrome.windows.remove(overlayPanelId)
            }
        }

        await sleep(300)

        toggleOverlayButton.disabled = false
    })

    followTickerCheckbox.checked = INITIAL_STATE.followTicker

    followTickerCheckbox.addEventListener("click", async () => {
        followTickerCheckbox.disabled = true

        await chrome.storage.local.set({
            popup: {
                followTicker: followTickerCheckbox.checked,
            },
        })

        await sleep(300)

        followTickerCheckbox.disabled = false
    })

    updateSponsorsButton.addEventListener("click", async () => {
        updateSponsorsButton.disabled = true

        await loadSponsors()

        updateSponsorsButton.disabled = false
    })
})()
