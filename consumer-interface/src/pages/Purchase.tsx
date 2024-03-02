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

import { ProducerFilter, ProducerCounts } from "../types";
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
    genders: [],
    ethnicities: [],
    countries: [],
    maritalStatuses: [],
    parentalStatuses: [],
  });
  const [counts, setCounts] = useState<ProducerCounts>();

  const handleCheck = (checked: boolean, key: string, value: string) => {
    if (!filters) return;
    const updatedValues = checked
      ? [...((filters as any)[key] || []), value] // Add the value if checked
      : ((filters as any)[key] || []).filter((v: string) => v !== value); // Remove the value if unchecked
    setFilters({
      ...filters,
      [key]: updatedValues,
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
      {counts ? (
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
                  <TableCell>{counts.totalResults}</TableCell>
                  {[
                    "genders",
                    "ethnicities",
                    "ages",
                    "countries",
                    "incomes",
                    "maritalStatuses",
                    "parentalStatuses",
                  ].map((key) => (
                    <TableCell key={key}>
                      {(counts as any)[key] &&
                        Object.entries((counts as any)[key]).map(
                          ([subKey, value]) => (
                            <div key={subKey}>
                              <Box
                                fontWeight="fontWeightMedium"
                                display="inline"
                              >
                                {subKey}:
                              </Box>{" "}
                              {value as string}
                              <br />
                              <br />
                            </div>
                          )
                        )}
                    </TableCell>
                  ))}
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
                            {row.options.map((option) => (
                              <FormControlLabel
                                key={option}
                                control={
                                  <Checkbox
                                    checked={(
                                      (filters as any)[row.key!] || []
                                    ).includes(option)}
                                    onChange={(event) =>
                                      handleCheck(
                                        event.target.checked,
                                        row.key!,
                                        option
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
