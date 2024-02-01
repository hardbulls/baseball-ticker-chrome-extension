import { Local } from "./storage/Local";
import { parseValues } from "./parse-values";

(async () => {
  const INITIAL_STATE = await Local.getPopup();

  let followTicker = INITIAL_STATE.followTicker;
  let scoreboard = await Local.getScoreboard();
  let followInterval: number | undefined;

  function follow() {
    return setInterval(async () => {
      scoreboard = {
        ...scoreboard,
        ...parseValues()
      };
      await Local.setScoreboard(scoreboard);
    });
  }

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.options) {
      if (changes.options.newValue.followTicker !== undefined) {
        followTicker = changes.options.newValue.followTicker;

        if (followTicker) {
          if (followInterval) {
            clearInterval(followInterval);
          }

          followInterval = follow();
        }
      }
    }

    if (changes.scoreboard) {
      if (changes.scoreboard.newValue !== undefined) {
        scoreboard = changes.scoreboard.newValue;
      }
    }
  });
})();

