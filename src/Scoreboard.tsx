import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { createComponent } from "@lit/react";
import { BaseballScoreboard} from "@hardbulls/baseball-scoreboard";
import React from "react";
import { InningHalfEnum } from "./baseball/model/InningHalfEnum";
import { BaseEnum } from "./baseball/model/BasesEnum";
import { Gradient } from "./model/Gradient";
import { CONFIG } from "./config";
import { TeamState } from "./teams/TeamState";
import { OptionsState } from "./options/OptionsState";

interface Props {
  options: OptionsState
  scoreboard: ScoreboardState;
  teams: TeamState;
}

export const BaseballScoreboardComponent = createComponent({
  tagName: "baseball-scoreboard",
  elementClass: BaseballScoreboard,
  react: React
});

export const Scoreboard = ({ options, teams, scoreboard }: Props) => {
  const inning = scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.inning.value : scoreboard.inning.value + 0.5
  const bases = [
    scoreboard.bases.includes(BaseEnum.FIRST),
    scoreboard.bases.includes(BaseEnum.SECOND),
    scoreboard.bases.includes(BaseEnum.THIRD),
  ].join(',');

  const toGradientValue = (gradient: Gradient) => {
    return `${gradient.angle},${gradient.startColor},${gradient.endColor},${gradient.startPercentage},${gradient.endPercentage}`
  }

  return (
    <BaseballScoreboardComponent
      hideBases={`${options.hideBases}`}
      hideCounts={`${options.hideCounts}`}
      hideInning={`false`}
      leagueLogoShadow={`${options.leagueLogoShadow}`}
      leagueLogoSrc={options.league && `${options.league?.data}`}
      homeScore={scoreboard.score[0]}
      balls={scoreboard.balls}
      strikes={scoreboard.strikes}
      outs={scoreboard.outs}
      awayScore={scoreboard.score[1]}
      inning={inning}
      bases={bases}
      awayGradient={toGradientValue(teams.awayGradient)}
      homeGradient={toGradientValue(teams.homeGradient)}
      layoutGradient={toGradientValue(options.background2)}
      backgroundGradient={toGradientValue(options.background1)}
      fontColorDark={options.fontColor2}
      fontColorLight={options.fontColor1}
      awayLogoSrc={teams.awayLogo}
      homeLogoSrc={teams.homeLogo}
      awayLogoShadow={teams.awayLogoShadow}
      homeLogoShadow={teams.homeLogoShadow}
      borderSize={CONFIG.borderSize}
      borderColor={CONFIG.borderColor}
      activeInningColor={options.activeInningColor}
      inactiveInningColor={options.inactiveInningColor}
      activeBaseColor={options.activeBaseColor}
      inactiveBaseColor={options.inactiveBaseColor}
      awayName={teams.away}
      homeName={teams.home}
      fontName={options.font?.name}
      fontLineHeight={options.fontLineHeight}
    />
  );
};
