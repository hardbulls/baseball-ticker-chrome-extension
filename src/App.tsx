import { useEffect, useState } from "react";
import { State } from "./baseball/model/State";
import CompleteView from "./CompleteView";
import Grid2 from "@mui/material/Unstable_Grid2";
import { Copyright } from "./layout/Copyright";
import { saveState } from "./state";


interface Props {
  initialState: State;
}

export function App({ initialState }: Props) {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    saveState({
      ...state
    });
  }, [state]);

  const BottomSection = () => {
    return (
      <div>
        <Grid2 container spacing={2}>
          <Grid2 xs={12}>
            <Copyright />
          </Grid2>
        </Grid2>
      </div>
    );
  };

  return (
    <>
      <CompleteView state={state} setState={(updatedState) => setState(updatedState)} />
      <BottomSection />
    </>
  );
}
