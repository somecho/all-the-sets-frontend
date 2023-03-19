import "../fonts.css";
import "./PitchSelectDisplay.css";
import React from "react";
import {
  Accidental,
  Voice,
  Formatter,
  Renderer,
  Stave,
  StaveNote,
} from "vexflow";
import { Tab } from "semantic-ui-react";

class RowItemDisplay extends React.Component {
  render() {
    return <div className="row-item-display">{this.props.content}</div>;
  }
}

class Row extends React.Component {
  render() {
    let row = new Array(12).fill(null);
    row = row.map((_, i) => {
      let content = this.props.content[i] !== null ? this.props.content[i] : "";
      return <RowItemDisplay key={i} content={content} />;
    });
    return <div className={`row ${this.props.type}`}>{row}</div>;
  }
}
class ScoreView extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.notes.length !== prevProps.notes.length) {
      this.drawScore();
    }
  }
  drawScore() {
    let score = document.querySelector("#score-view");
    if (score.hasChildNodes()) {
      score.replaceChildren();
      this.drawScore();
    } else {
      let notes = this.props.notes;
      const renderer = new Renderer(score, Renderer.Backends.SVG);
      renderer.resize(300, 80);
      const context = renderer.getContext();
      const stave = new Stave(0, -25, 300);
      stave.addClef("treble");
      stave.setContext(context).draw();

      notes = notes.map((n) => {
        let newNote = new StaveNote({ keys: [`${n}/4`], duration: "q" });
        if (n.length > 1) {
          newNote.addModifier(new Accidental("#"));
        }
        return newNote;
      });

      if (notes.length > 0) {
        const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
        voice.addTickables(notes);
        new Formatter().joinVoices([voice]).format([voice], 256);
        voice.draw(context, stave);
      }
    }
  }
  componentDidMount() {
    this.drawScore();
  }
  render() {
    return <div id="score-view"></div>;
  }
}

class PitchSelectDisplay extends React.Component {
  render() {
    let panes = [
      {
        menuItem: "Set View",
        render: () => (
          <>
            <Row type="letter-row" content={this.props.toneRow} />
            <Row type="number-row" content={this.props.pitchClassRow} />
          </>
        ),
      },
      {
        menuItem: "Score View",
        render: () => <ScoreView notes={this.props.toneRow}></ScoreView>,
      },
    ];
    return (
      <div className="display-container">
        <div className="pitch-select-display">
          <Tab menu={{ text: true }} panes={panes} />
        </div>
      </div>
    );
  }
}

export default PitchSelectDisplay;
