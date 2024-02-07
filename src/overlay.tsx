import "@webcomponents/custom-elements";
import React from "react";
import ReactDOM from "react-dom/client";
import "./reset.css";
import { ScoreboardState } from "./baseball/model/ScoreboardState";
import { Overlay } from "./overlay/Overlay";
import { Local } from "./storage/Local";
import { FontsRepository } from "./api/FontsRepository";

const rootElement = document.createElement("_overlay_root");
const root = ReactDOM.createRoot(
  rootElement
);

document.body.prepend(rootElement);

(async () => {
  for (const font of FontsRepository.findAll()) {
    const fontFace = new FontFace(font.name, `url("${font.data}") format("woff2")`);

    await fontFace.load()

    document.fonts.add(fontFace)
  }

    const loadedStorage = (await chrome.storage.local.get(["scoreboard", "sponsors"]));
    const initialScoreboardState = loadedStorage.scoreboard as ScoreboardState;
    const initialSponsorsState = loadedStorage.sponsors as string[];
    const initialOptionsState = await Local.getOptions();
    const initialTeams = await Local.getTeams();

    root.render(
      <React.StrictMode>
        <Overlay initialTeams={initialTeams} initialOptions={initialOptionsState} initialSponsors={initialSponsorsState}
                 initialScoreboard={initialScoreboardState} />
      </React.StrictMode>
    );
})();
