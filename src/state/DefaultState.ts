import { InningHalfEnum } from "../baseball/model/InningHalfEnum"
import { ScoreboardState } from "../baseball/model/ScoreboardState"
import { PopupState } from "../popup/PopupState"
import { TeamState } from "../teams/TeamState"
import { TeamsRepository } from "../api/TeamsRepository"

import font_EurostileBold from "../assets/fonts/EurostileBold.woff2"
import { OptionsState } from "../options/OptionsState"
import { PlayersState } from "./PlayersState"

export const DEFAULT_SCOREBOARD_STATE: ScoreboardState = {
    bases: [],
    inning: {
        value: 1,
        half: InningHalfEnum.TOP,
    },
    score: [0, 0],
    outs: 0,
    strikes: 0,
    balls: 0,
    homeBatterName: "",
    awayBatterName: "",
    homePitcherName: "",
    awayPitcherName: "",
    batterAvg: 0,
    pitcherEra: 0,
}

export const DEFAULT_PLAYERS_STATE: PlayersState = {
    hidePlayers: false,
    hideStatistics: false,
    homePlayers: [],
    awayPlayers: [],
}

export const DEFAULT_POPUP_STATE: PopupState = {
    followTicker: false,
}

const defaultHomeTeam = TeamsRepository.findById("hb_1")
const defaultAwayTeam = TeamsRepository.findById("hb_2")

export const DEFAULT_TEAMS_STATE: TeamState = {
    home: "Away",
    away: "Home",
    homeLogo: defaultHomeTeam?.logo,
    awayLogo: defaultAwayTeam?.logo,
    homeGradient: defaultHomeTeam.gradient,
    awayGradient: defaultAwayTeam.gradient,
    homeLogoShadow: defaultHomeTeam.logoShadow,
    awayLogoShadow: defaultAwayTeam.logoShadow,
}

export const DEFAULT_OPTIONS_STATE: OptionsState = {
    sponsorsTitle: "Hard Bulls are sponsored by",
    sponsorsInterval: 5000,
    overlayFilterColor: "#00ff00",
    background1: {
        startColor: "#545454",
        endColor: "#232323",
        endPercentage: 20,
        startPercentage: 80,
        angle: 180,
    },
    background2: {
        startColor: "#e0e0e0",
        endColor: "#c4c4c4",
        endPercentage: 30,
        startPercentage: 70,
        angle: 180,
    },
    fontColor1: "#000000",
    fontColor2: "#ffffff",
    activeInningColor: "#c21414",
    inactiveInningColor: "#a4a4a4",
    activeBaseColor: "#d3c43d",
    inactiveBaseColor: "#c2c2c2",
    leagueLogoShadow: "#ffffff",
    hideCounts: false,
    hideBases: false,
    league: undefined,
    font: {
        id: "eurostile",
        name: "Eurostile",
        data: font_EurostileBold,
    },
    fontLineHeight: 1.05,
}
