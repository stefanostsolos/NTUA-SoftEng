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
import { FormControl as MenuItem, Select, TextField } from "@mui/material";
/* import {Link} from "react-router-dom";
import SubmitButton from './SubmitButton';
import { SelectChangeEvent } from "@mui/material/Select"; */

const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
  max-width: 300px;
  border-color: "4px solid #ffffff";
`;

const fetchStations = async () => {
  const res = await fetch(
    "https://virtserver.swaggerhub.com/VikentiosVitalis/RESTAPI-Toll-Interoperability/1.1.0/GetStationIDs"
  );
  const data = await res.json();

  return data.StationIDList;
};

function PassesPerStation() {
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState("");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [requestedData, setRequestedData] = useState(null);

  useEffect(() => {
    const getStations = async () => {
      const stationsFromServer = await fetchStations();
      setStations(stationsFromServer);
    };
    getStations();
    console.log(stations);
  }, []);

  useEffect(() => {
    if (station && datefrom && dateto) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
    console.log(requestedData);
  }, [station, datefrom, dateto]);

  const handleStationChange = (event) => {
    setStation(event.target.value);
  };

  const handleDateFromChange = (newdate) => {
    setDatefrom(newdate);
  };

  const handleDateToChange = (newdate) => {
    setDateto(newdate);
  };

  const fetchResults = async (stationid, datefrom, dateto) => {
    const datefromstr = `${datefrom.getFullYear()}${String(
      datefrom.getMonth() + 1
    ).padStart(2, "0")}${String(datefrom.getDate()).padStart(2, "0")}`;

    const datetostr = `${dateto.getFullYear()}${String(
      dateto.getMonth() + 1
    ).padStart(2, "0")}${String(dateto.getDate()).padStart(2, "0")}`;

  
    const res = await fetch(
      `https://virtserver.swaggerhub.com/VikentiosVitalis/RESTAPI-Toll-Interoperability/1.1.0/PassesPerStation/${stationid}/${datefromstr}/${datetostr}`
    );

    const data = await res.json();

    setRequestedData(data);
    //console.log(data)
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
                  {stations.map((element) => (
                    <MenuItem value={element}>{element}</MenuItem>
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
              }
            }
            >
              Search
            </Button>
          </Stack>
        </div>
        <p>{JSON.stringify(requestedData)}</p>
      </section>
    </main>
  );
}

export default PassesPerStation;
