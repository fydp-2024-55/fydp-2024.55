import { FC, ReactNode } from "react";
import { Grid } from "@mui/material";

const PageTemplate: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", p: 5 }}
    >
      {children}
    </Grid>
  );
};

export default PageTemplate;
