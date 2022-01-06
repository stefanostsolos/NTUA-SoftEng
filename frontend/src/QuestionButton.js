import React from "react";
import "./App.css";
import { BrowserRouter as Link } from "react-router-dom";

function QuestionButton({ questionitem }) {
  return (
    <Link
      to={{
        pathname: "/answeraquestion",
        state: questionitem, // your data array of objects
      }}
    >
      <div className="question">
        <p>{questionitem.title}</p>
        <table className="keywordtable">
          <tr>
            <th>Keywords:</th>
            {questionitem.keywords &&
              questionitem.keywords.map((keyword) => {
                return <td>{keyword.keywordID}</td>;
              })}
          </tr>
        </table>
      </div>
    </Link>
  );
}

export default QuestionButton;
