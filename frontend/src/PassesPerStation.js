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
import { white, grey } from "@mui/material/colors";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PassesPerStation({ token }) {
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState("");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const [requestedData, setRequestedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [requestedCSV, setRequestedCSV] = useState("");

  const canSubmit = [station, datefrom, dateto].every(Boolean);

  let result = {};

  if (requestedData) {
    const onlyDates = requestedData.PassesList.map(
      (element) => new Date(element.PassTimeStamp)
    );

    const sortedDates = onlyDates.sort((a, b) => a.getTime() - b.getTime());

    const stringDates = sortedDates.map((element) =>
      element.toLocaleDateString()
    );

    //Group by dates and count
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

  useEffect(() => {
    const getStations = async () => {
      const stationsFromServer = await fetchStations();
      setStations(stationsFromServer);
    };
    getStations();
    console.log(stations);
  }, []);

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

      return data.StationIDList;
    } catch (error) {
      setOpen(true);
      return;
    }
  };

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
          {requestedData ? (
            <>
            <Paper>
              <Bar options={options} data={chartData}></Bar>
            </Paper>
            <div className="form-container3">
            <ColorButton>  
              <CSVLink
                style = {{color: "white"}}
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
