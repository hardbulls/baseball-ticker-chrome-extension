import Grid2 from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

interface Props {
  handleLoadSponsors: (sponsors: string[]) => void;
}

const domParser = new DOMParser();

const downloadSponsors = async () => {
  const html = await Promise.resolve((new Promise((resolve) => {
    chrome.runtime.sendMessage({ url: "https://www.hardbulls.com/" }, response => {
      resolve(response);
    });
  }))) as string;

  const dom = domParser.parseFromString(html, "text/html");
  const sponsors = [];

  const sponsorItems = dom.querySelectorAll(".cd-sponsors-item img") as NodeListOf<HTMLImageElement>;

  for (const item of sponsorItems) {
    sponsors.push(item.src.replace(window.location.origin, 'https://www.hardbulls.com'));
  }

  return sponsors;
};

export const SponsorSettings = ({ handleLoadSponsors }: Props) => {
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 xs={3}>
          <Button
            sx={{
              p: 2
            }}
            fullWidth
            onClick={async () => handleLoadSponsors(await downloadSponsors())}
            variant="contained"
          >
            Download Sponsors
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
};
