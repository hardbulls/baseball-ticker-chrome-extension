import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { ScoreboardState } from "./baseball/model/ScoreboardState";

const rootElement = document.createElement("_scoreboard_root");
const root = ReactDOM.createRoot(
  rootElement
);

document.body.prepend(rootElement);

(async () => {

  try {
    const loadedStorage = (await chrome.storage.local.get(["scoreboard"]));
    const initialScoreboardState = loadedStorage.scoreboard as ScoreboardState;

    root.render(
      <React.StrictMode>
        <App initialScoreboard={initialScoreboardState} />
      </React.StrictMode>
    );
  } catch (err) {
    console.error(err);
  }
})();

