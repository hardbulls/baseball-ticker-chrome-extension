import logo_bbl_preseason from "../assets/leagues/bbl-preseason.png";
import { League } from "../model/League";
import { LeagueNotFoundError } from "./error/LeagueNotFoundError";

const LOGO_BASE_PATH = "https://api.hardbulls.com/assets/leagues";

export abstract class LeagueRepository {
    private static LEAGUES: { [key: string]: { name: string; data: string } } = {
        "2-blw": {
            name: "2. Bundesliga West",
            data: `${LOGO_BASE_PATH}/2-blw.svg`,
        },
        bbl: {
            name: "Baseball Bundesliga",
            data: `${LOGO_BASE_PATH}/bbl.svg`,
        },
        "bbl-preseason": {
            name: "Preseason",
            data: logo_bbl_preseason,
        },
        llv: {
            name: "Landesliga Vorarlberg",
            data: `${LOGO_BASE_PATH}/llv.svg`,
        },
        u8_beeball: {
            name: "U8 Beeball",
            data: `${LOGO_BASE_PATH}/u8_beeball.svg`,
        },
        u8_t_ball: {
            name: "U8 T-Ball",
            data: `${LOGO_BASE_PATH}/u8_t-ball.svg`,
        },
        u10: {
            name: "U10",
            data: `${LOGO_BASE_PATH}/u10.svg`,
        },
        u13: {
            name: "U13",
            data: `${LOGO_BASE_PATH}/u13.svg`,
        },
        u14: {
            name: "U14",
            data: `${LOGO_BASE_PATH}/u14.svg`,
        },
        u14_west: {
            name: "U14 West",
            data: `${LOGO_BASE_PATH}/u14_west.svg`,
        },
        u16: {
            name: "U16",
            data: `${LOGO_BASE_PATH}/u16.svg`,
        },
        u16_west: {
            name: "U16 West",
            data: `${LOGO_BASE_PATH}/u16_west.svg`,
        },
        vsl: {
            name: "Vorarlberger Slowpitch League",
            data: `${LOGO_BASE_PATH}/vsl.svg`,
        },
    };

    public static findById = (id: string): League => {
        const league = LeagueRepository.LEAGUES[id];

        if (!league) {
            throw new LeagueNotFoundError(id);
        }

        return {
            ...league,
            id,
        };
    };

    public static findAll = (): League[] => {
        const leagues = LeagueRepository.LEAGUES;
        const result: League[] = [];

        for (const [id, league] of Object.entries(leagues)) {
            result.push({
                ...league,
                id: id,
            });
        }

        return result;
    };
}
