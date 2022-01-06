import React from "react";

class HomeNavButton extends React.Component {
  render() {
    return (
      <div className="homeNavButton">
        <button
          className="btn"
          disabled={this.props.disabled}
          onClick={() => this.props.onClick()}
        >
          {this.props.text}
        </button>
      </div>
    );
  }
}

export default HomeNavButton;
