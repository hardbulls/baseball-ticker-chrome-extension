import { useState } from "react";
import { ScoreControl } from "../ScoreControl";
import { HomeAwayEnum } from "../baseball/model/HomeAwayEnum";
import { ScoreboardState } from "../baseball/model/ScoreboardState";


interface Props {
  initialState: ScoreboardState;
}

export function Control({ initialState }: Props) {
  const [scoreboard, setState] = useState<ScoreboardState>(initialState);

  const updateScoreValue =  async <T extends keyof ScoreboardState>(key: T, value: ScoreboardState[T]) => {
    const updatedScoreboard = {
      ...scoreboard,
      [key]: value
    }

    await chrome.storage.local.set({ "scoreboard": updatedScoreboard });

    setState(updatedScoreboard)
  };

  const resetCounts = async () => {
    const updatedScoreboard = {
      ...scoreboard,
      balls: 0,
      strikes: 0
    };

    await chrome.storage.local.set({ "scoreboard": updatedScoreboard });

    setState(updatedScoreboard)
  };

  return (
    <div style={{ width: "100%", height: '100%' }}>
      <ScoreControl
        scoreboard={scoreboard}
        handleBallClick={() => {
          if (scoreboard.balls === 3) {
            updateScoreValue("balls", 0);

            return;
          }

          updateScoreValue("balls", scoreboard.balls + 1);
        }
        }
        handleOutClick={() => {
          if (scoreboard.outs === 2) {
            updateScoreValue("outs", 0);

            return;
          }

          updateScoreValue("outs", scoreboard.outs + 1);
        }
        }
        handleStrikeClick={() => {
          if (scoreboard.strikes === 2) {
            updateScoreValue("strikes", 0);

            return;
          }

          updateScoreValue("strikes", scoreboard.strikes + 1);
        }
        }
        handleClearBases={() => {
          updateScoreValue("bases", []);
        }
        }
        handleResetCountClick={() => {
          resetCounts();
        }
        }
        handleInningChange={(half, value) => {
          updateScoreValue("inning", {
            half, value
          });
        }}
        handleScoreChange={(team, value) => {
          if (team === HomeAwayEnum.HOME) {
            updateScoreValue("score", [value, scoreboard.score[1]]);

            return;
          }

          updateScoreValue("score", [scoreboard.score[0], value]);
        }}
        handleBaseChange={(base, value) => {
          if (value) {
            updateScoreValue("bases", [...scoreboard.bases, base]);

            return;
          }

          updateScoreValue("bases", scoreboard.bases.filter((v) => v !== base));
        }}
      />
    </div>
  );
}
