import React from "react";

function mod(a, b) {
  return ((a % b) + b) % b;
}
function cycleAdd12(arr) {
  return arr.slice(1).concat(arr[0] + 12);
}

function circularPermutationsAdd12(arr) {
  let currPermut = arr.slice();
  let permutations = [currPermut];
  for (let i = 0; i < arr.length - 1; i++) {
    currPermut = cycleAdd12(currPermut);
    permutations.push(currPermut);
  }
  return permutations;
}

function getDistanceArray(arr) {
  let indices = [];
  for (let i = 1; i < arr.length; i++) {
    indices.push(((i + arr.length - 3) % (arr.length - 1)) + 1);
  }
  let distanceArray = indices.map((i) => Math.abs(arr[0] - arr[i]));
  return distanceArray;
}

function findNormalOrder(arr) {
  let permutations = circularPermutationsAdd12(arr);
  permutations = permutations.map((p) => {
    return { permutation: p, distanceArray: getDistanceArray(p) };
  });
  for (let i = 0; i < arr.length - 1; i++) {
    let distances = permutations.map((p) => p.distanceArray[i]);
    let minDist = Math.min(...distances);
    permutations = permutations.filter((p) => p.distanceArray[i] === minDist);
    if (permutations.length === 1) {
      return permutations[0].permutation.map((i) => i % 12);
    }
  }
  return permutations[0].permutation.map((i) => i % 12);
}

function arrayToCommaString(arr) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
    if (i !== arr.length - 1) {
      result += ",";
    }
  }
  return result;
}
function invertSet(pcset) {
  return pcset.map((pc) => mod(12 - pc, 12));
}
async function makePrime(normalOrder) {
  //First check the current normal order
  let primeOrder = normalOrder.map((i) => mod(i - normalOrder[0], 12));
  let res = await fetch(
    `https://all-the-sets.onrender.com/pcs/${arrayToCommaString(primeOrder)}`
  );
  let data = await res.json();
  if (data.pcs) {
    return { primeOrder: data.pcs, name: data.name };
  }
  //If it doesn't exist, invert, sort ascending and get the new normal order
  //transposed to 0
  let inversion = invertSet(primeOrder);
  let ascendingInversion = sortAscending(inversion);
  let normal = findNormalOrder(ascendingInversion);
  normal = normal.map((i) => mod(i - normal[0], 12));
  res = await fetch(
    `https://all-the-sets.onrender.com/pcs/${arrayToCommaString(normal)}`
  );
  data = await res.json();
  if (data.pcs) {
    return { primeOrder: data.pcs, name: data.name };
  }
  return { primeOrder: [], name: "No prime found" };
}

// fetch("https://all-the-sets.onrender.com/pcs/0,2,3,6,9")
//   .then((response)=>response.json())
//   .then((data)=>console.log(data))

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
        <div>Unordered: {arrayToString(this.props.ascending)}</div>
        <div>Normal Order:{arrayToString(this.props.normal)}</div>
        <div> Prime form: {this.props.prime} </div>
        <div>{this.props.name}</div>
      </div>
    );
  }
}

class AnalysisDisplay extends React.Component {
  constructor(props) {
    super(props);
    let ascending = sortAscending(this.props.pcset);
    let normal = findNormalOrder(ascending);
    this.state = {
      ascending,
      normal,
      prime: "",
    };
  }

  componentDidUpdate() {
    if (this.props.pcset.length > 2) {
      let ascending = sortAscending(this.props.pcset);
      let normal = findNormalOrder(ascending);
      makePrime(normal).then((res) => {
        this.setState({
          ascending,
          normal,
          prime: arrayToString(res.primeOrder),
          primeName: res.name,
        });
      });
    }
  }

  render() {
    return (
      <div className="analysis-display">
        <div className="analysis-title">Analysis:</div>
        {this.props.pcset.length < 3 ? (
          <div>Select atleast 3 pitches for analysis.</div>
        ) : (
          <Analysis
            pcset={this.props.pcset}
            ascending={this.state.ascending}
            normal={this.state.normal}
            prime={this.state.prime}
            name={this.state.primeName}
          />
        )}
      </div>
    );
  }
}

export default AnalysisDisplay;
