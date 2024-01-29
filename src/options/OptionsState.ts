import { Font } from "../model/Font"
import { Gradient } from "../baseball/model/Gradient"
import { League } from "../model/League"

export type OptionsState = {
    overlayFilterColor: string
    background1: Gradient
    background2: Gradient
    fontColor1: string
    fontColor2: string
    activeInningColor: string
    hideCounts: boolean
    hideBases: boolean
    inactiveInningColor: string
    activeBaseColor: string
    inactiveBaseColor: string
    leagueLogoShadow: string
    league?: League
    font: Font
    fontLineHeight: number
}
