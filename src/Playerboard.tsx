import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { createComponent } from "@lit/react";
import { BaseballPlayerboard } from "@hardbulls/baseball-scoreboard";
import React from "react";
import { InningHalfEnum } from "./baseball/model/InningHalfEnum";
import { Gradient } from "./baseball/model/Gradient";
import { TeamState } from "./teams/TeamState";
import { OptionsState } from "./options/OptionsState";

interface Props {
  options: OptionsState
  scoreboard: ScoreboardState;
  teams: TeamState;
}

export const BaseballPlayerboardComponent = createComponent({
  tagName: "baseball-playerboard",
  elementClass: BaseballPlayerboard,
  react: React
});

export const Playerboard = ({ options, teams, scoreboard }: Props) => {
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
      awayGradient={toGradientValue(teams.awayGradient)}
      homeGradient={toGradientValue(teams.homeGradient)}
      layoutGradient={toGradientValue(options.background2)}
      backgroundGradient={toGradientValue(options.background1)}
      fontColorDark={options.fontColor2}
      fontColorLight={options.fontColor1}
      fontName={options.font.name}
      fontLineHeight={options.fontLineHeight}
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
