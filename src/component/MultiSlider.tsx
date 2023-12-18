import { FormControl, FormLabel, Slider } from "@mui/material";
import  { useState } from "react";

interface Props {
  label: string
  value: Array<number>
  onChange: (value: number[]) => void
}

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 100,
    label: '100%',
  },
];

export const MultiSlider = ({value, onChange, label}: Props) => {
  const [selectedValue, setValue] = useState<number[]>(value);

  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <Slider
        value={selectedValue}
        step={1}
        min={0}
        max={100}
        onChange={( _, newValue) => {
          if (!Array.isArray(newValue)) {
            return;
          }

          setValue(newValue)
        }}
        onBlur={() => onChange(selectedValue)}
        valueLabelDisplay="auto"
        disableSwap
        marks={marks}
      />
    </FormControl>
  );
}
