import { Local } from "./storage/Local";
import { fetchValues } from "./content/parse-values";
import { DEFAULT_OPTIONS_STATE, DEFAULT_POPUP_STATE, DEFAULT_SCOREBOARD_STATE } from "../lib/state/DefaultState";
import { MessageType } from "../lib/model/MessageType";

interface IndicatorElementOptions {
    on: () => void;
    off: () => void;
    hasStarted: (hasStarted: boolean) => void;
}

function IndicatorElement(): HTMLDivElement & IndicatorElementOptions {
    const indicator = document.createElement("div") as HTMLDivElement & IndicatorElementOptions;

    indicator.style.width = "200px";
    indicator.style.pointerEvents = "none";
    indicator.style.position = "fixed";
    indicator.style.top = "0";
    indicator.style.left = "0";
    indicator.style.color = "black";
    indicator.style.padding = "4px";

    indicator["on"] = () => {
        indicator.style.backgroundColor = "rgba(255,0,0,0.5)";
        indicator.textContent = "Following Ticker: ON";
    };

    indicator["off"] = () => {
        indicator.style.backgroundColor = "rgba(0,255,0,0.5)";
        indicator.textContent = "Following Ticker: OFF";
    };

    indicator["hasStarted"] = (hasStarted: boolean) => {
        if (hasStarted) {
            indicator.textContent = "Following Ticker: OFF";
        } else {
            indicator.textContent = "No Ticker detected";
        }
    };

    indicator.off();

    return indicator;
}

(async () => {
    const INITIAL_STATE = {
        ...DEFAULT_POPUP_STATE,
        ...(await Local.getPopup()),
    };

    const OPTIONS_STATE = {
        ...DEFAULT_OPTIONS_STATE,
        ...(await Local.getOptions()),
    };

    let scoreboard = {
        ...DEFAULT_SCOREBOARD_STATE,
        ...(await Local.getScoreboard()),
    };
    let followInterval: number | undefined;
    let refreshInterval: number | undefined;

    const bodyElement = document.querySelector("body") as HTMLBodyElement;
    const indicatorElement = IndicatorElement();
    let startedIndicator = document.querySelector(".box-score");

    bodyElement.appendChild(indicatorElement);

    function follow() {
        return setInterval(async () => {
            scoreboard = {
                ...scoreboard,
                ...(await fetchValues()),
            };
            await Local.setScoreboard(scoreboard);
        }, OPTIONS_STATE.tickerInterval);
    }

    function refreshCheck() {
        return setInterval(async () => {
            startedIndicator = document.querySelector(".box-score-top-bar");

            if (startedIndicator && refreshInterval) {
                indicatorElement.hasStarted(true);
                clearInterval(refreshInterval);
            } else {
                window.location.reload();
            }
        }, OPTIONS_STATE.refreshInterval);
    }

    function startFollowing() {
        followInterval = follow();
        indicatorElement.on();
        sendKeepTabAwakeMessage();

        if (!startedIndicator) {
            indicatorElement.hasStarted(false);
            refreshInterval = refreshCheck();
        }
    }

    function sendKeepTabAwakeMessage() {
        chrome.runtime.sendMessage({ type: MessageType.KEEP_AWAKE });
    }

    function sendAllowSleepMessage() {
        chrome.runtime.sendMessage({ type: MessageType.ALLOW_SLEEP });
    }

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.popup) {
            if (changes.popup.newValue.followTicker !== undefined) {
                const followTicker = changes.popup.newValue.followTicker;

                if (followInterval) {
                    clearInterval(followInterval);

                    if (!followTicker) {
                        indicatorElement.off();
                        sendAllowSleepMessage();

                        if (refreshInterval) {
                            clearInterval(refreshInterval);
                        }
                    }
                }

                if (followTicker) {
                    startFollowing();
                }
            }
        }

        if (changes.scoreboard) {
            if (changes.scoreboard.newValue !== undefined) {
                scoreboard = changes.scoreboard.newValue;
            }
        }
    });

    if (INITIAL_STATE.followTicker) {
        startFollowing();
    }
})();
