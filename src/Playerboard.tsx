import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { State } from "./baseball/model/State";
import { createComponent } from "@lit/react";
import { BaseballPlayerboard } from "@hardbulls/baseball-scoreboard";
import React from "react";
import { InningHalfEnum } from "./baseball/model/InningHalfEnum";
import { Gradient } from "./baseball/model/Gradient";

interface Props {
  state: State;
  scoreboard: ScoreboardState;
}

export const BaseballPlayerboardComponent = createComponent({
  tagName: "baseball-playerboard",
  elementClass: BaseballPlayerboard,
  react: React
});

export const Playerboard = ({ state, scoreboard }: Props) => {
  const inning = scoreboard.inning.half === InningHalfEnum.TOP ? scoreboard.inning.value : scoreboard.inning.value + 0.5;

  const toGradientValue = (gradient: Gradient) => {
    return `${gradient.angle},${gradient.startColor},${gradient.endColor},${gradient.startPercentage},${gradient.endPercentage}`;
  };

  return (
    <BaseballPlayerboardComponent
      style={{
        visibility: scoreboard.pitcherName === "" || scoreboard.pitcherName === "" ? "hidden" : "visible"
      }}
      mode={"normal"}
      inning={inning}
      awayGradient={toGradientValue(state.displaySettings.awayGradient)}
      homeGradient={toGradientValue(state.displaySettings.homeGradient)}
      layoutGradient={toGradientValue(state.displaySettings.layoutGradient)}
      backgroundGradient={toGradientValue(state.displaySettings.backgroundGradient)}
      fontColorDark={state.displaySettings.fontColorDark}
      fontColorLight={state.displaySettings.fontColorLight}
      fontName={state.displaySettings.font?.name}
      fontLineHeight={state.displaySettings.fontLineHeight}
      battingTeam={scoreboard.inning.half === InningHalfEnum.TOP ? "away" : "home"}
      pitcherName={scoreboard.pitcherName}
      batterName={scoreboard.batterName}
      pitcherEra={scoreboard.pitcherEra}
      batterAvg={scoreboard.batterAvg}
      borderColor="#000000"
      borderSize="3px"
      hideStats="false"
    />
  );
};
