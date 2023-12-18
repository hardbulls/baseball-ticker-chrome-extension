import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabItem } from "./TabItem";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

interface Props {
  items: TabItem[];
}

export const TabSection = ({ items }: Props) => {
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ bgcolor: "background.paper"}} >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {items.map((item, index) => {
            return (
              <Tab key={index} label={item.label} {...a11yProps(index)} />
            );
          })}
        </Tabs>
      </Box>
      {items.map((item, index) => {
        return (
          <TabPanel key={index} value={value} index={index}>
            {item.component}
          </TabPanel>
        );
      })}
    </Box>
  );
};
