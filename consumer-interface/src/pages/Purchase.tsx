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

import {
  ProducerFilterOptions,
  ProducerFilter,
  ProducerCounts,
} from "../types";
import backendService from "../services/backend-service";
import PageTemplate from "../components/PageTemplate";

export interface Row {
  name: string;
  type: string;
  inputPrefix?: string;
  minKey?: string;
  maxKey?: string;
  options?: string[];
  key?: string;
}

const Purchase: React.FC = () => {
  const [criteria, setCriteria] = useState<Row[]>();
  const [filters, setFilters] = useState<ProducerFilter>({
    minAge: 0,
    maxAge: 0,
    genders: [],
    ethnicities: [],
    countries: [],
    minIncome: 0,
    maxIncome: 0,
    maritalStatuses: [],
    parentalStatuses: [],
  });
  const [counts, setCounts] = useState<ProducerCounts | undefined>();

  const handleCheck = (
    checked: boolean,
    key: string,
    criteriaIdx: number,
    optionIdx: number
  ) => {
    if (!criteria) return;
    let arr: any[] = [];
    if (checked) {
      arr.push(criteria[criteriaIdx].options![optionIdx]);
    } else {
      let index = arr.indexOf(criteria[criteriaIdx].options![optionIdx]);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
    setFilters({
      ...filters,
      [key!]: arr,
    });
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!filters) return;
    const result = await backendService.getProducerCounts(filters);
    setCounts(result);
  };

  const fetchFilterCriteria = async () => {
    const filterOptions = await backendService.getProducerFilterOptions();
    const criteria: Row[] = [
      { name: "Age", type: "range", minKey: "minAge", maxKey: "maxAge" },
      {
        name: "Gender",
        type: "select",
        options: filterOptions?.genders,
        key: "genders",
      },
      {
        name: "Ethnicity",
        type: "select",
        options: filterOptions?.ethnicities,
        key: "ethnicities",
      },
      {
        name: "Country",
        type: "select",
        options: filterOptions?.countries,
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
        options: filterOptions?.maritalStatuses,
        key: "maritalStatuses",
      },
      {
        name: "Parental Status",
        type: "select",
        options: filterOptions?.parentalStatuses,
        key: "parentalStatuses",
      },
    ];
    setCriteria(criteria);
  };

  useEffect(() => {
    fetchFilterCriteria();
  }, []);

  return (
    <PageTemplate>
      {/* {results ? (
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
                      Male:
                    </Box>{" "}
                    {results.gender.M}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      Female:
                    </Box>{" "}
                    {results.gender.F}
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.N}:
                    </Box>{" "}
                    {results.ethnicities.N}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.A}:
                    </Box>{" "}
                    {results.ethnicities.A}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.B}:
                    </Box>{" "}
                    {results.ethnicities.B}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.H}:
                    </Box>{" "}
                    {results.ethnicities.H}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.W}:
                    </Box>{" "}
                    {results.ethnicities.W}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {Ethnicity.O}:
                    </Box>{" "}
                    {results.ethnicities.O}
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      10-20:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      20-30:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      30-40:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      40-50:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      50-60:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      60-70:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      70-80:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      80-90:{" "}
                    </Box>{" "}
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      Canada:
                    </Box>{" "}
                    {results.countries.Canada}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      United States of America:{" "}
                    </Box>{" "}
                    {results.countries["United States of America"]}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      Mexico:
                    </Box>{" "}
                    {results.countries.Mexico}
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $0-50,000:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $50,000-100,000:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $100,000-150,000:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $150,000-200,000:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $200,000-250,000:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $250,000-300,000:{" "}
                    </Box>{" "}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      $300,000-350,000:{" "}
                    </Box>{" "}
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.M}:
                    </Box>{" "}
                    {results.maritalStatuses.M}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.S}:
                    </Box>{" "}
                    {results.maritalStatuses.S}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.D}:
                    </Box>{" "}
                    {results.maritalStatuses.D}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {MaritalStatus.W}:
                    </Box>{" "}
                    {results.maritalStatuses.W}
                  </TableCell>
                  <TableCell>
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {ParentalStatus.Y}:
                    </Box>{" "}
                    {results.parentalStatuses.Y}
                    <br />
                    <br />
                    <Box fontWeight="fontWeightMedium" display="inline">
                      {ParentalStatus.N}:
                    </Box>{" "}
                    {results.parentalStatuses.N}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" sx={{ width: 200 }}>
            Purchase
          </Button>
        </Box>
      ) : ( */}
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
              {criteria &&
                criteria.map((row, criteriaIdx) => (
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
                              setFilters({
                                ...filters,
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
                              setFilters({
                                ...filters,
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
                                  checked={(filters as any)[row.key!].includes(
                                    criteria[criteriaIdx].options![optionIdx]
                                  )}
                                  onChange={(event) =>
                                    handleCheck(
                                      event.target.checked,
                                      row.key!,
                                      criteriaIdx,
                                      optionIdx
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
        <Button variant="contained" sx={{ width: 200 }} onClick={handleSearch}>
          Search
        </Button>
      </Box>
      {/* )} */}
    </PageTemplate>
  );
};

export default Purchase;
