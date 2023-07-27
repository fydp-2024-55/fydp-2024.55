import React, { useState } from "react";
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

const SubscriptionRow: React.FC<SubscriptionRowProps> = ({ subscription }) => {
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
        <TableCell component="th" scope="row">
          {subscription.name}
        </TableCell>
        <TableCell>{subscription.email}</TableCell>
        <TableCell>{subscription.gender}</TableCell>
        <TableCell>{subscription.ethnicity}</TableCell>
        <TableCell>{subscription.dateOfBirth}</TableCell>
        <TableCell>{subscription.city}</TableCell>
        <TableCell>{subscription.state}</TableCell>
        <TableCell>{subscription.country}</TableCell>
        <TableCell>{subscription.income}</TableCell>
        <TableCell>{subscription.maritalStatus}</TableCell>
        <TableCell>{subscription.parentalStatus}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="medium" aria-label="history">
                <TableHead>
                  <TableRow>
                    <TableCell>URL</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Visit Time</TableCell>
                    <TableCell>Time Spent (minutes)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscription.history.map((historyRow) => (
                    <TableRow key={historyRow.visitTime}>
                      <TableCell component="th" scope="row">
                        {historyRow.url}
                      </TableCell>
                      <TableCell>{historyRow.title}</TableCell>
                      <TableCell>{historyRow.visitTime}</TableCell>
                      <TableCell>{historyRow.timeSpent}</TableCell>
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
