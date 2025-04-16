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

type ApiLivescoreGame = {
    gameid: string; // "164916",
    tournamentid: string; // "2902",
    inning: string; // "B1 INN",
    homeruns: string; // "0",
    awayruns: string; // "1",
    balls: string; //"1",
    strikes: string; // "1",
    outs: string; // "0",
    runner1: string; //"0",
    runner2: string; //"0",
    runner3: string; //"0",
    pitcher: string; //"DOWNS Keylon",
    batter: string; //"OSEJO Jader",
    status: string; //"1",
    start: string; //"2025-04-11 14:00:00",
    start_tz: string; //"America/Managua"
};

export const fetchValues = async (): Promise<Partial<ScoreboardState>> => {
    const livescores = await (await fetch("https://game.wbsc.org/gamedata/livescores.json")).json();
    const gameData = JSON.parse(document.querySelector("#app")!.getAttribute("data-page")!).props.viewData.original.gameData;

    // {
    //     "gameid": "164916",
    //     "tournamentid": "2902",
    //     "inning": "B1 INN",
    //     "homeruns": "0",
    //     "awayruns": "1",
    //     "balls": "1",
    //     "strikes": "1",
    //     "outs": "0",
    //     "runner1": "0",
    //     "runner2": "1",
    //     "runner3": "0",
    //     "pitcher": "SOME Pitcher",
    //     "batter": "SOMEKINDOF Batter",
    //     "status": "1",
    //     "start": "2025-04-11 14:00:00",
    //     "start_tz": "America/Managua"
    // }

    const currentGame = livescores.find((game: ApiLivescoreGame) => game.gameid.toString() === gameData.id.toString());

    if (!currentGame) {
        return {};
    }

    const inning = parseInning(currentGame.inning);
    const homeScore = Number.parseInt(currentGame.homeruns || "0");
    const awayScore = Number.parseInt(currentGame.awayruns || "0");
    const balls = Number.parseInt(currentGame.balls || "0");
    const strikes = Number.parseInt(currentGame.strikes || "0");
    const outs = Number.parseInt(currentGame.outs || "0");

    const bases: BaseEnum[] = [];

    if (currentGame.runner1 === "1") {
        bases.push(BaseEnum.FIRST);
    }

    if (currentGame.runner2 === "1") {
        bases.push(BaseEnum.SECOND);
    }

    if (currentGame.runner3 === "1") {
        bases.push(BaseEnum.THIRD);
    }
    const result: Partial<ScoreboardState> = {
        score: [homeScore, awayScore],
        outs: outs,
        balls: Number.isNaN(balls) ? 0 : balls,
        strikes: Number.isNaN(strikes) ? 0 : strikes,
        inning,
        bases,
    };

    const pitcherName = currentGame.pitcher || "";
    const batterName = currentGame.batter || "";

    if (inning.half === InningHalfEnum.TOP) {
        if (pitcherName) {
            result.homePitcherName = getLastname(pitcherName);
        } else {
            result.homePitcherName = "";
        }
    } else if (inning.half === InningHalfEnum.BOTTOM) {
        if (pitcherName) {
            result.awayPitcherName = getLastname(pitcherName);
        } else {
            result.awayPitcherName = "";
        }
    }

    if (inning.half === InningHalfEnum.TOP) {
        if (batterName) {
            result.awayBatterName = getLastname(batterName);
        } else {
            result.awayBatterName = "";
        }
    } else if (inning.half === InningHalfEnum.BOTTOM) {
        if (batterName) {
            result.homeBatterName = getLastname(batterName);
        } else {
            result.homeBatterName = "";
        }
    }

    result.pitcherEra = 0;
    result.batterAvg = 0;

    return result;
};

export function parseInning(input: string): InningValue {
    const match = input.trim().match(/^([TB])(\d+)\s+INN$/i);

    if (!match) {
        return {
            value: 1,
            half: InningHalfEnum.TOP,
        };
    }

    const halfCode = match[1].toUpperCase();
    const inningNumber = parseInt(match[2], 10);

    const half = halfCode === "T" ? InningHalfEnum.TOP : InningHalfEnum.BOTTOM;

    return {
        value: inningNumber,
        half,
    };
}

export const parseHtml = async (): Promise<Partial<ScoreboardState>> => {
    const [homeScoreText, awayScoreText] = document.querySelectorAll(".box-score .header p.score");

    const awayScore = awayScoreText ? Number.parseInt(awayScoreText.textContent || "0") : 0;
    const homeScore = homeScoreText ? Number.parseInt(homeScoreText.textContent || "0") : 0;

    const [pitcherElement, batterElement] = document.querySelectorAll(".box-score .main-tab .current-players .player-details");

    const pitcherName = pitcherElement.querySelector("p:nth-child(2) strong")?.textContent || "";

    const batterName = batterElement.querySelector("p:nth-child(2) strong")?.textContent || "";

    const pitcherEra = getStatistic(pitcherElement.querySelector("p:nth-child(3)")?.textContent || "");
    const batterAvg = getStatistic(batterElement.querySelector("p:nth-child(3)")?.textContent || "");

    const outs = Number.parseInt(document.querySelector(".box-score .header .outs-situation p:nth-child(2) strong")?.textContent || "0");

    const ballsAndStrikes = (document.querySelector(".box-score .header .outs-situation p:nth-child(1)")?.textContent || "").split("-");

    const balls = Number.parseInt(ballsAndStrikes[0] ?? "0");
    const strikes = Number.parseInt(ballsAndStrikes[1] ?? "0");

    const bottomIndicator = document.querySelector(".box-score .header .inning-situation .bot");
    const inningNumber = document.querySelector(".box-score .header .inning-situation p")?.textContent;

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

    if (document.querySelector(".box-score .header .pitch-situation > div.is-active:nth-child(1)")) {
        bases.push(BaseEnum.FIRST);
    }

    if (document.querySelector(".box-score .header .pitch-situation > div.is-active:nth-child(2)")) {
        bases.push(BaseEnum.SECOND);
    }

    if (document.querySelector(".box-score .header .pitch-situation > div.is-active:nth-child(3)")) {
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
