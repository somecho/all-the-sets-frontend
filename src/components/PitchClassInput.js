import React from "react";
import "./PitchClassInput.css";

function handleSuperScript(name){
  if(name === null){return null}
  if(name.length ===2){
    return ( <span>{name[0]} <sup>#</sup></span> )
  } else {
    return name[0]
  }
}

class PitchButton extends React.Component {
  render() {
    let pitchNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    let isSpacer = this.props.pitchClass.spacer;
    let name = isSpacer ? null : pitchNames[this.props.pitchClass.pitchClass];
    let spacerClass = isSpacer ? "spacer-button" : "pitch-button";
    let colorClass;
    if (isSpacer) {
      colorClass = null;
    } else {
      colorClass = this.props.rowID === 0 ? "black-key" : "white-key";
    }
    let className = `key-button ${spacerClass} ${colorClass}`;

    return <div className={className}>{handleSuperScript(name)}</div>;
    // return <div className={className}>{name}</div>;
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
              <PitchButton key={pcIndex} pitchClass={pc} rowID={rowIndex} />
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
        <Keyboard />
      </div>
    );
  }
}

export default PitchClassInput;
