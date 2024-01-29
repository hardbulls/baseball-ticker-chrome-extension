import '@webcomponents/custom-elements'
import React from 'react'
import ReactDOM from "react-dom/client";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Control } from "./control/Control";
import { DEFAULT_SCOREBOARD_STATE } from "./state/DefaultState";
import { Local } from "./storage/Local";

const defaultTheme = createTheme({
  components: {
    MuiInput: {
      defaultProps: {
        fullWidth: true
      }
    },
    MuiFormControl: {
      defaultProps: {
        fullWidth: true
      }
    }
  }
});

const rootElement = document.createElement("_control_root");
const root = ReactDOM.createRoot(
  rootElement
);

document.body.prepend(rootElement);

(async () => {
  const INITIAL_STATE = await Local.getScoreboard();

  try {
    root.render(
      <React.StrictMode>
        <ThemeProvider theme={defaultTheme}>
          <Control initialState={{
            ...DEFAULT_SCOREBOARD_STATE,
            ...INITIAL_STATE || {}
          }} />
        </ThemeProvider>
      </React.StrictMode>
    );
  } catch (err) {
    console.error(err);
  }
})();

