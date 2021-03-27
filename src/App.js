import './App.css';
import * as React from "react";
import './scss-variables.scss';
import Visualiser from "./components/Visualiser";
import Boy from './components/Boy';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false
        };
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }


    handleButtonClick() {
        this.setState({play: true});
    }
    render() {
        if (this.state.play) {
            return (
                <div className="App" >
                    <Visualiser startAnimation={this.state.play}/>
                    <Boy imageType='boy' startAnimation={this.state.play} />
                </div>
            )
        } else {
            return (
                <p className="startButton" onClick={this.handleButtonClick}>START</p>
            );
        }
    }
}

export default App;