import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { State } from "./baseball/model/State";
import { createComponent } from "@lit/react";
import { BaseballScoreboard} from "@hardbulls/baseball-scoreboard";
import React from "react";
import { InningHalfEnum } from "./baseball/model/InningHalfEnum";
import { BaseEnum } from "./baseball/model/BasesEnum";
import { Gradient } from "./baseball/model/Gradient";

interface Props {
  state: State;
  scoreboard: ScoreboardState;
}

export const BaseballScoreboardComponent = createComponent({
  tagName: "baseball-scoreboard",
  elementClass: BaseballScoreboard,
  react: React
});

export const Scoreboard = ({ state, scoreboard }: Props) => {
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
      hideBases={`${state.displaySettings.hideBases}`}
      hideCounts={`${state.displaySettings.hideCounts}`}
      hideInning={`${state.displaySettings.hideInning}`}
      leagueLogoShadow={`${state.displaySettings.leagueLogoShadow}`}
      leagueLogoSrc={state.leagueLogo && `${state.leagueLogo?.data}`}
      homeScore={scoreboard.score[0]}
      balls={scoreboard.balls}
      strikes={scoreboard.strikes}
      outs={scoreboard.outs}
      awayScore={scoreboard.score[1]}
      inning={inning}
      bases={bases}
      awayGradient={toGradientValue(state.displaySettings.awayGradient)}
      homeGradient={toGradientValue(state.displaySettings.homeGradient)}
      layoutGradient={toGradientValue(state.displaySettings.layoutGradient)}
      backgroundGradient={toGradientValue(state.displaySettings.backgroundGradient)}
      fontColorDark={state.displaySettings.fontColorDark}
      fontColorLight={state.displaySettings.fontColorLight}
      awayLogoSrc={state.awayLogo?.data}
      homeLogoSrc={state.homeLogo?.data}
      awayLogoShadow={state.displaySettings.awayLogoShadow}
      homeLogoShadow={state.displaySettings.homeLogoShadow}
      activeInningColor={state.displaySettings.activeInningColor}
      inactiveInningColor={state.displaySettings.inactiveInningColor}
      activeBaseColor={state.displaySettings.activeBaseColor}
      inactiveBaseColor={state.displaySettings.inactiveBaseColor}
      awayName={state.away}
      homeName={state.home}
      fontName={state.displaySettings.font?.name}
      fontLineHeight={state.displaySettings.fontLineHeight}
    />
  );
};
