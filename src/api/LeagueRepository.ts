import logo_2blw from "../assets/leagues/2-blw.svg";
import logo_bbl from "../assets/leagues/bbl.svg";
import logo_llv from "../assets/leagues/llv.svg";
import logo_u8 from "../assets/leagues/u8.svg";
import logo_u10 from "../assets/leagues/u10.svg";
import logo_u13 from "../assets/leagues/u13.svg";
import logo_u14 from "../assets/leagues/u14.svg";
import logo_u16 from "../assets/leagues/u16.svg";
import logo_vsl from "../assets/leagues/vsl.svg";
import { League } from "../model/League";
import { LeagueNotFoundError } from "../error/LeagueNotFoundError";

export abstract class LeagueRepository {
    private static LEAGUES: { [key: string]: { name: string; data: string } } = {
        "2-blw": {
            name: "2. Bundesliga West",
            data: logo_2blw,
        },
        bbl: {
            name: "Baseball Bundesliga",
            data: logo_bbl,
        },
        llv: {
            name: "Landesliga Vorarlberg",
            data: logo_llv,
        },
        u8: {
            name: "U8",
            data: logo_u8,
        },
        u10: {
            name: "U10",
            data: logo_u10,
        },
        u13: {
            name: "U13",
            data: logo_u13,
        },
        u14: {
            name: "U14",
            data: logo_u14,
        },
        u16: {
            name: "U16",
            data: logo_u16,
        },
        vsl: {
            name: "Vorarlberger Slowpitch League",
            data: logo_vsl,
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
