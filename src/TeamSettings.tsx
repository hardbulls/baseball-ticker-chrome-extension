import Grid2 from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import { State } from "./baseball/model/State";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { TEAMS } from "./config/teams";
import { Team } from "./baseball/model/Team";
import { LeagueSelect } from "./LeagueSelect";
import { League } from "./baseball/model/League";
import { LeagueLogoUpload } from "./baseball/LeagueLogoUpload";

interface Props {
  state: State;
  handleChange: <T extends keyof State>(key: T, value: State[T]) => void;
  handleSelect: (team: Team, type: "home" | "away") => void;
}

const TeamSelect = ({ handleSelect, type }: {
  handleSelect: (team: Team, type: "home" | "away") => void,
  type: "home" | "away"
}) => {
  return (
    <FormControl>
      <InputLabel>Select Team</InputLabel>
      <Select
        fullWidth
        value=""
        label={`Select Team`}
        onChange={(event) => {
          if (event.target.value === "") {
            return;
          }

          const team = TEAMS[event.target.value];

          handleSelect(team, type);
        }}
      >
        {Object.entries(TEAMS).map(([key, team]) => {
          return (
            <MenuItem
              key={key}
              value={key}
            >
              {team.name}
            </MenuItem>
          );
        })
        }
      </Select>
    </FormControl>
  );
};

export const TeamSettings = ({ state, handleChange, handleSelect }: Props) => {
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={3}>
          <TextField fullWidth value={state.home} label="Home Team"
                     onChange={(event) => handleChange("home", event.target.value)} />
        </Grid2>
        <Grid2 xs={3}>
          <TeamSelect handleSelect={handleSelect} type="home" />
        </Grid2>
        <Grid2 xs={3}>
          <TextField fullWidth value={state.away} label="Away Team"
                     onChange={(event) => handleChange("away", event.target.value)} />
        </Grid2>
        <Grid2 xs={3}>
          <TeamSelect handleSelect={handleSelect} type="away" />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>

        <Grid2 xs={3}>
          <LeagueSelect handleSelect={async (league: League) => handleChange("leagueLogo", { data: league.logo})}/>
        </Grid2>
        <Grid2 xs={3}>
          <LeagueLogoUpload
            handleFileUpload={(file) => handleChange("leagueLogo", file)}
            handleReset={() => handleChange("leagueLogo", undefined)}
          />
        </Grid2>
      </Grid2>
    </>
  );
};
