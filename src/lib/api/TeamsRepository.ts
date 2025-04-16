import { Team } from "../model/Team";
import { TeamNotFoundError } from "./error/TeamNotFoundError";

const LOGO_BASE_PATH = "https://api.hardbulls.com/assets/teams";

export abstract class TeamsRepository {
    private static TEAMS: { [key: string]: Team } = {
        hb_1: {
            name: "Hard Bulls",
            nameShort: "Bulls",
            logo: `${LOGO_BASE_PATH}/logo_hb.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_hb.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_hb.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_di.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_vw.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_dd.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_gh.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_kv.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_bb.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_fc.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_vm.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_dirty-sox.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_st.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_athletics.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_centurions.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_cubs.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_highlanders.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_braves.png`,
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
            logo: `${LOGO_BASE_PATH}/logo_ch_pirates.png`,
            gradient: {
                angle: 180,
                startPercentage: 30,
                endPercentage: 50,
                startColor: "#575757",
                endColor: "#444444",
            },
            logoShadow: "#2e2e2e",
        },
        wd_1: {
            name: "Wil Devils",
            nameShort: "Devils",
            logo: `${LOGO_BASE_PATH}/logo_ch_devils.png`,
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
        return Object.keys(TeamsRepository.TEAMS)
            .sort((a: string, b: string) => {
                const teamA = TeamsRepository.TEAMS[a];
                const teamB = TeamsRepository.TEAMS[b];

                if (teamA.name < teamB.name) {
                    return -1;
                }
                if (teamA.name > teamB.name) {
                    return 1;
                }

                return 0;
            })
            .reduce((result: { [key: string]: Team }, key) => {
                result[key] = TeamsRepository.TEAMS[key];

                return result;
            }, {});
    };
}
