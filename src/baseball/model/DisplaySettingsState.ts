import { Gradient } from "./Gradient"

export interface DisplaySettingsState {
    filterColor: string
    hideBases: boolean
    hideCounts: boolean
    hideInning: boolean
    layoutGradient: Gradient
    backgroundGradient: Gradient
    leagueLogoShadow: string
    fontColorLight: string
    fontColorDark: string
    activeBaseColor: string
    inactiveBaseColor: string
    activeInningColor: string
    inactiveInningColor: string
    fontLineHeight: number
}
