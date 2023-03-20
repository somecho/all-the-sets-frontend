import React from "react";
import "./AnalysisDisplay.css";
import { Table, Header} from "semantic-ui-react";
import {findPrime, calculateIntervalVector, findNormalOrder, sortAscending} from "../set-operations"

function arrayToString(arr) {
  let result = "";
  arr.forEach((item) => {
    result += `${item} `;
  });
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
            <Table.Cell>
              {this.props.name}
            </Table.Cell>
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
      let prime = findPrime(normal)
      this.setState({
        ascending,
        normal,
        prime: prime.primeOrder,
        calculating: true,
        primeName: prime.name,
        zrelated: prime.zrelated
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
