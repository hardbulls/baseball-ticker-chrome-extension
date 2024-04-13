import { ScoreboardState } from "../../lib/state/ScoreboardState";
import { InningValue } from "../../lib/model/Inning";
import { InningHalfEnum } from "../../lib/model/InningHalfEnum";
import { BaseEnum } from "../../lib/model/BasesEnum";

const getLastname = (value: string) => {
    const split = value.split(" ");
    const lastName = (split[split.length - 1] || "").toLowerCase();

    return lastName.charAt(0).toUpperCase() + lastName.slice(1);
};

const getStatistic = (value: string, index: number = 0): number | undefined => {
    const split = value.split(",");

    const floatValue = Number.parseFloat(split[index]);

    return Number.isNaN(value) ? undefined : floatValue;
};

export const parseValues = (): Partial<ScoreboardState> => {
    const homeScore = Number.parseInt(
        document.querySelector("#app > div > div.box-score-top-bar > div.left-box > div.actual-teams > div:nth-child(3) > span")
            ?.textContent || "0"
    );
    const awayScore = Number.parseInt(
        document.querySelector("#app > div > div.box-score-top-bar > div.left-box > div.actual-teams > div:nth-child(1) > span")
            ?.textContent || "0"
    );
    const pitcherName =
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(1) > div.player-stats > p:nth-child(2) > strong"
        )?.textContent || "";
    const batterName =
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(2) > div.player-stats > p:nth-child(2) > strong"
        )?.textContent || "";
    const pitcherEra = getStatistic(
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(1) > div.player-stats > p.player-avg"
        )?.textContent || ""
    );
    const batterAvg = getStatistic(
        document.querySelector(
            "#app > div > div:nth-child(2) > div.active-panel > div > div.live-data > div.actual-players > div:nth-child(2) > div.player-stats > p.player-avg"
        )?.textContent || ""
    );

    const outs = Number.parseInt(
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.outs-indicator > p:nth-child(2) > strong"
        )?.textContent || "0"
    );

    const ballsAndStrikes = (
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.outs-indicator > p:nth-child(1)"
        )?.textContent || ""
    ).split("-");

    const balls = Number.parseInt(ballsAndStrikes[0] ?? "0");
    const strikes = Number.parseInt(ballsAndStrikes[1] ?? "0");

    const bottomIndicator = document.querySelector(
        "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.inning-indicator > p > span.triangle.bot"
    );
    const inningNumber = document.querySelector(
        "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.inning-indicator > p"
    )?.textContent;

    let inning: InningValue | undefined;

    if (inningNumber && !Number.isNaN(inningNumber)) {
        inning = {
            half: InningHalfEnum.TOP,
            value: Number.parseInt(inningNumber),
        };

        if (bottomIndicator) {
            inning.half = InningHalfEnum.BOTTOM;
        }
    }

    const bases: BaseEnum[] = [];

    if (
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.pitch-indicator > div.base.is-active:nth-child(1)"
        )
    ) {
        bases.push(BaseEnum.FIRST);
    }

    if (
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.pitch-indicator > div.base.is-active:nth-child(2)"
        )
    ) {
        bases.push(BaseEnum.SECOND);
    }

    if (
        document.querySelector(
            "#app > div > div.box-score-top-bar > div.left-box > div.indicators-container > div > div.pitch-indicator > div.base.is-active:nth-child(3)"
        )
    ) {
        bases.push(BaseEnum.THIRD);
    }

    const result: Partial<ScoreboardState> = {
        score: [homeScore, awayScore],
        outs: outs,
        balls: Number.isNaN(balls) ? 0 : balls,
        strikes: Number.isNaN(strikes) ? 0 : strikes,
        bases,
    };

    result.inning = inning || { value: 1, half: InningHalfEnum.TOP };

    if (inning?.half === InningHalfEnum.TOP) {
        if (pitcherName) {
            result.homePitcherName = getLastname(pitcherName);
        } else {
            result.homePitcherName = "";
        }
    } else if (inning?.half === InningHalfEnum.BOTTOM) {
        if (pitcherName) {
            result.awayPitcherName = getLastname(pitcherName);
        } else {
            result.awayPitcherName = "";
        }
    }

    if (inning?.half === InningHalfEnum.TOP) {
        if (batterName) {
            result.awayBatterName = getLastname(batterName);
        } else {
            result.awayBatterName = "";
        }
    } else if (inning?.half === InningHalfEnum.BOTTOM) {
        if (batterName) {
            result.homeBatterName = getLastname(batterName);
        } else {
            result.homeBatterName = "";
        }
    }

    result.pitcherEra = pitcherEra || 0;

    result.batterAvg = batterAvg || 0;

    return result;
};
