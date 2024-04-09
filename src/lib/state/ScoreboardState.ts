import { InningValue } from "../model/Inning";
import { BaseEnum } from "../model/BasesEnum";

export interface ScoreboardState {
    score: [number, number];
    inning: InningValue;
    outs: number;
    strikes: number;
    balls: number;
    bases: BaseEnum[];
    homePitcherName: string;
    awayPitcherName: string;
    homeBatterName: string;
    awayBatterName: string;
    batterAvg: number;
    pitcherEra: number;
}
