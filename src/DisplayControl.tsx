import { GradientPicker } from "./GradientPicker";

import { ColorPicker } from "./ColorPicker";
import { convertFileToBase64 } from "./service/file-to-base64";
import { getBlob } from "./service/assets";
import { CONFIG } from "./config";
import Grid2 from "@mui/material/Unstable_Grid2";
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import TextField from "@mui/material/TextField";
import { DisplaySettingsState } from "./baseball/model/DisplaySettingsState";

interface Props {
  displaySettings: DisplaySettingsState
  handleChange: <T extends keyof DisplaySettingsState>(key: T, value: DisplaySettingsState[T]) => void;
}

export const DisplayControl = ({ handleChange, displaySettings}: Props) => {
  const handleFontSelect = async (name: string) => {
    const encodedFont = await convertFileToBase64(await getBlob(`fonts/${name}.woff2`));

    handleChange("font", {
      name: name,
      data: encodedFont
    });

    const font = new FontFace(name, `url("${encodedFont}") format("woff2")`);
    const loadedFont = await font.load();

    document.fonts.add(loadedFont);
  };

  return (
    <div>
      <Grid2 container spacing={2}>
        <Grid2 xs={2}>
          <FormControlLabel
            control={
              <Switch checked={!displaySettings.hideCounts} onChange={() => handleChange("hideCounts", !displaySettings.hideCounts)} />
            }
            label="Show Counts"
          />
        </Grid2>
        <Grid2 xs={2}>
          <FormControlLabel
            control={
              <Switch
                checked={!displaySettings.hideBases}
                onChange={() =>
                handleChange("hideBases", !displaySettings.hideBases)}
              />
            }
            label="Show Bases"
          />
        </Grid2>
        <Grid2 xs={2}>
          <FormControlLabel
            control={
              <Switch
                checked={!displaySettings.hideInning}
                onChange={() =>
                  handleChange("hideInning", !displaySettings.hideInning)}
              />
            }
            label="Show Inning"
          />
        </Grid2>
        <Grid2 xs={3}>
          <FormControl fullWidth>
            <InputLabel>Font</InputLabel>
            <Select
              fullWidth
              value={displaySettings.font?.name}
              label="Font"
              onChange={(event) => handleFontSelect(event.target.value)}
            >
              {CONFIG.fonts.map(font => (
                <MenuItem
                  key={font}
                  value={font}
                >
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 xs={3}>
          <TextField fullWidth
                     type="number"
                     inputProps={{
                       step: 0.01
                     }}
                     value={displaySettings.fontLineHeight} label="Font Line Height"
                     onChange={(event) => handleChange("fontLineHeight", Number.parseFloat(event.target.value))} />
        </Grid2>
      </Grid2>


      <Grid2 container spacing={2}>
        <Grid2 xs={3}>
          <ColorPicker label={"Active Base Color"} color={displaySettings.activeBaseColor}
                       onChange={(color) => handleChange("activeBaseColor", color)} />
        </Grid2>
        <Grid2 xs={3}>
          <ColorPicker label={"Inactive Base Color"} color={displaySettings.inactiveBaseColor}
                       onChange={(color) => handleChange("inactiveBaseColor", color)} />
        </Grid2>
        <Grid2 xs={3}>
          <ColorPicker label={"Active Inning Color"} color={displaySettings.activeInningColor}
                       onChange={(color) => handleChange("activeInningColor", color)} />
        </Grid2>
        <Grid2 xs={3}>
          <ColorPicker label={"Inactive Inning Color"} color={displaySettings.inactiveInningColor}
                       onChange={(color) => handleChange("inactiveInningColor", color)} />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 xs={4}>
          <ColorPicker label={"Filter Color"} color={displaySettings.filterColor}
                       onChange={(color) => handleChange("filterColor", color)} />
        </Grid2>
        <Grid2 xs={4}>
          <ColorPicker label={"Font Color Dark"} color={displaySettings.fontColorDark}
                       onChange={(color) => handleChange("fontColorDark", color)} />
        </Grid2>

        <Grid2 xs={4}>
          <ColorPicker label={"Font Color Light"} color={displaySettings.fontColorLight}
                       onChange={(color) => handleChange("fontColorLight", color)} />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 xs={6}>
          <ColorPicker
            label={"Home Logo Shadow"}
            color={displaySettings.homeLogoShadow}
            onChange={(color) => handleChange("homeLogoShadow", color)} />
        </Grid2>
        <Grid2 xs={6}>
          <ColorPicker
            label={"Away Logo Shadow"}
            color={displaySettings.awayLogoShadow}
            onChange={(color) => handleChange("awayLogoShadow", color)} />
        </Grid2>

      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <GradientPicker
            label={"Home Background"}
            gradient={displaySettings.homeGradient}
            onChange={(gradient) => handleChange("homeGradient", gradient)}
          />
        </Grid2>

      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <GradientPicker
            label={"Away Background"}
            gradient={displaySettings.awayGradient}
            onChange={(gradient) => handleChange("awayGradient", gradient)}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 xs={12}>

          <GradientPicker
            label={"Layout Background"}
            gradient={displaySettings.layoutGradient}
            onChange={(gradient) => handleChange("layoutGradient", gradient)}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 xs={12}>
          <GradientPicker
            label={"Background"}
            gradient={displaySettings.backgroundGradient}
            onChange={(gradient) => handleChange("backgroundGradient", gradient)}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 xs={6}>
          <ColorPicker
            label={"League Logo Shadow"}
            color={displaySettings.leagueLogoShadow}
            onChange={(color) => handleChange("leagueLogoShadow", color)} />
        </Grid2>
      </Grid2>
    </div>
  );
};
