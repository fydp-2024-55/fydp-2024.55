import React from "react";
import { Grid } from "@mui/material";

interface PageTemplateProps {
  children: JSX.Element;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      sx={{ minHeight: "100vh", p: 5 }}
    >
      {children}
    </Grid>
  );
};

export default PageTemplate;
