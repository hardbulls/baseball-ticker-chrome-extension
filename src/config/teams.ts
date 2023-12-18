import { Team } from "../baseball/model/Team"
import Logo_hb from "../assets/teams/logo_hb.png"

export const TEAMS: { [key: string]: Team } = {
    hb_1: {
        name: "Bulls",
        logo: Logo_hb,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#575757",
            endColor: "#333333",
        },
        logoShadow: "#3b3b3b",
    },
    hb_2: {
        name: "Bandidos",
        logo: Logo_hb,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#575757",
            endColor: "#333333",
        },
        logoShadow: "#3b3b3b",
    },
}
