import { Team } from "../baseball/model/Team"
import Logo_hb from "../assets/teams/logo_hb.png"
import Logo_di from "../assets/teams/logo_di.png"
import Logo_vw from "../assets/teams/logo_vw.png"
import Logo_kv from "../assets/teams/logo_kv.png"
import Logo_gh from "../assets/teams/logo_gh.png"
import Logo_dd from "../assets/teams/logo_dd.png"
import Logo_bb from "../assets/teams/logo_bb.png"
import Logo_fc from "../assets/teams/logo_fc.png"
import Logo_vm from "../assets/teams/logo_vm.png"

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
    di_1: {
        name: "Indians",
        logo: Logo_di,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#264892",
            endColor: "#2845cc",
        },
        logoShadow: "#3b3b3b",
    },
    vw_1: {
        name: "Wanderers",
        logo: Logo_vw,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#176a0c",
            endColor: "#106516",
        },
        logoShadow: "#3b3b3b",
    },
    dd_1: {
        name: "Ducks",
        logo: Logo_dd,
        logoShadow: "#3b3b3b",
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#787878",
            endColor: "#525252",
        },
    },
    gh_1: {
        name: "Grasshoppers",
        logo: Logo_gh,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#569e42",
            endColor: "#4e874a",
        },
        logoShadow: "#3b3b3b",
    },
    kv_1: {
        name: "Vikings",
        logo: Logo_kv,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#088e06",
            endColor: "#076600",
        },
        logoShadow: "#3b3b3b",
    },
    bb_1: {
        name: "Bats",
        logo: Logo_bb,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#266e92",
            endColor: "#295a7f",
        },
        logoShadow: "#ffffff",
    },
    fc_1: {
        name: "Cardinals",
        logo: Logo_fc,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#d24b4b",
            endColor: "#b84242",
        },
        logoShadow: "#292929",
    },
    vm_1: {
        name: "Metrostars",
        logo: Logo_vm,
        gradient: {
            angle: 180,
            startPercentage: 30,
            endPercentage: 50,
            startColor: "#3077e8",
            endColor: "#3363d1",
        },
        logoShadow: "#a48746",
    },
}
