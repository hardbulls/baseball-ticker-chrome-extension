import '@webcomponents/custom-elements'
import React from 'react'
import ReactDOM from "react-dom/client";
import "./index.css";
import { loadState } from "./state";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { App } from "./App";

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

const rootElement = document.createElement("_scoreboard_root");
const root = ReactDOM.createRoot(
  rootElement
);

document.body.prepend(rootElement);


(async () => {
  try {
    const initialState = await loadState();

    root.render(
      <React.StrictMode>
        <ThemeProvider theme={defaultTheme}>
          <App initialState={initialState} />
        </ThemeProvider>
      </React.StrictMode>
    );
  } catch (err) {
    console.error(err);
  }
})();

