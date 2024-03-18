import { Team } from "../model/Team";
import { TeamNotFoundError } from "../error/TeamNotFoundError";
import Logo_hb from "../assets/teams/logo_hb.png";
import Logo_di from "../assets/teams/logo_di.png";
import Logo_vw from "../assets/teams/logo_vw.png";
import Logo_dd from "../assets/teams/logo_dd.png";
import Logo_gh from "../assets/teams/logo_gh.png";
import Logo_kv from "../assets/teams/logo_kv.png";
import Logo_bb from "../assets/teams/logo_bb.png";
import Logo_fc from "../assets/teams/logo_fc.png";
import Logo_vm from "../assets/teams/logo_vm.png";
import Logo_st from "../assets/teams/logo_st.png";
import Logo_ch_pirates from "../assets/teams/logo_ch_pirates.png";
import Logo_highlanders from "../assets/teams/logo_highlanders.png";
import Logo_aa from "../assets/teams/logo_athletics.png";
import Logo_centurions from "../assets/teams/logo_centurions.png";
import Logo_ds from "../assets/teams/logo_dirty-sox.png";
import Logo_cubs from "../assets/teams/logo_cubs.png";
import Logo_braves from "../assets/teams/logo_braves.png";

export abstract class TeamsRepository {
    private static TEAMS: { [key: string]: Team } = {
        hb_1: {
            name: "Hard Bulls",
            nameShort: "Bulls",
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
            name: "Hard Bandidos",
            nameShort: "Bandidos",
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
        hb_3: {
            name: "Hard Bullets",
            nameShort: "Bullets",
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
            name: "Dornbirn Indians",
            nameShort: "Indians",
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
            name: "Vienna Wanderers",
            nameShort: "Wandereres",
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
            name: "Diving Ducks Wiener Neustadt",
            nameShort: "Ducks",
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
            name: "Traiskirchen Grasshoppers",
            nameShort: "Grasshoppers",
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
            name: "Kufstein Vikings",
            nameShort: "Vikings",
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
            name: "Schwechat Blue Bats",
            nameShort: "Blue Bats",
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
            name: "Feldkirch Cardinals",
            nameShort: "Cardinals",
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
            name: "Vienna Metrostars",
            nameShort: "Metrostars",
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
        ds_1: {
            name: "Dirty Sox Graz",
            nameShort: "Dirty Sox",
            logo: Logo_ds,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#6e6e6e",
                endColor: "#525252",
            },
            logoShadow: "#000000",
        },
        st_1: {
            name: "Schwaz Tigers",
            nameShort: "Tigers",
            logo: Logo_st,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#494949",
                endColor: "#323232",
            },
            logoShadow: "#000000",
        },
        aa_1: {
            name: "Attnang-Puchheim Athletics",
            nameShort: "Athletics",
            logo: Logo_aa,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#327d24",
                endColor: "#28661d",
            },
            logoShadow: "#255a16",
        },
        cw_1: {
            name: "Centurions Wels",
            nameShort: "Centurions",
            logo: Logo_centurions,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#e37d07",
                endColor: "#c46900",
            },
            logoShadow: "#663802",
        },
        sc_1: {
            name: "Stockerau Cubs",
            nameShort: "Cubs",
            logo: Logo_cubs,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#5085be",
                endColor: "#477abd",
            },
            logoShadow: "#006eb3",
        },
        hi_1: {
            name: "Gramastetten Highlanders",
            nameShort: "Highlanders",
            logo: Logo_highlanders,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#6a80c2",
                endColor: "#495d98",
            },
            logoShadow: "#d1e5ff",
        },
        br_1: {
            name: "Hallein Braves",
            nameShort: "Braves",
            logo: Logo_braves,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#2b52da",
                endColor: "#2851da",
            },
            logoShadow: "#286dc8",
        },
        wp_1: {
            name: "Wil Pirates",
            nameShort: "Pirates",
            logo: Logo_ch_pirates,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#a51d22",
                endColor: "#b12b31",
            },
            logoShadow: "#2e2e2e",
        },
    };

    public static findById = (id: string): Team => {
        const team = TeamsRepository.TEAMS[id];

        if (!team) {
            throw new TeamNotFoundError(id);
        }

        return team;
    };

    public static findAll = (): { [key: string]: Team } => {
        return TeamsRepository.TEAMS;
    };
}
