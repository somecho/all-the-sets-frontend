import "./App.css";
import React from "react";
import NavigationBar from "./components/NavigationBar";
import PitchClassInput from "./components/PitchClassInput";

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
    };
  }
  handleClick(pcId) {
    let keyStates = this.state.keyStates.slice();
    let id = pcId;
    keyStates[id].on = !keyStates[id].on;
    this.setState({ keyStates });
  }
  render() {
    return (
      <div className="App">
        <NavigationBar />
        <PitchClassInput
          onClick={(i) => this.handleClick(i)}
          keyStates={this.state.keyStates}
        />
      </div>
    );
  }
}

export default App;
