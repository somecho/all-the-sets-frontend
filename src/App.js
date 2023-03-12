import "./App.css";
import React from "react";
import NavigationBar from "./components/NavigationBar";
import PitchClassInput from "./components/PitchClassInput";
import PitchSelectDisplay from "./components/PitchSelectDisplay";
import AnalysisDisplay from "./components/AnalysisDisplay";
import shared from "./shared.js"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyStates: [
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
        { on: true },
      ],
      toneRow: [],
      pitchClassRow: [],
    };
  }
  handleClick(pcId) {
    let keyStates = this.state.keyStates.slice();
    let toneRow = this.state.toneRow.slice();
    let pitchClassRow = this.state.pitchClassRow.slice();
    if (keyStates[pcId].on) {
      pitchClassRow = pitchClassRow.concat([pcId]);
      toneRow = toneRow.concat([shared.pitchNames[pcId]]);
    } else {
      pitchClassRow = pitchClassRow.filter((i) => i !== pcId);
      toneRow = toneRow.filter((i) => i !== shared.pitchNames[pcId]);
    }
    keyStates[pcId].on = !keyStates[pcId].on;
    this.setState({ keyStates, pitchClassRow, toneRow });
  }
  render() {
    return (
      <div className="App">
        <NavigationBar />
        <PitchClassInput
          onClick={(i) => this.handleClick(i)}
          keyStates={this.state.keyStates}
        />
        <PitchSelectDisplay
          toneRow={this.state.toneRow}
          pitchClassRow={this.state.pitchClassRow}
        />
      <AnalysisDisplay pcset={this.state.pitchClassRow}/>
      </div>
    );
  }
}

export default App;
