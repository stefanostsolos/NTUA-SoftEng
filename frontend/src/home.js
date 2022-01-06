import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from 'react-router-dom'
/* import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import login from './login';
import Signup from './signup';
import { Link } from 'react-router-dom';
import HomeNavButton from './HomeNavButton';
import { Bar } from "react-chartjs-2"; //this line is for chart */

async function getresults() {
  let result;

  try {
    //change localhost to host IP to run on another device
    let res = await fetch(`http://localhost:3002/question/perday`, {
      method: "get",
    });

    console.log(res);

    result = await res.json();
    let status = await res.status;
    console.log(result);
    console.log(status);
    if (status === 200) {
      console.log("yaaass");
      this.props.history.push("/");
      window.location.reload(false);
    } else {
      alert(result.msg);
    }
  } catch (e) {
    console.log(e);
  }

  return result;
}

/*---------- Variable Not used------
const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
}; */

function Home() {
  const [days, setDays] = useState([]);
  useEffect(() => {
    getresults().then((data) => setDays(data));
  }, []);

  /* -----------------Variable not used-------------------------------
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
  }, {}); */

  console.log(days);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const auxDate = new Date(currentDate);
  let week = [currentDate];
  for (let i = 0; i < 6; i++) {
    const day = new Date(auxDate.setDate(auxDate.getDate() - 1));
    week.push(day);
  }

  /* const labels = week.map((element) => element.toLocaleDateString());
  let chartData = [];

  if (typeof days !== "undefined" && days.length !== 0) {
    let index = 0;
    for (const day of week) {
      if (day.getTime() === Date.parse(days[index].question_submissiondate)) {
        chartData.push(parseInt(days[index].count));
        index++;
      } else {
        chartData.push(0);
      }
    }
  } else {
    chartData = [0, 0, 0, 0, 0, 0, 0];
  }
  console.log(chartData);

  const data = {
    labels: labels.reverse(),
    datasets: [
      {
        label: "Questions Statistics during last week",
        data: chartData.reverse(),
        backgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };  
  const lol = new Date("2021-06-20T21:00:00.000Z");
  console.log(lol.toLocaleDateString());
  */

  return (
    <main>
      <section className="index-banner">
        <h1><b>Select the desired page!</b></h1>
        <div className="list-container">
        <ul>
          <li>
          <Link className="navigation-button" to='/passesperstation'>Stats for Passes Per Station</Link>
          </li>

          <li>
            <Link  className="navigation-button" to='/passesanalysis'>Stats for Passes Analysis</Link>
          </li>

          <li>
            <Link className="navigation-button" to='/passescost'>Stats for Passes Cost</Link>
          </li>

          <li>
            <Link className="navigation-button" to='/charges'>Stats for Charges</Link>
          </li>
        </ul>
        </div>

        {/*  <div className="charts">
          <Bar data={data} options={options} />
        </div> */}
      </section>
    </main>
  );
}

export default Home;
