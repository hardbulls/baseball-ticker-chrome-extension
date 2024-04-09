import font_EurostileBold from "../assets/fonts/EurostileBold.woff2";
import font_EvanstonTavern1846 from "../assets/fonts/EvanstonTavern1846Regular.woff2";
import font_HudsonNYSemiBold from "../assets/fonts/HudsonNYSemiBold.woff2";
import font_NeueAachenBlack from "../assets/fonts/NeueAachenBlack.woff2";
import font_NovecentoBold from "../assets/fonts/NovecentoBold.woff2";
import { Font } from "../model/Font";
import { League } from "../model/League";
import { FontNotFoundError } from "./error/FontNotFoundError";

export abstract class FontsRepository {
    private static FONTS: { [key: string]: { name: string; data: string } } = {
        eurostile: {
            name: "Eurostile",
            data: font_EurostileBold,
        },
        evanston: {
            name: "Evanston Tavern 1846",
            data: font_EvanstonTavern1846,
        },
        hudson: {
            name: "Hudson NY",
            data: font_HudsonNYSemiBold,
        },
        aachen: {
            name: "Neue Aachen",
            data: font_NeueAachenBlack,
        },
        novecento: {
            name: "Novecento",
            data: font_NovecentoBold,
        },
    };

    public static findById = (id: string): League => {
        const font = FontsRepository.FONTS[id];

        if (!font) {
            throw new FontNotFoundError(id);
        }

        return {
            ...font,
            id,
        };
    };

    public static findAll = (): Font[] => {
        const fonts = FontsRepository.FONTS;
        const result: Font[] = [];

        for (const [fontId, font] of Object.entries(fonts)) {
            result.push({
                ...font,
                id: fontId,
            });
        }

        return result;
    };
}
