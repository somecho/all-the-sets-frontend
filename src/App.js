import "./App.css";
import React from "react";
import NavigationBar from "./components/NavigationBar"
import PitchClassInput from "./components/PitchClassInput"

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <NavigationBar />
        <PitchClassInput />
      </div>
    );
  }
}

export default App;
