import { useEffect, useState } from "react";
import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { parseValues } from "./parse-values";
import { CONFIG } from "./config";


interface Props {
  initialScoreboard: ScoreboardState,
}

export function App({ initialScoreboard }: Props) {
  const [scoreboard, setScoreboard] = useState<ScoreboardState>(initialScoreboard);
  const [followTicker, setFollowTicker] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.options) {
        if (changes.options.newValue.followTicker !== undefined) {
          setFollowTicker(changes.options.newValue.followTicker);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (followTicker) {
      const intervalId = setInterval(() => {
        setScoreboard({
          ...scoreboard,
          ...parseValues()
        });
      }, CONFIG.tickerInterval);

      return () => clearInterval(intervalId);
    }
  }, [followTicker, scoreboard]);


  return (
    <div>
    </div>
  );
}
