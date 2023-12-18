import { convertFileToBase64 } from "../service/file-to-base64";
import { resizeImage } from "../service/image-resize";
import { Image } from "./model/Image";
import { FormControl, Input, InputLabel } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

interface Props {
  value?: string,
  handleFileUpload: (image: Image) => void
  handleReset: () => void
}

export const LeagueLogoUpload = ({ handleFileUpload, handleReset }: Props) => {
  const convertAndResizeImage = async (file: File | Blob) => {
    return await resizeImage(200, await convertFileToBase64(file));
  };

  return (
      <Grid2 container spacing={2}>
        <Grid2 xs={6}>
          <FormControl fullWidth
                       variant="filled"
          >
            <InputLabel shrink={true}>Upload League Logo</InputLabel>
            <Input
              type="file"
              name={`leagueLogo`}
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                const files = event.target.files;

                if (files && files[0]) {
                  handleFileUpload({
                    data: await convertAndResizeImage(files[0])
                  });
                }
              }}
            />
          </FormControl>
        </Grid2>
        <Grid2 xs={6}>
            <Button
              fullWidth
              onClick={() => handleReset()}
              variant="contained"
            >
              Reset League Logo
            </Button>
        </Grid2>
      </Grid2>
  );
};
