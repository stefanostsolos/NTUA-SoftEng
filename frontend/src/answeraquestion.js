import React, { useState, useEffect } from "react";
import "./App.css";
import SubmitButton from "./SubmitButton";
import jwt_decode from "jwt-decode";
/* import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import login from './login';
import Signup from './signup';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import HomeNavButton from './HomeNavButton'; */

async function submitanswer(text, questionid, token, setbutton, reset) {
  console.log("lets answer");
  console.log(questionid);
  console.log(text);
  console.log(token);
  if (text === "") return;

  setbutton(true);
  let decodedToken = jwt_decode(token);

  try {
    console.log({
      questionID: questionid,
      answerText: text,
      userID: decodedToken.userid,
    });

    let res = await fetch(`http://localhost:3004/answer`, {
      method: "post",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionID: questionid,
        answerText: text,
        userID: decodedToken.userid,
      }),
    });

    console.log(res);

    let result = await res.json();
    let status = await res.status;
    console.log(result);
    console.log(status);
    if (status === 201) {
      console.log("yaaass");
      this.props.history.push("/");
      window.location.reload(false);
    } else {
      reset();
      alert(result.msg);
    }
  } catch (e) {
    console.log(e);
    reset();
  }
}

async function getresults(questionid) {
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

  let result;
  try {
    let res = await fetch(
      `http://localhost:3003/answer/perquestion/${questionid}`,
      {
        method: "get",
        headers: {
          Authorization: "Bearer " + x.token,
          "Content-Type": "application/json",
        },
      }
    );
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

function AnswerAQuestion(props) {
  const [answers, setAnswers] = useState([]);
  const [answerText, setText] = useState("");
  const [buttonDisabled, setDisabled] = useState(false);
  const questionid = props.location.state.questionID;
  useEffect(() => {
    getresults(questionid).then((data) => setAnswers(data));
  }, []);

  console.log(answers);

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

  const question = props.location.state;

  const handletextChange = (event) => {
    setText(event.target.value);
  };

  const resetForm = () => {
    setText("");
  };
  const date = new Date(Date.parse(question.submissionDate));
  return (
    <main>
      <section className="index-banner">
        <h2>Answer a question</h2>
        <div className="question-to-answer">
          <h2>{question.title}</h2>
          <p>{question.questionText}</p>
          <table className="keywordtable">
            <tr>
              <th>Keywords:</th>
              {question.keywords &&
                question.keywords.map((keyword) => {
                  return <td>{keyword.keywordID}</td>;
                })}
            </tr>
          </table>
          <p className="date">Submitted at: {date.toLocaleDateString()}</p>
        </div>
        <ul className="answer-list">
          <li>
            <b className="answersection">Answers:</b>
          </li>
          {answers &&
            answers.map((answer) => {
              const answerdate = new Date(Date.parse(answer.submissionDate));
              return (
                <li key={answer.answerID}>
                  <div className="answer">
                    <p>{answer.answerText}</p>
                    <p className="date">
                      Submitted at: {answerdate.toLocaleDateString()}
                    </p>
                  </div>
                </li>
              );
            })}
        </ul>
        <div className="grid-container">
          <div className="item3">
            <p className="formtitle">Your Answer:</p>
          </div>
          <div className="item4">
            <textarea
              className="input-text-box"
              cols="182"
              rows="10"
              maxlength="65535"
              value={answerText}
              onChange={handletextChange}
            />
          </div>
          <div className="roulis1">
            <SubmitButton
              text="Submit"
              disabled={buttonDisabled}
              onClick={() =>
                submitanswer(
                  answerText,
                  question.questionID,
                  x.token,
                  setDisabled,
                  resetForm
                )
              }
            />
          </div>
          <div className="roulis2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AnswerAQuestion;
