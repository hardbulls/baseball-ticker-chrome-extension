import { InningHalfEnum } from "./baseball/model/InningHalfEnum"
import { State } from "./baseball/model/State"
import { CONFIG } from "./config"

export const DEFAULT_STATE: State = {
    scoreboard: {
        bases: [],
        inning: {
            value: 1,
            half: InningHalfEnum.TOP,
        },
        score: [0, 0],
        outs: 0,
        strikes: 0,
        balls: 0,
        batterName: "",
        pitcherName: "",
        batterAvg: 0,
        pitcherEra: 0,
    },
    home: "HB",
    away: "HB",
    homeLogo: undefined,
    awayLogo: undefined,
    leagueLogo: undefined,
    displaySettings: {
        filterColor: "#00ff00",
        hideInning: true,
        hideBases: false,
        hideCounts: false,
        leagueLogoShadow: "#c9c9c9",
        homeGradient: {
            angle: 180,
            startPercentage: 50,
            endPercentage: 50,
            startColor: "#dd0808",
            endColor: "#ff5c5c",
        },
        awayGradient: {
            angle: 180,
            startPercentage: 50,
            endPercentage: 50,
            startColor: "#6e6e6e",
            endColor: "#828282",
        },
        layoutGradient: {
            angle: 180,
            startPercentage: 50,
            endPercentage: 50,
            startColor: "#b0b0b0",
            endColor: "#cfcfcf",
        },
        backgroundGradient: {
            angle: 180,
            startPercentage: 50,
            endPercentage: 50,
            startColor: "#000000",
            endColor: "#474747",
        },
        homeLogoShadow: "#000000",
        awayLogoShadow: "#000000",
        fontColorLight: "#f3f3f3",
        fontColorDark: "#333333",
        font: {
            name: CONFIG.fonts[0],
        },
        activeBaseColor: "#ffd300",
        inactiveBaseColor: "#8c8b7f",
        activeInningColor: "#ffd300",
        inactiveInningColor: "#8c8b7f",
        fontLineHeight: 1.15,
    },
    followTicker: true,
}
