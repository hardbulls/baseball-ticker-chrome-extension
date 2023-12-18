import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import PACKAGE_JSON from "../../package.json";

export const Copyright = () => {
  return (
    <div>
      <Typography variant="body2" color="text.secondary" align="center">
        <Link color="inherit" href={PACKAGE_JSON.homepage}>{PACKAGE_JSON.description}</Link>
        {" - "}Version {PACKAGE_JSON.version}{" - "}
        {"Copyright © "}
        <Link color="inherit" href={PACKAGE_JSON.author?.url}>
          {PACKAGE_JSON.author?.name}
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    </div>
  );
};
