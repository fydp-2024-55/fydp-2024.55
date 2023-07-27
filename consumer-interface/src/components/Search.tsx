import React, { useState } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@mui/material";

export interface Row {
  name: string;
  type: string;
  inputPrefix?: string;
  minKey?: string;
  maxKey?: string;
  options?: string[];
  key?: string;
}

interface SearchProps {
  rows: Row[];
  criteria: {};
  setCriteria: React.Dispatch<React.SetStateAction<{}>>;
  setDisplayResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: React.FC<SearchProps> = ({
  rows,
  criteria,
  setCriteria,
  setDisplayResults,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDisplayResults(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* <TableContainer component={Paper} sx={{ maxWidth: "60vw", m: 4 }}>
        <Table aria-label="criteria-table">
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <Box fontWeight="fontWeightMedium" display="inline">
                    {row.name}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {row.type === "range" && row.minKey && row.maxKey ? (
                    <Box>
                      <TextField
                        id="min-text-field"
                        label="Minimum"
                        variant="outlined"
                        InputProps={
                          row.inputPrefix
                            ? {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {row.inputPrefix}
                                  </InputAdornment>
                                ),
                              }
                            : undefined
                        }
                        onChange={(e) =>
                          setCriteria({
                            ...criteria,
                            [row.minKey]: e.target.value,
                          })
                        }
                      />
                      <TextField
                        id="max-text-field"
                        label="Maximum"
                        variant="outlined"
                        InputProps={
                          row.inputPrefix
                            ? {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {row.inputPrefix}
                                  </InputAdornment>
                                ),
                              }
                            : undefined
                        }
                        onChange={(e) =>
                          setCriteria({
                            ...criteria,
                            [row.maxKey]: e.target.value,
                          })
                        }
                      />
                    </Box>
                  ) : row.type === "select" && row.options && row.key ? (
                    <Box>
                      {row.options.map((option) => (
                        <FormControlLabel
                          control={<Checkbox />}
                          label={option}
                        />
                      ))}
                    </Box>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" sx={{ width: 200 }} onClick={handleSubmit}>
        Search
      </Button> */}
    </Box>
  );
};

export default Search;
