import { Header } from "semantic-ui-react";

const NavigationBar = () => (
  <div style={{ background: "#FFD43D" }}>
    <Header
      as="h1"
      inverted
      color="black"
      textAlign="center"
      style={{ padding: "0.5em 0",
               fontFamily: "Carter One"}}
    >
      All The Sets
    </Header>
  </div>
);

export default NavigationBar;
