import  { useState } from "react";
import { FormControl, Input, InputLabel } from "@mui/material";

interface Props {
  label?: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ label, color, onChange }: Props) => {
  const [selectedColor, setSelectedColor] = useState<string>(color);

  return (
    <div>
      <FormControl fullWidth
                   variant="filled"
      >
        <InputLabel>{label}</InputLabel>
        <Input
          type={"color"}
          value={color}
          onChange={(event) => setSelectedColor(event.currentTarget.value)}
          onBlur={() => onChange(selectedColor)}
          />
      </FormControl>
    </div>
  );
};
