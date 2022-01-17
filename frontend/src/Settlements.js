import "./App.css";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components/macro";
import { spacing } from "@material-ui/system";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { FormControl as MuiFormControl, InputLabel } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import jwt_decode from "jwt-decode";
import TodoList from "./TodoList";


const FormControlSpacing = styled(MuiFormControl)(spacing);

const FormControl = styled(FormControlSpacing)`
  min-width: 148px;
  max-width: 300px;
  border-color: "4px solid #ffffff";
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Settlements({ token }) {
  const [settlements, setSettlements] = useState([]);
  const [open, setOpen] = React.useState(false);

  const fetchSettlements = async () => {
    const decodedToken = jwt_decode(token) 
    try {
      const res = await fetch(
        `http://localhost:9103/interoperability/api/SettlementsByOperator/${decodedToken.operatorID}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "x-observatory-auth": token,
          },
        }
      );
      const data = await res.json();

      return data.SettlementList;
    } catch (error) {
      setOpen(true);
      return;
    }
  };

  useEffect(() => {
    const getSettlements = async () => {
      const settlementsFromServer = await fetchSettlements();
      setSettlements(settlementsFromServer);
    };
    getSettlements();
    console.log(settlements);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <main>
      <section className="index-banner">
        <h2>Settlements By Operator</h2>
        <div className="form-container">
          <Stack spacing={3}>
            <div className='todo-app'>
            <TodoList/>
            </div>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Failed to fetch operator from server!
              </Alert>
            </Snackbar>
          </Stack>
        </div>
      </section>
    </main>
  );
}

export default Settlements; 