import { ScoreboardState } from "./baseball/model/ScoreboardState"
import { InningValue } from "./baseball/model/Inning"
import { InningHalfEnum } from "./baseball/model/InningHalfEnum"

const getLastname = (value: string) => {
    const split = value.split(" ")
    const lastName = (split[split.length - 1] || "").toLowerCase()

    return lastName.charAt(0).toUpperCase() + lastName.slice(1)
}

const getStatistic = (value: string, index: number = 0): number => {
    const split = value.split(",")

    return Number.parseFloat(split[index]) || 0
}

export const parseValues = (): Partial<ScoreboardState> => {
    const homeScore = Number.parseInt(
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.actual-teams > div:nth-child(3) > span"
        )?.textContent || "0"
    )
    const awayScore = Number.parseInt(
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.actual-teams > div:nth-child(1) > span"
        )?.textContent || "0"
    )
    const pitcherName =
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(1) > div.player-stats > p:nth-child(2) > strong"
        )?.textContent || ""
    const batterName =
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(2) > div.player-stats > p:nth-child(2) > strong"
        )?.textContent || ""
    const pitcherEra = getStatistic(
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(1) > div.player-stats > p.player-avg"
        )?.textContent || ""
    )
    const batterAvg = getStatistic(
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(2) > div.player-stats > p.player-avg"
        )?.textContent || ""
    )
    const outs = Number.parseInt(
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.outs-indicator > p:nth-child(2) > strong"
        )?.textContent || "0"
    )

    const ballsAndStrikes = (
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.outs-indicator > p:nth-child(1)"
        )?.textContent || ""
    ).split("-")

    const balls = Number.parseInt(ballsAndStrikes[0] ?? "0")
    const strikes = Number.parseInt(ballsAndStrikes[1] ?? "0")

    const bottomIndicator = document.querySelector(
        "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.inning-indicator > p > span.triangle.bot"
    )
    const inningNumber = Number.parseInt(
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.inning-indicator > p"
        )?.textContent || "1"
    )

    const inning: InningValue = {
        half: InningHalfEnum.TOP,
        value: inningNumber,
    }

    if (bottomIndicator) {
        inning.half = InningHalfEnum.BOTTOM
    }

    return {
        score: [homeScore, awayScore],
        pitcherName: getLastname(pitcherName),
        batterName: getLastname(batterName),
        pitcherEra: pitcherEra,
        batterAvg: batterAvg,
        outs: outs,
        balls,
        strikes,
        inning,
    }
}
