import Grid2 from "@mui/material/Unstable_Grid2";
import { FormControlLabel, Switch } from "@mui/material";

interface Props {
  followTicker: boolean;
  handleChange: (value: boolean) => void;
}

export const TickerSettings = ({
                                 followTicker,
                                 handleChange
                               }: Props) => {

  return (
    <>
      <Grid2 container>
        <Grid2 xs={3}>
          <FormControlLabel
            control={
              <Switch checked={followTicker} onChange={(event) => event.target.checked !== followTicker && handleChange(!followTicker)} />
            }
            label="Follow Ticker"
          />
        </Grid2>
      </Grid2>
    </>
  );
};
