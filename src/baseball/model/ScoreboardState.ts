import { InningValue } from "./Inning"
import { BaseEnum } from "./BasesEnum"

export interface ScoreboardState {
    score: [number, number]
    inning: InningValue
    outs: number
    strikes: number
    balls: number
    bases: BaseEnum[]
    pitcherName: string
    batterName: string
    batterAvg: number
    pitcherEra: number
}
