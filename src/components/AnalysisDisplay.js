import React from "react";

function cycleAdd12(arr){
  return arr.slice(1).concat(arr[0]+12)
}

function circularPermutationsAdd12(arr){
  let currPermut = arr.slice()
  let permutations = [currPermut]
  for(let i = 0; i < arr.length-1;i++){
    currPermut = cycleAdd12(currPermut)
    permutations.push(currPermut)
  }
  return permutations
}

function getDistanceArray(arr){
  let indices = [];
  for(let i = 1; i < arr.length; i++){
    indices.push((i+arr.length-3)%(arr.length-1)+1)
  }
  let distanceArray = indices.map(i=>Math.abs(arr[0]-arr[i]))
  return distanceArray
}

function findNormalOrder(arr){
  let permutations = circularPermutationsAdd12(arr);
  permutations = permutations.map(p=>{
    return {permutation: p,
            distanceArray: getDistanceArray(p)}})
  for(let i = 0; i < arr.length-1; i++){
    let distances = permutations.map(p=>p.distanceArray[i])
    let minDist = Math.min(...distances)
    permutations = permutations.filter(p=>p.distanceArray[i]===minDist)
    if(permutations.length === 1){
      return permutations[0].permutation
    } else {
      return permutations[0].permutation
    }
  }

}

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
        <div>Normal Order:{arrayToString(findNormalOrder(this.props.pcset))}</div>
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
