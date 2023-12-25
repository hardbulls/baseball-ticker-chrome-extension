import { League } from "../baseball/model/League"
import Logo_bbl from "../assets/leagues/bbl.svg"
import Logo_2_blw from "../assets/leagues/2-blw.svg"
import Logo_llv from "../assets/leagues/llv.svg"
import Logo_vsl from "../assets/leagues/vsl.svg"

export const LEAGUES: { [key: string]: League } = {
    bbl: {
        name: "BBL",
        logo: Logo_bbl,
    },
    "2_blw": {
        name: "2. BLW",
        logo: Logo_2_blw,
    },
    llv: {
        name: "LLV",
        logo: Logo_llv,
    },
    vsl: {
        name: "VSL",
        logo: Logo_vsl,
    },
}
