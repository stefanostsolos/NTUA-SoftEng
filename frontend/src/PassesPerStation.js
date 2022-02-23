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
import { Bar } from "react-chartjs-2";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Paper from "@material-ui/core/Paper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CSVLink } from "react-csv";
import { grey } from "@mui/material/colors";
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

/* Chart class */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/* Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child. */
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/* The token is passed inside the function */
function PassesPerStation({ token }) {
  /*  A Hook is a special function that lets you “hook into” React features. For example, useState is a Hook that lets you add React state to function components. */
  const decodedToken = jwt_decode(token);
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState("");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const [requestedData, setRequestedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [requestedCSV, setRequestedCSV] = useState("");

  const canSubmit = [station, datefrom, dateto].every(Boolean);

  let result = {};

  /* Graph dates sorting */
  if (requestedData) {
    const onlyDates = requestedData.PassesList.map(
      (element) => new Date(element.PassTimeStamp)
    );

    const sortedDates = onlyDates.sort((a, b) => a.getTime() - b.getTime());

    const stringDates = sortedDates.map((element) =>
      element.toLocaleDateString()
    );

    /* Group by dates and count */
    result = stringDates.reduce((a, c) => ((a[c] = (a[c] || 0) + 1), a), {});
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Passes Per Station Analysis",
      },
    },
  };

  /* The data are graphed */
  const chartData = {
    labels: Object.keys(result),
    datasets: [
      {
        label: "Number of Passes",
        data: Object.values(result),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  /* By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we refer to it as our “effect”), and call it later after performing the DOM updates. DOM stands for Document Object Model */
  useEffect(() => {
    const getStations = async () => {
      const stationsFromServer = await fetchStations();
      setStations(decodedToken.type === "operator" ?
      stationsFromServer.filter(station => station.substring(0,2) === decodedToken.operatorID) :
      stationsFromServer);
    };
    getStations();
    console.log(stations);
  }, []);

  /* Event handlers determine what action is to be taken whenever an event is fired. This could be a button click or a change in a text input. Essentially, event handlers are what make it possible for users to interact with your React app. */
  const handleStationChange = (event) => {
    setStation(event.target.value);
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

  /* The Station ID's are fetched */
  const fetchStations = async () => {
    try {
      const res = await fetch(
        "http://localhost:9103/interoperability/api/GetStationIDs",
        {
          method: "GET",
          mode: "cors",
          headers: {
            "x-observatory-auth": token,
          },
        }
      );
      const data = await res.json();
      /* The Station ID List is returned */
      return data.StationIDList;
    } catch (error) {
      setOpen(true);
      return;
    }
  };

  /* After the data fetch we get the Station ID, the date from and the date to in the string form */
  const fetchResults = async (stationid, datefrom, dateto) => {
    const datefromstr = `${datefrom.getFullYear()}${String(
      datefrom.getMonth() + 1
    ).padStart(2, "0")}${String(datefrom.getDate()).padStart(2, "0")}`;

    const datetostr = `${dateto.getFullYear()}${String(
      dateto.getMonth() + 1
    ).padStart(2, "0")}${String(dateto.getDate()).padStart(2, "0")}`;

    const res = await fetch(
      `http://localhost:9103/interoperability/api/PassesPerStation/${stationid}/${datefromstr}/${datetostr}`,
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
      `http://localhost:9103/interoperability/api/PassesPerStation/${stationid}/${datefromstr}/${datetostr}?format=csv`,
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
        <h2>Passes Per Station</h2>
        <div className="form-container">
          {/* The 4-Form elements: Station ID, Date from, Date to and Search button */}
          <Stack spacing={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Station ID
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={station}
                  label="Station"
                  onChange={handleStationChange}
                  className="form-input"
                >
                  {stations &&
                    stations.map((elem) => (
                      <MenuItem key={elem} value={elem}>
                        {elem}
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
            {/* The Search Button is clickable only when all the fields are filled */}
            <Button
              variant="contained"
              disabled={!canSubmit}
              onClick={() => {
                fetchResults(station, datefrom, dateto);
                console.log(station);
              }}
            >
              Search
            </Button>
            {/* In case of error an error-message appears */}
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Failed to fetch stations from server!
              </Alert>
            </Snackbar>
          </Stack>
        </div>
        <div className="chart">
          {/* The requested data are charted and they can also be downloaded as csv file */}
          {requestedData ? (
            <>
              <Paper>
                <Bar options={options} data={chartData}></Bar>
              </Paper>
              <div className="form-container3">
                <ColorButton>
                  <CSVLink
                    style={{ color: "white" }}
                    filename="PassesPerStationReport.csv"
                    data={requestedCSV}
                  >
                    Download All Data
                  </CSVLink>
                </ColorButton>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default PassesPerStation;
