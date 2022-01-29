import "./App.css";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Box from "@mui/material/Box";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FormControl as MuiFormControl, InputLabel } from "@mui/material";
import { MenuItem, Select, TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { CSVLink } from "react-csv";
import { grey } from "@mui/material/colors";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: grey[900],
  "&:hover": {
    backgroundColor: grey[700],
  },
}));

const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
  max-width: 300px;
  border-color: "4px solid #ffffff";
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PassesCost({ token }) {
  const [operators, setOperators] = useState([]);
  const [op1, setOp1] = useState("");
  const [op2, setOp2] = useState("");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const [requestedData, setRequestedData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const canSubmit = [op1, op2, datefrom, dateto].every(Boolean);
  const [requestedCSV, setRequestedCSV] = useState("");

  useEffect(() => {
    const getOperators = async () => {
      const operatorsFromServer = await fetchOperators();
      setOperators(operatorsFromServer);
    };
    getOperators();
    console.log(operators);
  }, []);

  const handleOp1Change = (event) => {
    setOp1(event.target.value);
  };

  const handleOp2Change = (event) => {
    setOp2(event.target.value);
  };

  const handleDateFromChange = (newdate) => {
    setDatefrom(newdate);
  };

  const handleDateToChange = (newdate) => {
    setDateto(newdate);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const fetchOperators = async () => {
    try {
      const res = await fetch(
        "http://localhost:9103/interoperability/api/GetOperatorIDs",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "x-observatory-auth": token,
          },
        }
      );
      const data = await res.json();

      return data.OperatorIDList;
    } catch (error) {
      setOpen(true);
      return;
    }
  };

  const fetchResults = async (operatorid1, operatorid2, datefrom, dateto) => {
    const datefromstr = `${datefrom.getFullYear()}${String(
      datefrom.getMonth() + 1
    ).padStart(2, "0")}${String(datefrom.getDate()).padStart(2, "0")}`;

    const datetostr = `${dateto.getFullYear()}${String(
      dateto.getMonth() + 1
    ).padStart(2, "0")}${String(dateto.getDate()).padStart(2, "0")}`;

    const res = await fetch(
      `http://localhost:9103/interoperability/api/PassesCost/${operatorid1}/${operatorid2}/${datefromstr}/${datetostr}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "x-observatory-auth": token,
        },
      }
    );

    const rescsv = await fetch(
      `http://localhost:9103/interoperability/api/PassesCost/${operatorid1}/${operatorid2}/${datefromstr}/${datetostr}?format=csv`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "x-observatory-auth": token,
        },
      }
    );

    const data = await res.json();
    const datacsv = await rescsv.text();

    setRequestedData(data);
    console.log(datacsv);
    setRequestedCSV(String(datacsv));
    console.log(data);
  };

  return (
    <main>
      <section className="index-banner">
        <h2>Passes Cost</h2>
        <div className="form-container">
          <Stack spacing={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Operator 1
                  </InputLabel>
                  <Select
                    className="form-input"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={op1}
                    label="Operator1"
                    onChange={handleOp1Change}
                  >
                    {operators &&
                      operators.map((element) => (
                        <MenuItem key={element} value={element}>
                          {element}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Operator 2
                  </InputLabel>
                  <Select
                    className="form-input"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={op2}
                    label="Operator2"
                    onChange={handleOp2Change}
                  >
                    {operators &&
                      operators.map((elem) => (
                        <MenuItem key={elem} value={elem}>
                          {elem}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div className="form-input">
                    <DesktopDatePicker
                      label="Date from"
                      inputFormat="MM/dd/yyyy"
                      value={datefrom}
                      onChange={handleDateFromChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div className="form-input">
                    <DesktopDatePicker
                      label="Date to"
                      inputFormat="MM/dd/yyyy"
                      value={dateto}
                      onChange={handleDateToChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </LocalizationProvider>
              </FormControl>
            </Box>
            <Button
              variant="contained"
              disabled={!canSubmit}
              onClick={() => {
                fetchResults(op1, op2, datefrom, dateto);
              }}
            >
              Search
            </Button>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Failed to fetch operators from server!
              </Alert>
            </Snackbar>
          </Stack>
        </div>
        {requestedData ? (
          <>
          <div className="data-presentation">
            <table className="bigtable2">
              <thead>
                <tr>
                  <th scope="col">Total Passes Cost</th>
                  <th scope="col">Total Number Of Passes</th>
                  <th scope="col">Average Fee Per Pass</th>
                </tr>
              </thead>
              <tbody>
                <tr key="data-row">
                  <td>{requestedData.PassesCost} Euros </td>
                  <td>{requestedData.NumberOfPasses} Times</td>
                  <td>
                    {(
                      Math.round(
                        (requestedData.PassesCost /
                          requestedData.NumberOfPasses) *
                          100
                      ) / 100
                    ).toFixed(2)}{" "}
                    Euros
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="form-container3">
            <ColorButton>  
              <CSVLink
                style = {{color: "white"}}
                filename="PassesCostReport.csv"
                data={requestedCSV}
              >
                Download All Data
              </CSVLink>
            </ColorButton> 
            </div>
          </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

export default PassesCost;
