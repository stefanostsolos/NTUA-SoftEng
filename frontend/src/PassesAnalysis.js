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
import Paper from "@material-ui/core/Paper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
/* import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import login from './login';
import Signup from './signup';
import HomeNavButton from './HomeNavButton';
import { Link } from 'react-router-dom';
import InputField from './InputField'; */

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

const fetchOperators = async () => {
  const res = await fetch(
    "http://localhost:9103/interoperability/api/GetOperatorIDs", {
      method: 'GET',
      mode: 'cors',
      headers: {
        'x-observatory-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidHlwZSI6ImFkbWluIiwib3BlcmF0b3JJRCI6bnVsbCwiaWF0IjoxNjQxOTIxNzUyLCJleHAiOjE2NDE5MjUzNTJ9.aNIfDI5LxIiAkzrb6Dkd1zu58Vu9wb3pDmDMGePd_TM'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  const data = await res.json();

  return data.OperatorIDList;
};

function PassesAnalysis() {
  const [operators, setOperators] = useState([]);
  const [op1, setOp1] = useState("");
  const [op2, setOp2] = useState("");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const [requestedData, setRequestedData] = useState(null);
  const canSubmit = [op1, op2, datefrom, dateto].every(Boolean);

  
  let result = {};

  if(requestedData) {

    const onlyDates = requestedData.PassesList.map(element => new Date(element.TimeStamp));

    const sortedDates = onlyDates.sort((a,b)=>a.getTime()-b.getTime());

    const stringDates = sortedDates.map(element => element.toLocaleDateString());
  
    //Group by dates and count 
    result = stringDates.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {});
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bar Chart',
      },
    },
  };

  const chartData = {
    labels: Object.keys(result),
    datasets: [
      {
        label: 'Number of Passes',
        data: Object.values(result),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

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

  const fetchResults = async (operatorid1, operatorid2, datefrom, dateto) => {
    const datefromstr = `${datefrom.getFullYear()}${String(
      datefrom.getMonth() + 1
    ).padStart(2, "0")}${String(datefrom.getDate()).padStart(2, "0")}`;

    const datetostr = `${dateto.getFullYear()}${String(
      dateto.getMonth() + 1
    ).padStart(2, "0")}${String(dateto.getDate()).padStart(2, "0")}`;

    const res = await fetch(
      `https://virtserver.swaggerhub.com/VikentiosVitalis/RESTAPI-Toll-Interoperability/1.1.0/PassesAnalysis/${operatorid1}/${operatorid2}/${datefromstr}/${datetostr}`
    );

    const data = await res.json();

    setRequestedData(data);
    //console.log(data)
  };

  return (
    <main>
      <section className="index-banner">
        <h2>Passes Analysis</h2>
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
                    {operators.map((element) => (
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
                    {operators.map((element) => (
                      <MenuItem key={element} value={element}>
                        {element}
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
                console.log(op1, op2);
              }}
            >
              Search
            </Button>
          </Stack>
        </div>
        <div className="chart">
        {requestedData ? (
          <Paper>
            <Bar options={options} data={chartData}>
            </Bar>
          </Paper> ) : (
            null
          )}
        </div>
      </section>
    </main>
  );
}

export default PassesAnalysis;
