import "./web-components";
import "@hardbulls/baseball-scoreboard";
import "./reset.css";
import "./overlay.css";
import { Local } from "./storage/Local";
import { FontsRepository } from "./api/FontsRepository";
import { BaseballPlayerboard, BaseballScoreboard } from "@hardbulls/baseball-scoreboard";
import { CONFIG } from "./config";
import { Gradient } from "./model/Gradient";
import { InningHalfEnum } from "./baseball/model/InningHalfEnum";
import { BaseEnum } from "./baseball/model/BasesEnum";
import { SponsorsComponent } from "./web-components/sponsors-component";
(async () => {
    for (const font of FontsRepository.findAll()) {
        const fontFace = new FontFace(font.name, `url("${font.data}") format("woff2")`);

        await fontFace.load();

        document.fonts.add(fontFace);
    }

    let scoreboard = await Local.getScoreboard();
    let sponsors = await Local.getSponsors();
    let options = await Local.getOptions();
    let teams = await Local.getTeams();
    let playersState = await Local.getPlayers();

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.teams) {
            if (changes.teams.newValue !== undefined) {
                teams = changes.teams.newValue;

                updateScoreboard();
                updatePlayerboard();
            }
        }

        if (changes.options) {
            if (changes.options.newValue !== undefined) {
                options = changes.options.newValue;

                updateScoreboard();
                updatePlayerboard();
                updateFilterColor();
                updateSponsorsOptions();

                sponsorsElement.updateSponsors(sponsors.sponsors, sponsors.sponsorsInterval);
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

                updatePlayerboard();
            }
        }

        if (changes.sponsors) {
            if (changes.sponsors.newValue !== undefined) {
                sponsors = changes.sponsors.newValue;

                sponsorsElement.updateSponsors(sponsors.sponsors, sponsors.sponsorsInterval);
            }
        }
    });

    const toGradientValue = (gradient: Gradient) => {
        return `${gradient.angle},${gradient.startColor},${gradient.endColor},${gradient.startPercentage},${gradient.endPercentage}`;
    };

    const scoreboardElement = document.querySelector("#scoreboard") as BaseballScoreboard;
    const playerboardElement = document.querySelector("#playerboard") as BaseballPlayerboard;
    const sponsorsElement = document.querySelector("#sponsors") as SponsorsComponent;
    const bodyElement = document.querySelector("body") as HTMLBodyElement;

    sponsorsElement.updateSponsors(sponsors.sponsors, sponsors.sponsorsInterval);

    function updateSponsorsOptions() {
        sponsorsElement.layoutGradient = options.background2;
        sponsorsElement.backgroundGradient = options.background1;
        sponsorsElement.fontColor = options.fontColor2;
        sponsorsElement.fontName = options.font.name;
        sponsorsElement.borderColor = CONFIG.borderColor;
        sponsorsElement.borderSize = CONFIG.borderSize;
        sponsorsElement.sponsorsTitle = sponsors.sponsorsTitle;
        sponsorsElement.fontLineHeight = options.fontLineHeight;
    }

    function updateFilterColor() {
        bodyElement.style.backgroundColor = options.overlayFilterColor;
    }

    function updateScoreboard() {
        const inning =
            scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.inning.value : scoreboard.inning.value + 0.5;
        const bases = [
            scoreboard.bases.includes(BaseEnum.FIRST),
            scoreboard.bases.includes(BaseEnum.SECOND),
            scoreboard.bases.includes(BaseEnum.THIRD),
        ].join(",");

        scoreboardElement.hideBases = `${options.hideBases}`;
        scoreboardElement.hideCounts = `${options.hideCounts}`;

        scoreboardElement.mode = "normal";
        scoreboardElement.hideInning = `false`;
        scoreboardElement.leagueLogoShadow = `${options.leagueLogoShadow}`;
        scoreboardElement.leagueLogoSrc = options.league && `${options.league?.data}`;
        scoreboardElement.homeScore = scoreboard.score[0];
        scoreboardElement.balls = scoreboard.balls;
        scoreboardElement.strikes = scoreboard.strikes;
        scoreboardElement.outs = scoreboard.outs;
        scoreboardElement.awayScore = scoreboard.score[1];
        scoreboardElement.inning = inning;
        scoreboardElement.bases = bases;
        scoreboardElement.awayGradient = toGradientValue(teams.awayGradient);
        scoreboardElement.homeGradient = toGradientValue(teams.homeGradient);
        scoreboardElement.layoutGradient = toGradientValue(options.background2);
        scoreboardElement.backgroundGradient = toGradientValue(options.background1);
        scoreboardElement.fontColorDark = options.fontColor2;
        scoreboardElement.fontColorLight = options.fontColor1;
        scoreboardElement.awayLogoSrc = teams.awayLogo;
        scoreboardElement.homeLogoSrc = teams.homeLogo;
        scoreboardElement.awayLogoShadow = teams.awayLogoShadow;
        scoreboardElement.homeLogoShadow = teams.homeLogoShadow;
        scoreboardElement.borderSize = CONFIG.borderSize;
        scoreboardElement.borderColor = CONFIG.borderColor;
        scoreboardElement.activeInningColor = options.activeInningColor;
        scoreboardElement.inactiveInningColor = options.inactiveInningColor;
        scoreboardElement.activeBaseColor = options.activeBaseColor;
        scoreboardElement.inactiveBaseColor = options.inactiveBaseColor;
        scoreboardElement.awayName = teams.away;
        scoreboardElement.homeName = teams.home;
        scoreboardElement.fontName = options.font?.name;
        scoreboardElement.fontLineHeight = options.fontLineHeight;
    }

    function updatePlayerboard() {
        const inning =
            scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.inning.value : scoreboard.inning.value + 0.5;

        const hidePlayerboard = playersState.hidePlayers;

        playerboardElement.style.visibility = hidePlayerboard ? "hidden" : "visible";
        playerboardElement.mode = "normal";
        playerboardElement.inning = inning;
        playerboardElement.awayGradient = toGradientValue(teams.awayGradient);
        playerboardElement.homeGradient = toGradientValue(teams.homeGradient);
        playerboardElement.layoutGradient = toGradientValue(options.background2);
        playerboardElement.backgroundGradient = toGradientValue(options.background1);
        playerboardElement.fontColorDark = options.fontColor2;
        playerboardElement.fontColorLight = options.fontColor1;
        playerboardElement.fontName = options.font.name;
        playerboardElement.fontLineHeight = options.fontLineHeight;
        playerboardElement.battingTeam = scoreboard.inning.half === InningHalfEnum.TOP ? "away" : "home";
        playerboardElement.pitcherName =
            scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.homePitcherName : scoreboard.awayPitcherName;
        playerboardElement.batterName =
            scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.awayBatterName : scoreboard.homeBatterName;
        playerboardElement.pitcherEra = scoreboard.pitcherEra;
        playerboardElement.batterAvg = scoreboard.batterAvg;
        playerboardElement.borderColor = CONFIG.borderColor;
        playerboardElement.borderSize = CONFIG.borderSize;
        playerboardElement.hideStats = `${playersState.hideStatistics}`;
    }

    updateScoreboard();
    updatePlayerboard();
    updateFilterColor();
    updateSponsorsOptions();
})();
