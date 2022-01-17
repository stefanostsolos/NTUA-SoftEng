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

const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
  max-width: 300px;
  border-color: "4px solid #ffffff";
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Charges({ token }) {
  const [operators, setOperators] = useState([]);
  const [operator, setOperator] = useState("");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const [requestedData, setRequestedData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const canSubmit = [operator, datefrom, dateto].every(Boolean);

  useEffect(() => {
    const getOperators = async () => {
      const operatorsFromServer = await fetchOperators();
      setOperators(operatorsFromServer);
    };
    getOperators();
    console.log(operators);
  }, []);

  const handleOperatorChange = (event) => {
    setOperator(event.target.value);
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

  const fetchResults = async (operatorid, datefrom, dateto) => {
    const datefromstr = `${datefrom.getFullYear()}${String(
      datefrom.getMonth() + 1
    ).padStart(2, "0")}${String(datefrom.getDate()).padStart(2, "0")}`;

    const datetostr = `${dateto.getFullYear()}${String(
      dateto.getMonth() + 1
    ).padStart(2, "0")}${String(dateto.getDate()).padStart(2, "0")}`;

    const res = await fetch(
      `http://localhost:9103/interoperability/api//ChargesBy/${operatorid}/${datefromstr}/${datetostr}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "x-observatory-auth": token,
        },
      }
    );

    const data = await res.json();

    setRequestedData(data);
  };

  return (
    <main>
      <section className="index-banner">
        <h2>Charges</h2>
        <div className="form-container">
          <Stack spacing={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Operator ID
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={operator}
                  label="Operator"
                  onChange={handleOperatorChange}
                  className="form-input"
                >
                  {operators &&
                    operators.map((element) => (
                      <MenuItem key={element} value={element}>
                        {element}
                      </MenuItem>
                    ))}
                </Select>

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
                fetchResults(operator, datefrom, dateto);
                console.log(operator);
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
          <div className="data-presentation">
            <table className="bigtable">
              <thead>
                <tr>
                  <th scope="col">Total Passes Cost</th>
                  <th scope="col">Total Number Of Passes</th>
                  <th scope="col">Visiting Operator</th>
                </tr>
              </thead>
              <tbody>
                <tr key="data-row">
                  <td>{requestedData.PassesCost} Euros </td>
                  <td>{requestedData.NumberOfPasses} Times</td>
                  <td>{requestedData.VisitingOperator} </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default Charges;
