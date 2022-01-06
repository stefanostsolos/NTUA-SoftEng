import "./App.css";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Box from "@mui/material/Box";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import {
  FormControl as MuiFormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import Stack from "@mui/material/Stack";
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

function Charges() {
  const [op1, setOp1] = useState("");
  const [op2, setOp2] = useState("");
  const [datefrom, setDatefrom] = useState(null);
  const [dateto, setDateto] = useState(null);
  const operators = ["AAA0939423", "AAB2596984", "AAB6113266"];

  const handleOperatorChange = (event) => {
    setOp1(event.target.value);
  };


  const handleDateFromChange = (newdate) => {
    setDatefrom(newdate);
  };

  const handleDateToChange = (newdate) => {
    setDateto(newdate);
  };

  let x = document.cookie.split(";").reduce((res, c) => {
    const [key, val] = c.trim().split("=").map(decodeURIComponent);
    const allNumbers = (str) => /^\d+$/.test(str);
    try {
      return Object.assign(res, {
        [key]: allNumbers(val) ? val : JSON.parse(val),
      });
    } catch (e) {
      return Object.assign(res, { [key]: val });
    }
  }, {});


  return (
    <main>
      <section className="index-banner">
        <h2>Charges</h2>
        <div style={{ zIndex: 99 }}>
          <Stack spacing={3}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Operator ID
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={op1}
                  label="Operator1"
                  onChange={handleOperatorChange}
                >
                  {operators.map((element) => (
                    <MenuItem value={element}>{element}</MenuItem>
                  ))}
                </Select>
            
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Date from"
                    inputFormat="MM/dd/yyyy"
                    value={datefrom}
                    onChange={handleDateFromChange}
                    renderInput={(params) => <TextField {...params} />}
                  />

                  <DesktopDatePicker
                    label="Date to"
                    inputFormat="MM/dd/yyyy"
                    value={dateto}
                    onChange={handleDateToChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </FormControl>
            </Box>
          </Stack>
        </div>
      </section>
    </main>
  );
}

export default Charges;