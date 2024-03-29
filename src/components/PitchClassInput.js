import React from "react";
import "../fonts.css";
import "./PitchClassInput.css";
import shared from "../shared";
import {Container} from 'semantic-ui-react'

function handleSuperScript(name) {
  if (name === null) {
    return null;
  }
  if (name.length === 2) {
    return (
      <span>
        {name[0]} <sup>♯</sup>
      </span>
    );
  } else {
    return name[0];
  }
}

class PitchButton extends React.Component {
  render() {
    let isSpacer = this.props.pitchClass.spacer;
    if (isSpacer) {
      return <div className={"key-button spacer-button"} />;
    } else {
      let pcId = this.props.pitchClass.pitchClass;
      let name = shared.pitchNames[pcId];
      let state = this.props.keyStates[pcId];
      let colorClass = this.props.rowID === 0 ? "black-key" : "";
      let rowClass = this.props.rowID === 0 ? "black-row" : "";
      let clickableClass = state.on ? "" : "unclickable-key";
      let keyClass = state.on ? colorClass : clickableClass;
      let className = `key-button pitch-button ${keyClass} ${rowClass}`;
      return (
        <button
          className={className}
          type="button"
          onClick={() => {
            this.props.onClick(pcId);
          }}
        >
          {handleSuperScript(name)}
        </button>
      );
    }
  }
}

class Keyboard extends React.Component {
  render() {
    let keyboardRows = [
      [
        { pitchClass: 1 },
        { pitchClass: 3 },
        { pitchClass: 0, spacer: true },
        { pitchClass: 6 },
        { pitchClass: 8 },
        { pitchClass: 10 },
      ],
      [
        { pitchClass: 0 },
        { pitchClass: 2 },
        { pitchClass: 4 },
        { pitchClass: 5 },
        { pitchClass: 7 },
        { pitchClass: 9 },
        { pitchClass: 11 },
      ],
    ];
    return (
      <div className="keyboard">
        {keyboardRows.map((row, rowIndex) => (
          <div className="pitch-row" key={rowIndex}>
            {row.map((pc, pcIndex) => (
              <PitchButton
                onClick={(i) => this.props.onClick(i)}
                keyStates={this.props.keyStates}
                key={shared.pitchNames[pc.pitchClass]}
                pitchClass={pc}
                rowID={rowIndex}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

class PitchClassInput extends React.Component {
  render() {
    return (
      <div className="pitch-class-input">
        <Container text style={{margin: "0.5em 0", color: "#9c9c9c"}}>
          Tap the keys to select pitches:
        </Container>
        <Keyboard
          onClick={(i) => this.props.onClick(i)}
          keyStates={this.props.keyStates}
        />
      </div>
    );
  }
}

export default PitchClassInput;
