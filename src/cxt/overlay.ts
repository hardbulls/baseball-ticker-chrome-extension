import "../reset.css";
import "@hardbulls/baseball-scoreboard";
import "./overlay.css";
import { Local } from "./storage/Local";
import { FontsRepository } from "../lib/api/FontsRepository";
import { BaseballPlayerboard, BaseballScoreboard } from "@hardbulls/baseball-scoreboard";
import { Gradient } from "../lib/model/Gradient";
import { InningHalfEnum } from "../lib/model/InningHalfEnum";
import { BaseEnum } from "../lib/model/BasesEnum";
import { SponsorsComponent } from "./overlay/sponsors-component";
import {
    DEFAULT_OPTIONS_STATE,
    DEFAULT_PLAYERS_STATE,
    DEFAULT_SCOREBOARD_STATE,
    DEFAULT_SPONSORS_STATE,
    DEFAULT_TEAMS_STATE,
} from "../lib/state/DefaultState";
import { MessageType } from "../lib/model/MessageType";

(async () => {
    for (const font of FontsRepository.findAll()) {
        const fontFace = new FontFace(font.name, `url("${font.data}") format("woff2")`);

        await fontFace.load();

        document.fonts.add(fontFace);
    }

    let scoreboard = { ...DEFAULT_SCOREBOARD_STATE, ...(await Local.getScoreboard()) };
    let sponsors = { ...DEFAULT_SPONSORS_STATE, ...(await Local.getSponsors()) };
    let options = { ...DEFAULT_OPTIONS_STATE, ...(await Local.getOptions()) };
    let teams = { ...DEFAULT_TEAMS_STATE, ...(await Local.getTeams()) };
    let playersState = { ...DEFAULT_PLAYERS_STATE, ...(await Local.getPlayers()) };

    setInterval(async () => {
        await chrome.runtime.sendMessage({ type: MessageType.PING, ping: "ping" });
    }, 29000);

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.teams) {
            if (changes.teams.newValue !== undefined) {
                teams = changes.teams.newValue;

                updateStyle();
            }
        }

        if (changes.options) {
            if (changes.options.newValue !== undefined) {
                options = changes.options.newValue;

                updateFilterColor();
                updateStyle();
            }
        }

        if (changes.scoreboard) {
            if (changes.scoreboard.newValue !== undefined) {
                scoreboard = changes.scoreboard.newValue;

                updateScoreboard();
                updatePlayerboard();
            }
        }

        if (changes.players) {
            if (changes.players.newValue !== undefined) {
                playersState = changes.players.newValue;

                updateStyle();
            }
        }

        if (changes.sponsors) {
            if (changes.sponsors.newValue !== undefined) {
                sponsors = changes.sponsors.newValue;

                updateSponsors();
            }
        }
    });

    const toGradientValue = (gradient: Gradient) => {
        return `${gradient.angle},${gradient.startColor},${gradient.endColor},${gradient.startPercentage},${gradient.endPercentage}`;
    };

    const scoreboardElement = document.querySelector("#scoreboard") as BaseballScoreboard;
    const playerboardElement = document.querySelector("#playerboard") as BaseballPlayerboard;
    const sponsorsElement = new SponsorsComponent();
    const bodyElement = document.querySelector("body") as HTMLBodyElement;

    (document.querySelector("#sponsors") as HTMLDivElement).append(sponsorsElement);

    function updateFilterColor() {
        bodyElement.style.backgroundColor = options.style.overlayFilterColor;
    }

    function updateStyle() {
        scoreboardElement.hideBases = `${options.style.hideBases}`;
        scoreboardElement.hideCounts = `${options.style.hideCounts}`;
        scoreboardElement.hideInning = `false`;
        scoreboardElement.leagueLogoShadow = `${options.leagueLogoShadow}`;
        scoreboardElement.leagueLogoSrc = options.league && `${options.league?.data}`;
        scoreboardElement.awayGradient = toGradientValue(teams.awayGradient);
        scoreboardElement.homeGradient = toGradientValue(teams.homeGradient);
        scoreboardElement.layoutGradient = toGradientValue(options.style.background2);
        scoreboardElement.backgroundGradient = toGradientValue(options.style.background1);
        scoreboardElement.fontColorDark = options.style.fontColor2;
        scoreboardElement.fontColorLight = options.style.fontColor1;
        scoreboardElement.awayLogoSrc = teams.awayLogo;
        scoreboardElement.homeLogoSrc = teams.homeLogo;
        scoreboardElement.awayLogoShadow = teams.awayLogoShadow;
        scoreboardElement.homeLogoShadow = teams.homeLogoShadow;
        scoreboardElement.borderSize = `${options.style.borderSize}px`;
        scoreboardElement.borderColor = options.style.borderColor;
        scoreboardElement.activeInningColor = options.style.activeInningColor;
        scoreboardElement.inactiveInningColor = options.style.inactiveInningColor;
        scoreboardElement.activeBaseColor = options.style.activeBaseColor;
        scoreboardElement.inactiveBaseColor = options.style.inactiveBaseColor;
        scoreboardElement.fontName = options.style.font.name;
        scoreboardElement.fontLineHeight = options.style.fontLineHeight;

        scoreboardElement.awayName = teams.away;
        scoreboardElement.homeName = teams.home;

        const hidePlayerboard = playersState.hidePlayers;

        playerboardElement.style.visibility = hidePlayerboard ? "hidden" : "visible";
        playerboardElement.awayGradient = toGradientValue(teams.awayGradient);
        playerboardElement.homeGradient = toGradientValue(teams.homeGradient);
        playerboardElement.layoutGradient = toGradientValue(options.style.background2);
        playerboardElement.backgroundGradient = toGradientValue(options.style.background1);
        playerboardElement.fontColorDark = options.style.fontColor2;
        playerboardElement.fontColorLight = options.style.fontColor1;
        playerboardElement.fontName = options.style.font.name;
        playerboardElement.fontLineHeight = options.style.fontLineHeight;
        playerboardElement.borderColor = options.style.borderColor;
        playerboardElement.borderSize = `${options.style.borderSize}px`;
        playerboardElement.hideStats = `${playersState.hideStatistics}`;
        playerboardElement.minNameWidth = options.style.minimumPlayerNameWidth;

        sponsorsElement.layoutGradient = options.style.background2;
        sponsorsElement.backgroundGradient = options.style.background1;
        sponsorsElement.fontColor = options.style.fontColor2;
        sponsorsElement.fontName = options.style.font.name;
        sponsorsElement.borderColor = options.style.borderColor;
        sponsorsElement.borderSize = `${options.style.borderSize}px`;
        sponsorsElement.fontLineHeight = options.style.fontLineHeight;
    }

    function updateScoreboard() {
        const inning = scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.inning.value : scoreboard.inning.value + 0.5;
        const bases = [
            scoreboard.bases.includes(BaseEnum.FIRST),
            scoreboard.bases.includes(BaseEnum.SECOND),
            scoreboard.bases.includes(BaseEnum.THIRD),
        ].join(",");

        scoreboardElement.homeScore = scoreboard.score[0];
        scoreboardElement.balls = scoreboard.balls;
        scoreboardElement.strikes = scoreboard.strikes;
        scoreboardElement.outs = scoreboard.outs;
        scoreboardElement.awayScore = scoreboard.score[1];
        scoreboardElement.inning = inning;
        scoreboardElement.bases = bases;
    }

    function updatePlayerboard() {
        playerboardElement.inning = scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.inning.value : scoreboard.inning.value + 0.5;
        playerboardElement.battingTeam = scoreboard.inning.half === InningHalfEnum.TOP ? "away" : "home";
        playerboardElement.pitcherName =
            scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.homePitcherName : scoreboard.awayPitcherName;
        playerboardElement.batterName =
            scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.awayBatterName : scoreboard.homeBatterName;
        playerboardElement.pitcherEra = scoreboard.pitcherEra;
        playerboardElement.batterAvg = scoreboard.batterAvg;
    }

    function updateSponsors() {
        sponsorsElement.sponsorsTitle = sponsors.sponsorsTitle;
        sponsorsElement.updateSponsors(sponsors.sponsors, sponsors.sponsorsInterval);
    }

    updateScoreboard();
    updatePlayerboard();
    updateFilterColor();
    updateSponsors();
    updateStyle();
})();
