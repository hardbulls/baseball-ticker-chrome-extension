import { Image } from "./Image"
import { ScoreboardState } from "./ScoreboardState"
import { DisplaySettingsState } from "./DisplaySettingsState"

export interface State {
    scoreboard: ScoreboardState
    displaySettings: DisplaySettingsState
    leagueLogo?: Image
    home: string
    away: string
    homeLogo?: Image
    awayLogo?: Image
    followTicker: boolean
    sponsors: string[]
}
