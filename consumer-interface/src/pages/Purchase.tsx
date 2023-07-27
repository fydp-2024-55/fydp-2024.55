import React, { useState, useEffect } from "react";
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

import PageTemplate from "../components/PageTemplate";
import Results from "../components/Results";

interface Criteria {
  minAge: string;
  maxAge: string;
  genders: string[];
  ethnicities: string[];
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

const CRITERIA = [
  { name: "Age", type: "range", minKey: "minAge", maxKey: "maxAge" },
  {
    name: "Gender",
    type: "select",
    options: ["Male", "Female"],
    key: "genders",
  },
  {
    name: "Ethnicity",
    type: "select",
    options: [
      "American Indian or Alaskan Native",
      "Asian/Pacific Islander",
      "Black or African American",
      "Hispanic",
      "White/Caucasian",
      "Other",
    ],
    key: "ethnicities",
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
    options: ["Married", "Single", "Divorced", "Widowed"],
    key: "maritalStatuses",
  },
  {
    name: "Parental Status",
    type: "select",
    options: ["Parent", "Not a parent"],
    key: "parentalStatuses",
  },
];

const Purchase: React.FC = () => {
  const [criteria, setCriteria] = useState<Criteria>({
    minAge: "",
    maxAge: "",
    genders: [],
    ethnicities: [],
    minIncome: "",
    maxIncome: "",
    maritalStatuses: [],
    parentalStatuses: [],
  });
  const [displayResults, setDisplayResults] = useState<boolean>(false);

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
    setDisplayResults(true);
  };

  return (
    <PageTemplate>
      {displayResults ? (
        <Results />
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
