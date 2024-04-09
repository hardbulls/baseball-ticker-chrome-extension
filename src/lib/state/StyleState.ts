import { Font } from "../model/Font";
import { Gradient } from "../model/Gradient";

export type StyleState = {
    overlayFilterColor: string;
    background1: Gradient;
    background2: Gradient;
    fontColor1: string;
    fontColor2: string;
    activeInningColor: string;
    hideCounts: boolean;
    hideBases: boolean;
    inactiveInningColor: string;
    activeBaseColor: string;
    inactiveBaseColor: string;
    font: Font;
    fontLineHeight: number;
    minimumPlayerNameWidth: number;
    borderSize: number;
    borderColor: string;
};
