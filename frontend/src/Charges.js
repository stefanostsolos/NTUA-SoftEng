/* All the needed components for the page are imported */
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
import { white, grey } from "@mui/material/colors";
import jwt_decode from "jwt-decode";

/* The download button as csv file stylewise is available here */
const ColorButton = styled(Button)(({ theme }) => ({
  color: "#ffffff",
  backgroundColor: grey[900],
  "&:hover": {
    backgroundColor: grey[700],
  },
}));

/* The form elements are spaced for visual and functional reasons */
const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
  max-width: 300px;
  border-color: "4px solid #ffffff";
`;

/* Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child. */
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/* The token is passed inside the function */
function Charges({ token }) {
  /*  A Hook is a special function that lets you “hook into” React features. For example, useState is a Hook that lets you add React state to function components. */
  const decodedToken = jwt_decode(token);
  const [operators, setOperators] = useState([]);
  const [operator, setOperator] = useState(decodedToken.type === "operator" ? decodedToken.operatorID : "");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const [requestedData, setRequestedData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const canSubmit = [operator, datefrom, dateto].every(Boolean);
  const [requestedCSV, setRequestedCSV] = useState("");

  /* By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we refer to it as our “effect”), and call it later after performing the DOM updates. DOM stands for Document Object Model */
  useEffect(() => {
    const getOperators = async () => {
      const operatorsFromServer = await fetchOperators();
      setOperators(operatorsFromServer);
    };
    getOperators();
    console.log(operators);
  }, []);
  /* Event handlers determine what action is to be taken whenever an event is fired. This could be a button click or a change in a text input. Essentially, event handlers are what make it possible for users to interact with your React app. */
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
  /* The operator ID's are fetched */
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
      /* The Operator ID List is returned */
      return data.OperatorIDList;
    } catch (error) {
      setOpen(true);
      return;
    }
  };
  /* After the data fetch we get Operator ID, the date from and the date to in the string form */
  const fetchResults = async (operatorid, datefrom, dateto) => {
    const datefromstr = `${datefrom.getFullYear()}${String(
      datefrom.getMonth() + 1
    ).padStart(2, "0")}${String(datefrom.getDate()).padStart(2, "0")}`;

    const datetostr = `${dateto.getFullYear()}${String(
      dateto.getMonth() + 1
    ).padStart(2, "0")}${String(dateto.getDate()).padStart(2, "0")}`;

    const res = await fetch(
      `http://localhost:9103/interoperability/api/ChargesBy/${operatorid}/${datefromstr}/${datetostr}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "x-observatory-auth": token,
        },
      }
    );
    /* The data are getting modified so that they can be downloaded from as a csv file. The ?format=csv link is used which gives the data in csv form directly from the backend  */
    const rescsv = await fetch(
      `http://localhost:9103/interoperability/api/ChargesBy/${operatorid}/${datefromstr}/${datetostr}?format=csv`,
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

    setRequestedData(data.PPOList);
    console.log(datacsv);
    setRequestedCSV(String(datacsv));
    console.log(data.PPOList)
  };

  return (
    <main>
      <section className="index-banner">
        <h2>Charges</h2>
        <div className="form-container">
          <Stack spacing={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                {decodedToken?.type === 'admin' ? (
                  /* As admin all the operator options are available below */
                  <>
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
                  </>
                ) : null}

                {/* The date from/The date to form elements are stated below */}
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
            {/* The Button Search is available only if all form elements are filled */}
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
            {/* In case that the backend is not running or failed, a notification will pop in a few seconds */}
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
        {/* If all the data are fetched right, then a table with the Total Passes Cost, Total Number of Passes and the Visiting Operator will be shown accordingly to the search parameters */}
        {requestedData.length > 0 ? (
          <>
            <div className="data-presentation">
              <table className="bigtable2">
                <thead>
                  <tr>
                    <th scope="col">Total Passes Cost</th>
                    <th scope="col">Total Number Of Passes</th>
                    <th scope="col">Visiting Operator</th>
                  </tr>
                </thead>
                <tbody>
                  {requestedData.map((element, index) => (
                    <tr key={index}>
                      <td>{element.PassesCost} Euros </td>
                      <td>{element.NumberOfPasses} Times</td>
                      <td>{element.VisitingOperator} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="form-container3">
                <ColorButton>
                  {/* The requested data are also available to a downloadable csv file */}
                  <CSVLink
                    style={{ color: "white" }}
                    filename="ChargesReport.csv"
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

export default Charges;