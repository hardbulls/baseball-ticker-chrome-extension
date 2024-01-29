import { useEffect, useState } from "react";
import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { TeamState } from "../teams/TeamState";
import { OptionsState } from "../options/OptionsState";
import { Scoreboard } from "../Scoreboard";
import { Playerboard } from "../Playerboard";
import { Sponsors } from "../Sponsors";


interface Props {
  initialOptions: OptionsState;
  initialScoreboard: ScoreboardState,
  initialTeams: TeamState
  initialSponsors: string[]
}

export function Overlay({ initialOptions, initialScoreboard, initialSponsors, initialTeams }: Props) {
  const [scoreboard, setScoreboard] = useState<ScoreboardState>(initialScoreboard);
  const [sponsors, setSponsors] = useState<string[]>(initialSponsors);
  const [teams, setTeams] = useState<TeamState>(initialTeams);
  const [options, setOptions] = useState<OptionsState>(initialOptions);

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.teams) {
        if (changes.teams.newValue !== undefined) {
          setTeams(changes.teams.newValue)
        }
      }

      if (changes.options) {
        if (changes.options.newValue !== undefined) {
          setOptions(changes.options.newValue)
        }
      }

      if (changes.scoreboard) {
        if (changes.scoreboard.newValue !== undefined) {
          setScoreboard(changes.scoreboard.newValue);
        }
      }

      if (changes.sponsors) {
        if (changes.sponsors.newValue !== undefined) {
          setSponsors(changes.sponsors.newValue);
        }
      }
    });
  }, []);

  return (
    <div>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 99,
          width: '100%',
          height: '100%',
          backgroundColor: options.overlayFilterColor,
          padding: '40px',
          display: "flex",
          gap: "10px",
        }}
      >
        <Scoreboard options={options} teams={teams} scoreboard={scoreboard} />
        <Playerboard options={options} teams={teams} scoreboard={scoreboard} />
        <Sponsors sponsors={sponsors} options={options} />
      </div>
    </div>
  );
}
