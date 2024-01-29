import { Gradient } from "../baseball/model/Gradient"

export type TeamState = {
    home: string
    away: string
    homeLogo?: string
    awayLogo?: string
    homeGradient: Gradient
    awayGradient: Gradient
    homeLogoShadow: string
    awayLogoShadow: string
}
