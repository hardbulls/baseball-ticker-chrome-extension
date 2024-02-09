import { Local } from "./storage/Local"
import { parseValues } from "./parse-values"
import { CONFIG } from "./config"

function IndicatorElement(): HTMLDivElement & { on: () => void; off: () => void } {
    const indicator = document.createElement("div") as HTMLDivElement & { on: () => void; off: () => void }

    indicator.style.width = "200px"
    indicator.style.pointerEvents = "none"
    indicator.style.position = "fixed"
    indicator.style.top = "0"
    indicator.style.left = "0"
    indicator.style.color = "black"
    indicator.style.padding = "4px"

    indicator["on"] = () => {
        indicator.style.backgroundColor = "rgba(255,0,0,0.5)"
        indicator.textContent = "Following Ticker: ON"
    }

    indicator["off"] = () => {
        indicator.style.backgroundColor = "rgba(0,255,0,0.5)"
        indicator.textContent = "Following Ticker: OFF"
    }

    indicator.off()

    return indicator
}

(async () => {
    const INITIAL_STATE = await Local.getPopup()

    let scoreboard = await Local.getScoreboard()
    let followInterval: number | undefined
    const bodyElement = document.querySelector("body") as HTMLBodyElement
    const indicatorElement = IndicatorElement()

    bodyElement.appendChild(indicatorElement)

    function follow() {
        return setInterval(async () => {
            scoreboard = {
                ...scoreboard,
                ...parseValues(),
            }
            await Local.setScoreboard(scoreboard)
        }, CONFIG.tickerInterval)
    }

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.popup) {
            if (changes.popup.newValue.followTicker !== undefined) {
                const followTicker = changes.popup.newValue.followTicker

                if (followInterval) {
                    clearInterval(followInterval)

                    if (!followTicker) {
                        indicatorElement.off()
                    }
                }

                if (followTicker) {
                    followInterval = follow()
                    indicatorElement.on()
                }
            }
        }

        if (changes.scoreboard) {
            if (changes.scoreboard.newValue !== undefined) {
                scoreboard = changes.scoreboard.newValue
            }
        }
    })

    if (INITIAL_STATE.followTicker) {
        followInterval = follow()
    }
})()
