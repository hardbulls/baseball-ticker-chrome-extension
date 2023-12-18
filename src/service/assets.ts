import { resizeImage } from "./image-resize"
import EurostileBold from "../assets/fonts/EurostileBold.woff2"
import EvastonTavern1846 from "../assets/fonts/EvanstonTavern1846Regular.woff2"
import HudsonNYSemiBold from "../assets/fonts/HudsonNYSemiBold.woff2"
import NeueAachenBlack from "../assets/fonts/NeueAachenBlack.woff2"
import NovecentoBold from "../assets/fonts/NovecentoBold.woff2"

const FONTS: { [key: string]: string } = {
    "fonts/EurostileBold.woff2": EurostileBold,
    "fonts/EvanstonTavern1846Regular.woff2": EvastonTavern1846,
    "fonts/HudsonNYSemiBold.woff2": HudsonNYSemiBold,
    "fonts/NeueAachenBlack.woff2": NeueAachenBlack,
    "fonts/NovecentoBold.woff2": NovecentoBold,
}

export const getBlob = async (path: string): Promise<Blob | string> => {
    if (!FONTS[path]) {
        throw new Error(`File ${path} not found.`)
    }

    return FONTS[path]
}

export const getResizedImage = async (file: string) => {
    return await resizeImage(100, file)
}
