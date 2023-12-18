import  { useState } from "react";
import { Gradient } from "./baseball/model/Gradient";
import { generateGradient } from "./service/css";
import { Input, InputLabel } from "@mui/material";
import TextField from "@mui/material/TextField";
import { MultiSlider } from "./component/MultiSlider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2";

interface Props {
  label?: string
  gradient: Gradient,
  onChange: (gradient: Gradient) => void
}

export const GradientPicker = ({ label, gradient, onChange }: Props) => {
  const [selectedGradient, setGradient] = useState<Gradient>(gradient);

  return (
    <div>
      <Typography>{label}</Typography>
      <Grid2 container spacing={2}>
        <Grid2 xs={2}>
          <InputLabel>
            Color #1
          </InputLabel>
          <Input
            fullWidth
            type={"color"}
            value={gradient.startColor}
            onChange={(event) => setGradient({ ...gradient, startColor: event.target.value })}
            onBlur={() => onChange(selectedGradient)}
          />
        </Grid2>

        <Grid2 xs={2}>

          <InputLabel>
            Color #2
          </InputLabel>
          <Input
            fullWidth
            type={"color"}
            value={gradient.endColor}
            onChange={(event) => setGradient({ ...gradient, endColor: event.target.value })}
            onBlur={() => onChange(selectedGradient)}
          />
        </Grid2>

        <Grid2 xs={2}>
          <TextField fullWidth
                     type="number"
                     label="Angle"
                     inputProps={{
                       step: 5,
                       min: 0,
                       max: 360
                     }}
                     value={gradient.angle}
                     onChange={(event) => onChange({
                       ...gradient,
                       angle: Math.min(360, Math.max(0, Number.parseInt(event.currentTarget.value)))
                     })}
          />
        </Grid2>

        <Grid2 xs={4}>
          <MultiSlider
            label={"Fade"}
            value={[gradient.startPercentage, gradient.endPercentage]}
            onChange={(value) => {
              onChange({ ...gradient, startPercentage: value[0], endPercentage: value[1] });
            }}
          />
        </Grid2>

        <Grid2 xs={2} padding={2}>
          <Box
            sx={{
              background: generateGradient(gradient),
              minWidth: '100%',
              minHeight: '100%',
            }}
          >
          </Box>
        </Grid2>
      </Grid2>
    </div>
  );
};
