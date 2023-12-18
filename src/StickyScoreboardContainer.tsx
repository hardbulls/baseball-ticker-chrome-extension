import { State } from "./baseball/model/State";
import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { Scoreboard } from "./Scoreboard";
import { Playerboard } from "./Playerboard";

interface Props {
  state: State;
  scoreboard: ScoreboardState;
}

export const StickyScoreboardContainer = ({ state, scoreboard }: Props) => {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 99,
        backgroundColor: state.displaySettings.filterColor,
        padding: '40px',
        display: "flex",
        gap: "10px",
      }}
    >
      <Scoreboard state={state} scoreboard={scoreboard} />
      <Playerboard state={state} scoreboard={scoreboard} />
    </div>
  );
};
