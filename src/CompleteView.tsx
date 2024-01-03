import { useEffect, useState } from "react";
import { Control } from "./Control";
import { State } from "./baseball/model/State";
import { DisplayControl } from "./DisplayControl";
import { saveState } from "./state";
import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { TeamSettings } from "./TeamSettings";
import { HomeAwayEnum } from "./baseball/model/HomeAwayEnum";
import { StickyScoreboardContainer } from "./StickyScoreboardContainer";
import { TabSection } from "./component/tabs/TabSection";
import { Team } from "./baseball/model/Team";
import { getResizedImage } from "./service/assets";
import { parseValues } from "./parse-values";
import { TickerSettings } from "./TickerSettings";
import { SponsorSettings } from "./SponsorSettings";

let tickerInterval: number|undefined;


interface Props {
  state: State;
  setState: (state: State) => void;
}

function CompleteView({ state, setState }: Props) {
  const [scoreboard, setScoreboard] = useState<ScoreboardState>(state.scoreboard);
  const [followTicker, setFollowTicker] = useState<boolean>(state.followTicker || false);
  const [sponsors, setSponsors] = useState<string[]>(state.sponsors);

  useEffect(() => {
    saveState({
      ...state,
      followTicker,
      scoreboard,
      sponsors
    });
  }, [state, scoreboard, sponsors, followTicker]);

  useEffect(() => {
    if (!followTicker) {
      clearInterval(tickerInterval)

      tickerInterval = undefined;
    } else if (!tickerInterval) {
      tickerInterval = setInterval(() => {

        if (followTicker) {
          setScoreboard({
            ...scoreboard,
            ...parseValues()
          });
        }
      }, 1000);
    }
  }, [scoreboard, followTicker, setScoreboard]);

  const updateScoreValue = async <T extends keyof ScoreboardState>(key: T, value: ScoreboardState[T]) => {
    const updatedScoreboard = {
      ...scoreboard,
      [key]: value
    };
    setScoreboard(updatedScoreboard);
  };


  const updateTeamValues = async (team: Team, type: "home" | "away") => {
    if (type === "home") {
      setState({
        ...state,
        home: team.name,
        homeLogo: {
          data: await getResizedImage(team.logo)
        },
        displaySettings: {
          ...state.displaySettings,
          homeLogoShadow: team.logoShadow,
          homeGradient: team.gradient
        }
      });

      return;
    }

    setState({
      ...state,
      away: team.name,
      awayLogo: {
        data: await getResizedImage(team.logo)
      },
      displaySettings: {
        ...state.displaySettings,
        awayLogoShadow: team.logoShadow,
        awayGradient: team.gradient
      }
    });
  };

  const resetCounts = async () => {
    const updatedScoreboard = {
      ...scoreboard,
      balls: 0,
      strikes: 0
    };

    setScoreboard(updatedScoreboard);
  };

  return (
    <div>
      <StickyScoreboardContainer state={state} scoreboard={scoreboard} sponsors={sponsors} />
      <TabSection
        items={[
          {
            label: "Ticker",
            component: (
              <TickerSettings followTicker={followTicker}
                              handleChange={(value) => setFollowTicker(value)}
              />
            )
          },
          {
            label: "Control",
            component: (
              <Control
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

            )
          },
          {
            label: "Display",
            component: (
              <DisplayControl displaySettings={state.displaySettings} handleChange={(key, value) => setState({
                ...state,
                displaySettings: { ...state.displaySettings, [key]: value }
              })} />
            )
          },
          {
            label: "Teams",
            component: (
              <TeamSettings state={state}
                            handleSelect={updateTeamValues}
                            handleChange={(key, value) => setState({ ...state, [key]: value })}
              />
            ),
          },
          {
            label: "Sponsors",
            component: (
              <SponsorSettings handleLoadSponsors={(loadedSponsors) => setSponsors(loadedSponsors)}/>
            )
          }
        ]}
      />
    </div>
  );
}

export default CompleteView;
