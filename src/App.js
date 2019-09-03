import React, {Component} from 'react';
import Component1 from "./functional/component1";
import Container1 from "./containers/container1";

class App extends Component {

    render() {
        return (
            <div className="App">
                <Component1></Component1>
                <Container1></Container1>
            </div>
        );
    }
}

export default App;
