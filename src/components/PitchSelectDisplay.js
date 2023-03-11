import React from "react";
import "./PitchSelectDisplay.css";

class RowItemDisplay extends React.Component {
  render() {
    return <div className="row-item-display">{this.props.content}</div>;
  }
}

class Row extends React.Component {
  render() {
    let row = new Array(12).fill(null);
    row = row.map((_, i) => {
      let content = this.props.content[i] !== null
          ? this.props.content[i]
        : "";
      return <RowItemDisplay key={i} content={content} />;
    });
    return <div className="row">{row}</div>;
  }
}
class PitchSelectDisplay extends React.Component {
  render() {
    return (
      <div className="display-container">
        <div className="pitch-select-display">
          <Row content={this.props.pitchClassRow} />
          <Row content={this.props.toneRow} />
        </div>
      </div>
    );
  }
}

export default PitchSelectDisplay;
