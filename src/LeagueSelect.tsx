import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { LEAGUES } from "./config/leagues";
import { League } from "./baseball/model/League";

interface Props {
  handleSelect: (league: League) => void;
}

export const LeagueSelect = ({ handleSelect }: Props) => {
  return (
    <FormControl>
      <InputLabel>Select League</InputLabel>
      <Select
        fullWidth
        value=""
        label={`Select Team`}
        onChange={(event) => {
          if (event.target.value === "") {
            return;
          }

          const league = LEAGUES[event.target.value];

          handleSelect(league);
        }}
      >
        {Object.entries(LEAGUES).map(([key, league]) => {
          return (
            <MenuItem
              key={key}
              value={key}
            >
              {league.name}
            </MenuItem>
          );
        })
        }
      </Select>
    </FormControl>
  );
};
