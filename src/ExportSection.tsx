import  { useState } from "react";
import { State } from "./baseball/model/State";
import { downloadFile } from "./service/download-file";
import { getLocaleStorageValue } from "./state";
import { CONFIG } from "./config";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import PublishIcon from '@mui/icons-material/Publish';

interface Props {
  state: State,
  handleLoadPreset: (presetState: State) => void
}

const downloadPreset = async (name: string) => {
  const response = await fetch(`${window.location.origin}/presets/${name}.json`);

  return await response.json();
};

export const ExportSection = ({ state, handleLoadPreset }: Props) => {
  const [preset, setPreset] = useState<string>('default');

  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={4}>
        <FormControl fullWidth>
          <InputLabel>Select Preset</InputLabel>
          <Select
            fullWidth
            value={preset || "default"}
            label={`Select Preset`}
            onChange={(event) => event.target.value !== "" && setPreset(event.target.value)}
          >
            {CONFIG.presets.sort().map(preset => (
              <MenuItem
                key={preset}
                value={preset}
              >
                {preset}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid2>
      <Grid2 xs={4}>
        <Button
          startIcon={<PublishIcon/>}
          fullWidth
          onClick={async () => {
            if (preset)
              handleLoadPreset(await downloadPreset(preset));
          }
          }
          variant="contained"

        >
          Load Preset
        </Button>

      </Grid2>
      <Grid2 xs={4}>
        <Button
          startIcon={<DownloadIcon/>}
          fullWidth
          onClick={async () => {
            const savedState = getLocaleStorageValue();

            if (savedState) {
              downloadFile(`${state.home}_${state.away}`, savedState);
            }
          }}
          variant="outlined"
        >
          Export Settings
        </Button>

      </Grid2>
    </Grid2>
  );
};
