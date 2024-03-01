import { FC, useState } from "react";
import {
  TableCell,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

import { Subscription } from "../types";

interface SubscriptionRowProps {
  subscription: Subscription;
}

const SubscriptionRow: FC<SubscriptionRowProps> = ({ subscription }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow key={subscription.email}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{subscription.email}</TableCell>
        <TableCell>{subscription.gender}</TableCell>
        <TableCell>{subscription.ethnicity}</TableCell>
        <TableCell>{subscription.dateOfBirth}</TableCell>
        <TableCell>{subscription.country}</TableCell>
        <TableCell>{subscription.income}</TableCell>
        <TableCell>{subscription.maritalStatus}</TableCell>
        <TableCell>{subscription.parentalStatus}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
          align="center"
          colSpan={12}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                align="center"
              >
                Interests
              </Typography>
              <Table size="medium" aria-label="interests">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">Time Spent (seconds)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscription.interests.map((interest) => (
                    <TableRow key={interest.category}>
                      <TableCell align="center" component="th" scope="row">
                        {interest.category}
                      </TableCell>
                      <TableCell align="center">{interest.timeSpent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SubscriptionRow;
