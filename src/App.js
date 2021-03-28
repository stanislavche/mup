import './App.css';
import * as React from "react";
import './scss-variables.scss';
import Space from './components/Space';
import Visualiser from "./components/Visualiser";
import Boy from './components/Boy';
import track1 from "./audio/1.mp3";
import track2 from "./audio/2.mp3";
import track3 from "./audio/3.mp3";
import track4 from "./audio/4.mp3";
import track5 from "./audio/5.mp3";
import track6 from "./audio/6.mp3";
import track7 from "./audio/7.mp3";
import track8 from "./audio/8.mp3";
import track9 from "./audio/9.mp3";
import track10 from "./audio/10.mp3";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            audioObject: null,
            currentTrack: 0
        };
        this.audio = new Audio();
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.albumArray = [track1,track2,track3,track4,track5,track6,track7,track8,track9,track10];
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

    initAudio(type) {
        const curTrack = this.state.currentTrack;
        let nextTrack = this.state.currentTrack;
        if(type && type === 'next') {
            if(curTrack < 9) {
                ++nextTrack;
            } else {
                nextTrack = 0;
            }
        }
        if(type && type === 'prev') {
            if(curTrack <= 0) {
                nextTrack = 9;
            } else {
                --nextTrack;
            }
        }

        this.setState({currentTrack: nextTrack});
        this.audio.src = this.albumArray[nextTrack];
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
                    <button className={"switcher"} onClick={this.initAudio.bind(this, 'next')}>next</button>
                    <button className={"switcher"} onClick={this.initAudio.bind(this, 'prev')}>prev</button>
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