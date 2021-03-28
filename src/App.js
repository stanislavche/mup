import './App.css';
import * as React from "react";
import './scss-variables.scss';
import Space from './components/Space';
import Visualiser from "./components/Visualiser";
import Boy from './components/Boy';
import track1 from "./audio/promise.mp3";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            audioObject: null
        };
        this.audio = new Audio();
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }


    handleButtonClick() {
        if (!this.audio.paused) {
            this.audio.pause();
        } else {
            if (this.audio.src && this.audio.src.length) {
                this.audio.play();
            } else {
                this.initAudio();
            }
        }
        this.setState({play: true});
    }

    initAudio() {
        console.log('start');
        this.audio.src = track1;
        this.audio.crossOrigin = "anonymous";
        this.audio.load();
        this.setState({audioObject: this.audio});
        this.audio.play();
    }



    render() {
        const renderButton = () => {
            if (this.audio && !this.audio.paused) {
                return (
                    <p className="startButton" onClick={this.handleButtonClick}>PAUSE</p>
                );
            }
            return(<p className="startButton" onClick={this.handleButtonClick}>PLAY</p>);
        };

        if (this.state.play) {
            return (
                <div className="App" >
                    <Space />
                    <Visualiser startAnimation={this.state.play} audio={this.state.audioObject}/>
                    <Boy imageType='boy' startAnimation={this.state.play} />
                    {renderButton()}
                </div>
            )
        } else {
           return (
               <div className="App" >
                   <Space />
                   {renderButton()}
               </div>
           );
        }
    }
}

export default App;