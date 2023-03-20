import Data from "./data.json"

export function arrayEquals(a,b){
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val,index)=>val===b[index])
}

export function calculateIntervalVector(pcs) {
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

export function matchIntervalVector(vector){
  // let items = vector.split('');
  // let ints = items.map(i=>parseInt(i))
  let ints = vector
  if(ints.length !== 6){
    return {"name":"An interval vector must have 6 values"}
  }
  for(let i in ints){
    if(isNaN(ints[i])){
      return {"name":"An interval vector can only contain integers"}
    }
  }
  let asArray = Object.entries(Data)
  let result = asArray.filter(([key,value])=>arrayEquals(value["intervalVector"],ints))
  let output = {
    "numResults":result.length,
    "results" : result.map(res=>{
      return {
        "name": res[0],
        "pcs" : res[1]["pcs"],
        "intervalVector": res[1]["intervalVector"]
      }
    })
  }
  return output;
}
export function matchPC(pcs){
  let ints = pcs
  //VALIDATE
  for(let i in ints) {
    if(isNaN(ints[i]) || ints[i] < 0 || ints[i] > 11){
      return {"name":"not a valid PC set"};
    }
  }
  //SORT
  ints.sort((a,b)=>a-b)
  let asArray = Object.entries(Data)
  let result = asArray.filter(([key,value])=>arrayEquals(value["pcs"],ints))
  if (result.length === 0) {
    return {"name":"Not a unique prime form, or not in prime form, or does not exist."}
  } else {
    let name = result[0][0]
    let pcs = ints
    let intervalVector = Data[result[0][0]]["intervalVector"]
    // let ivquery = intervalVector.reduce((a,b)=> a+b, "")
    // let zrelated = matchIntervalVector(ivquery)
    let zrelated = matchIntervalVector(intervalVector)
    zrelated.results = zrelated.results.filter(a=>a.name!==name)
    zrelated.numResults = zrelated.results.length
    return {name,pcs,intervalVector,zrelated}
  }
}

export const mod = (a,b)=>(((a%b)+b)%b)
export const invertSet = (set)=>{return set.map(pc=>mod(12-pc,12))}
export const sortAscending = (arr)=>arr.slice().sort((a,b)=>a-b)
export const cycleAdd12 = (arr)=>arr.slice(1).concat(arr[0]+12)

export function circularPermutationsAdd12(arr) {
  let currPermut = arr.slice();
  let permutations = [currPermut];
  for (let i = 0; i < arr.length - 1; i++) {
    currPermut = cycleAdd12(currPermut);
    permutations.push(currPermut);
  }
  return permutations;
}

export function getDistanceArray(arr) {
  let indices = [];
  for (let i = 1; i < arr.length; i++) {
    indices.push(((i + arr.length - 3) % (arr.length - 1)) + 1);
  }
  let distanceArray = indices.map((i) => Math.abs(arr[0] - arr[i]));
  return distanceArray;
}

export function findNormalOrder(arr) {
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


export function findPrime(normalOrder) {
  //First check the current normal order
  let primeOrder = normalOrder.map((i) => mod(i - normalOrder[0], 12));
  let data = matchPC(primeOrder)
  if (data.pcs) {
    return { primeOrder: data.pcs, name: data.name, zrelated: data.zrelated };
  }
  //If it doesn't exist, invert, sort ascending and get the new normal order
  //transposed to 0
  let inversion = invertSet(primeOrder);
  let ascendingInversion = sortAscending(inversion);
  let normal = findNormalOrder(ascendingInversion);
  normal = normal.map((i) => mod(i - normal[0], 12));
  data = matchPC(normal)
  if (data.pcs) {
    return { primeOrder: data.pcs, name: data.name, zrelated: data.zrelated };
  }
  return { primeOrder: [], name: "Unique prime sets are found for PC sets up to size 9",zrelated:{} };
}
