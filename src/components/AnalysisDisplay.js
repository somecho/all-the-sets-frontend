import React from "react";
import "./AnalysisDisplay.css";
import { Table, Header } from "semantic-ui-react";

function mod(a, b) {
  return ((a % b) + b) % b;
}
function calculateIntervalVector(pcs) {
  let size = pcs.length;
  let LUT = [0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];
  let intervalVector = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      let diff = Math.abs(pcs[i] - pcs[j]) % 12;
      let id = LUT[diff];
      intervalVector[id]++;
    }
  }
  return intervalVector;
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
    return { primeOrder: data.pcs, name: data.name, zrelated: data.zrelated };
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
    return { primeOrder: data.pcs, name: data.name, zrelated: data.zrelated };
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
    let zrelated = "";
    if (this.props.zrelated.numResults) {
      for (let i = 0; i < this.props.zrelated.results.length; i++) {
        zrelated += this.props.zrelated.results[i].name;
        if (i < this.props.zrelated.results.length - 1) {
          zrelated += ", ";
        }
      }
    }
    return (
      <Table basic="very">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Ordered</Table.Cell>
            <Table.Cell>{arrayToString(this.props.pcset)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Unordered</Table.Cell>
            <Table.Cell>{arrayToString(this.props.ascending)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Normal Order</Table.Cell>
            <Table.Cell>{arrayToString(this.props.normal)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Prime Form</Table.Cell>
            <Table.Cell>
              {typeof this.props.prime === "string"
                ? this.props.prime
                : arrayToString(this.props.prime)}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Set Name</Table.Cell>
            <Table.Cell>{this.props.name}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Interval Vector</Table.Cell>
            <Table.Cell>
              {arrayToString(calculateIntervalVector(this.props.pcset)).replace(
                /\s/g,
                ""
              )}
            </Table.Cell>
          </Table.Row>
          {this.props.zrelated.numResults ? (
            <Table.Row>
              <Table.Cell>Z-Related sets</Table.Cell>
              <Table.Cell>{zrelated}</Table.Cell>
            </Table.Row>
          ) : null}
        </Table.Body>
      </Table>
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
      prime: [],
      calculating: false,
      requestQueue: [],
      zrelated: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.pcset.length > 2 &&
      this.props.pcset.length !== prevProps.pcset.length
    ) {
      let ascending = sortAscending(this.props.pcset);
      let normal = findNormalOrder(ascending);
      let requestQueue = this.state.requestQueue.slice();
      if (requestQueue.length > 3) {
        requestQueue = requestQueue.slice(-3);
      }
      requestQueue.push(makePrime(normal));

      this.setState({
        ascending,
        normal,
        prime: "Calculating...",
        calculating: true,
        requestQueue,
      });

      //using Queue ensures latest request is latest result
      Promise.all(requestQueue).then((values) => {
        let latest = values[values.length - 1];
        this.setState({
          prime: latest.primeOrder,
          primeName: latest.name,
          calculating: false,
          zrelated: latest.zrelated,
        });
      });
    }
  }

  render() {
    return (
      <div className="analysis-display">
        <Header as='h3'>ANALYSIS</Header>
        {this.props.pcset.length < 3 ? (
          <div>Select atleast 3 pitches for analysis.</div>
        ) : (
          <Analysis
            pcset={this.props.pcset}
            ascending={this.state.ascending}
            normal={this.state.normal}
            prime={this.state.prime}
            name={this.state.primeName}
            zrelated={this.state.zrelated}
          />
        )}
      </div>
    );
  }
}

export default AnalysisDisplay;
