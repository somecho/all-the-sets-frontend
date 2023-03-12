import React from "react";

function arrayToString(arr) {
  let result = "";
  arr.forEach((item) => {
    result += `${item} `;
  });
  return result;
}

function sortAscending(arr) {
  let result = arr.slice();
  result.sort((a, b) => a - b);
  return result;
}

class Analysis extends React.Component {
  render() {
    return (
      <div className="analysis">
        <div>Ordered: {arrayToString(this.props.pcset)}</div>
        <div>Unordered: {arrayToString(sortAscending(this.props.pcset))}</div>
      </div>
    );
  }
}

class AnalysisDisplay extends React.Component {
  render() {
    return (
      <div className="analysis-display">
        <div className="analysis-title">Analysis:</div>
        {this.props.pcset.length < 3 ? (
          <div>Select atleast 3 pitches for analysis.</div>
        ) : (
          <Analysis pcset={this.props.pcset} />
        )}
      </div>
    );
  }
}

export default AnalysisDisplay;
