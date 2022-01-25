import "./App.css";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import jwt_decode from "jwt-decode";
import Settlement from './Settlement';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Settlements({ token }) {
  const [settlements, setSettlements] = useState([]);
  const [open, setOpen] = useState(false);
  const [internalError, setInternalError] = useState(false);

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

      console.log(data)

      return data.SettlementList.filter(settlement => settlement.OperatorDebited === decodedToken.operatorID);
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

    setInternalError(false);
    setOpen(false);
  };

  const clearSettlement = async (id) => {
    let updatedSettlements = settlements.map(settlement => {
      if (settlement.SettlementID === id) {
        settlement.Cleared = !settlement.Cleared;
      }
      return settlement;
    });

    try {
      const res = await fetch(
        "http://localhost:9103/interoperability/api/ClearSettlement/",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "x-observatory-auth": token,
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ID: id})
        }
      );
      const status = await res.status;

      console.log(status)

      if(status === 200) {
        setSettlements(updatedSettlements);
      }
      else {
        setInternalError(true);
      }
      return
    }
    catch (e) {
      console.log(e)
      setOpen(true)
      return
    }
  };

  return (
    <main>
      <section className="index-banner">
        <h2>Settlements By Operator</h2>
        <div className="form-container">
          <Stack spacing={3}>
            <div className='todo-app'>
              <>
                <h1>All settlements</h1>
                <Settlement
                  settlements={settlements}
                  clearSettlement={clearSettlement}
                />
              </>
            </div>
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Failed to fetch settlements from server!
              </Alert>
            </Snackbar>
            <Snackbar open={internalError} autoHideDuration={2000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                Payment failed!
              </Alert>
            </Snackbar>
          </Stack>
        </div>
      </section>
    </main>
  );
}

export default Settlements; 