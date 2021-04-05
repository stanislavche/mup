import './App.css';
import * as React from "react";
import './scss-variables.scss';
import Space from './components/Space';
import Visualiser from "./components/Visualiser";
import Boy from './components/Boy';
import {
    CircularInput,
    CircularTrack,
    CircularProgress
} from 'react-circular-input'

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
import img1 from "./image/serenity.gif";
import img2 from "./image/rocket.gif";
import img3 from "./image/promise.gif";
import img4 from "./image/spacetime.gif";
import img5 from "./image/popcorn.gif";
import img6 from "./image/siting.gif";
import img7 from "./image/dream.gif";
import img8 from "./image/rail.gif";
import img9 from "./image/mup-transparent.gif";
import boy from './image/boy.svg';

import InputRange from "react-input-range";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            audioObject: null,
            currentTrack: 0,
            volume: 70
        };
        this.playTime = 0;
        this.audio = new Audio();
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.setTrackPosition = this.setTrackPosition.bind(this);

        this.albumArray = [{
            audio: track1,
            img: img1,
            title: 'SERENITY',
            className: ''
        },{
            audio: track2,
            img: img6,
            title: 'HOLY ROCKET',
            className: ''
        },{
            audio: track3,
            img: boy,
            title: 'PROMISE',
            className: 'boy'
        },{
            audio: track4,
            img: img4,
            title: 'SPACE TIME',
            className: ''
        },{
            audio: track5,
            img: img5,
            title: 'POPCORN',
            className: ''
        },{
            audio: track6,
            img: img6,
            title: 'GOAL ACHIEVEMENT',
            className: ''
        },{
            audio: track7,
            img: img7,
            title: 'CRYOGENIC DREAM',
            className: ''
        },{
            audio: track8,
            img: img3,
            title: 'STARWAY',
            className: ''
        },{
            audio: track9,
            img: boy,
            title: 'IMPETUS',
            className: 'boy'
        },{
            audio: track10,
            img: img8,
            title: 'RAILROAD SWITCH',
            className: ''
        }];
        this.image = this.albumArray[0].img;
        this.title = this.albumArray[0].title;
        this.imgClass = this.albumArray[0].className;
        this.progressTimer = null;
        this.debounceTimer = null;
    }


    handleButtonClick() {
        if (!this.audio.paused) {
            this.audio.pause();
            this.clearProgressInterval();
        } else {
            if (this.audio.src && this.audio.src.length) {
                this.startProgressInteraval();
                this.audio.play();
            } else {
                this.initAudio();
            }
        }
        this.setState({play: true});
    }

    setVolume(volume) {
        if(volume) {
            this.setState({volume: volume});
            this.audio.volume = volume/100;
        } else {
            this.audio.volume = this.state.volume/100;
        }
    }

    setProgressTime() {
        this.playTime = +((100 / (this.audio.duration / this.audio.currentTime))/100).toFixed(3);
        this.setState({playTime: this.playTime});
    }

    startProgressInteraval() {
        this.clearProgressInterval();
        this.progressTimer = setInterval(() => {
            this.setProgressTime();
        }, 500);
    }

    clearProgressInterval() {
        if(this.progressTimer) {
            clearInterval(this.progressTimer);
        }
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
        this.audio.removeEventListener("ended", this.initAudio.bind(this, 'next'));
        this.setState({currentTrack: nextTrack});
        this.audio.src = this.albumArray[nextTrack].audio;
        this.image = this.albumArray[nextTrack].img;
        this.title = this.albumArray[nextTrack].title;
        this.imgClass = this.albumArray[nextTrack].className;
        this.audio.crossOrigin = "anonymous";
        this.audio.load();
        this.setState({audioObject: this.audio});
        this.setVolume();
        this.startProgressInteraval();
        this.audio.play();
        this.audio.addEventListener("ended", this.initAudio.bind(this, 'next'));
    }

    setTrackPosition(value) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.setProgressTime();
            let time = 0;
            if (typeof(value) === 'number') {
                time = this.audio.duration * value;
            } else {
                time = this.audio.duration * (value.slice(4, 9));
            }
            this.audio.currentTime = time;
        }, 200);
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

        const volumeEl = () => {
            return(
                <>
                    <CircularInput className={'volumeSwitcher'} value={this.state.volume/100} onChange={this.setVolume} radius={150}>
                        <CircularTrack strokeWidth={4} stroke="#86c06c"/>
                        <CircularProgress strokeWidth={10} stroke="#dff8d0"/>
                    </CircularInput>
                    <Boy imageType='boy' startAnimation={this.state.play} />
               </>
            )};

        if (this.state.play) {
            return (
                <div className="App" >
                    <Space />
                    <Visualiser startAnimation={this.state.play} audio={this.state.audioObject}/>
                    <img className={"trackImage " + this.imgClass} src={this.image} alt={"logo"} />
                    <CircularInput className={'progressSwitcher'} value={this.playTime} onChange={this.setTrackPosition} radius={166}>
                        <CircularTrack strokeWidth={4} stroke="#86c06c"/>
                        <CircularProgress strokeWidth={10} stroke="#dff8d0"/>
                    </CircularInput>
                    <InputRange
                        classNames={{
                            activeTrack: 'input-range__track input-range__track--active',
                            inputRange: 'input-range volumeSwitcher',
                            slider: 'input-range__slider',
                            sliderContainer: 'input-range__slider-container',
                            track: 'input-range__track input-range__track--background'
                        }}
                        maxValue={100}
                        minValue={0}
                        value={this.state.volume}
                        onChange={this.setVolume} />
                    {renderButton()}
                    <span className={"switcher next material-icons md-48"} onClick={this.initAudio.bind(this, 'next')}>
                        arrow_forward_ios
                    </span>
                    <span className={"switcher prev material-icons md-48"} onClick={this.initAudio.bind(this, 'prev')}>
                        arrow_back_ios
                    </span>

                </div>
            )
        } else {
           return (
               <div className="App" >
                   <Space />
                   <img className={"mainLogo"} src={img9} alt={"logo"} />
                   {renderButton()}
                   <span className={"material-icons hidden-text"}>arrow_forward_ios</span>
               </div>
           );
        }
    }
}

export default App;