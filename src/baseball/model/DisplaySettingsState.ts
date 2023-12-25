import { Gradient } from "./Gradient"
import { Font } from "./Font"

export interface DisplaySettingsState {
    filterColor: string
    hideBases: boolean
    hideCounts: boolean
    homeGradient: Gradient
    awayGradient: Gradient
    layoutGradient: Gradient
    backgroundGradient: Gradient
    homeLogoShadow: string
    awayLogoShadow: string
    leagueLogoShadow: string
    fontColorLight: string
    fontColorDark: string
    activeBaseColor: string
    inactiveBaseColor: string
    activeInningColor: string
    inactiveInningColor: string
    font?: Font
    fontLineHeight: number
}
