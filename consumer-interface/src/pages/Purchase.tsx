import React, { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
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

import { Gender, Ethnicity, MaritalStatus, ParentalStatus } from "../types";
import PageTemplate from "../components/PageTemplate";

interface Criteria {
  minAge: string;
  maxAge: string;
  genders: string[];
  ethnicities: string[];
  countries: string[];
  minIncome: string;
  maxIncome: string;
  maritalStatuses: string[];
  parentalStatuses: string[];
}

export interface Row {
  name: string;
  type: string;
  inputPrefix?: string;
  minKey?: string;
  maxKey?: string;
  options?: string[];
  key?: string;
}

interface Result {
  ethAddresses: string[];
  gender: { [key: string]: number };
  ethnicities: { [key: string]: number };
  countries: { [key: string]: number };
  maritalStatuses: { [key: string]: number };
  parentalStatuses: { [key: string]: number };
}

const CRITERIA: Row[] = [
  { name: "Age", type: "range", minKey: "minAge", maxKey: "maxAge" },
  {
    name: "Gender",
    type: "select",
    options: [Gender.M, Gender.F],
    key: "genders",
  },
  {
    name: "Ethnicity",
    type: "select",
    options: [
      Ethnicity.N,
      Ethnicity.A,
      Ethnicity.B,
      Ethnicity.H,
      Ethnicity.W,
      Ethnicity.O,
    ],
    key: "ethnicities",
  },
  {
    name: "Country",
    type: "select",
    options: ["Canada", "United States of America", "Mexico"],
    key: "countries",
  },
  {
    name: "Income",
    type: "range",
    inputPrefix: "$",
    minKey: "minIncome",
    maxKey: "maxIncome",
  },
  {
    name: "Marital Status",
    type: "select",
    options: [
      MaritalStatus.M,
      MaritalStatus.S,
      MaritalStatus.D,
      MaritalStatus.W,
    ],
    key: "maritalStatuses",
  },
  {
    name: "Parental Status",
    type: "select",
    options: [ParentalStatus.Y, ParentalStatus.N],
    key: "parentalStatuses",
  },
];

const mockResults: Result = {
  ethAddresses: ["0x123", "0x456", "0x789", "0xabc", "0xdef", "0xghi"],
  gender: {
    M: 1,
    F: 2,
  },
  ethnicities: {
    N: 1,
    A: 1,
    B: 1,
    H: 1,
    W: 1,
    O: 1,
  },
  countries: {
    Canada: 1,
    "United States of America": 1,
    Mexico: 1,
  },
  maritalStatuses: {
    M: 1,
    S: 1,
    D: 1,
    W: 1,
  },
  parentalStatuses: {
    Y: 1,
    N: 3,
  },
};

const Purchase: React.FC = () => {
  const [criteria, setCriteria] = useState<Criteria>({
    minAge: "",
    maxAge: "",
    genders: [],
    ethnicities: [],
    countries: [],
    minIncome: "",
    maxIncome: "",
    maritalStatuses: [],
    parentalStatuses: [],
  });
  const [results, setResults] = useState<Result | undefined>([]);

  const handleCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string,
    optionIdx: number,
    criteriaIdx: number
  ) => {
    let arr = (criteria as any)[key] || [];
    if (event.target.checked) {
      arr.push(CRITERIA[criteriaIdx].options![optionIdx]);
    } else {
      let index = arr.indexOf(CRITERIA[criteriaIdx].options![optionIdx]);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
    setCriteria({
      ...criteria,
      [key!]: arr,
    });
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Fetch matching results from the database
    setResults(mockResults);
  };

  useEffect(() => {
    console.log(criteria);
  }, [criteria]);

  return (
    <PageTemplate>
      {results ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{ my: 2, height: "60vh", maxWidth: "70vw" }}
          >
            <Table>
              <colgroup>
                <col style={{ width: "800px" }} />
                <col style={{ width: "800px" }} />
                <col style={{ width: "800px" }} />
                <col style={{ width: "800px" }} />
                <col style={{ width: "800px" }} />
                <col style={{ width: "800px" }} />
                <col style={{ width: "800px" }} />
                <col style={{ width: "800px" }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell>Total Results</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Ethnicity</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Income</TableCell>
                  <TableCell>Marital Status</TableCell>
                  <TableCell>Parental Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{results.ethAddresses.length}</TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Gender.M}: {results.gender}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Gender.F}:{" "}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.N}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.A}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.B}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.H}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.W}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.O}:{" "}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      10-20:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      20-30:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      30-40:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      40-50:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      50-60:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      60-70:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      70-80:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      80-90:{" "}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      Canada:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      United States of America:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      Mexico:{" "}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $0-50,000:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $50,000-100,000:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $100,000-150,000:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $150,000-200,000:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $200,000-250,000:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $250,000-300,000:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $300,000-350,000:{" "}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.M}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.S}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.D}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.W}:{" "}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {ParentalStatus.Y}:{" "}
                    </Box>
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {ParentalStatus.N}:{" "}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" sx={{ width: 200 }}>
            Purchase
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TableContainer component={Paper} sx={{ maxWidth: "60vw", m: 4 }}>
            <Table aria-label="criteria-table">
              <TableBody>
                {CRITERIA.map((row, criteriaIdx) => (
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
                                [row.minKey!]: e.target.value,
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
                                [row.maxKey!]: e.target.value,
                              })
                            }
                          />
                        </Box>
                      ) : row.type === "select" && row.options && row.key ? (
                        <Box>
                          {row.options.map((option, optionIdx) => (
                            <FormControlLabel
                              key={option}
                              control={
                                <Checkbox
                                  checked={(criteria as any)[row.key!].includes(
                                    CRITERIA[criteriaIdx].options![optionIdx]
                                  )}
                                  onChange={(event) =>
                                    handleCheck(
                                      event,
                                      row.key!,
                                      optionIdx,
                                      criteriaIdx
                                    )
                                  }
                                />
                              }
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
          <Button
            variant="contained"
            sx={{ width: 200 }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      )}
    </PageTemplate>
  );
};

export default Purchase;
