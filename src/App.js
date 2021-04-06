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
import track1Raw from "./audio/1 raw.mp3";
import track2Raw from "./audio/2 raw.mp3";
import track3Raw from "./audio/3 raw.mp3";
import track4Raw from "./audio/4 raw.mp3";
import track5Raw from "./audio/5 raw.mp3";
import track6Raw from "./audio/6 raw.mp3";
import track7Raw from "./audio/7 raw.mp3";
import track8Raw from "./audio/8 raw.mp3";
import track9Raw from "./audio/9 raw.mp3";
import track10Raw from "./audio/10 raw.mp3";
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

import InputRange from "react-input-range-ios-fix";


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
            post: track1,
            org: track1Raw,
            img: img1,
            title: 'SERENITY',
            className: ''
        },{
            post: track2,
            org: track2Raw,
            img: img6,
            title: 'HOLY ROCKET',
            className: ''
        },{
            post: track3,
            org: track3Raw,
            img: boy,
            title: 'PROMISE',
            className: 'boy'
        },{
            post: track4,
            org: track4Raw,
            img: img4,
            title: 'SPACE TIME',
            className: ''
        },{
            post: track5,
            org: track5Raw,
            img: img5,
            title: 'POPCORN',
            className: ''
        },{
            post: track6,
            org: track6Raw,
            img: img6,
            title: 'GOAL ACHIEVEMENT',
            className: ''
        },{
            post: track7,
            org: track7Raw,
            img: img7,
            title: 'CRYOGENIC DREAM',
            className: ''
        },{
            post: track8,
            org: track8Raw,
            img: img3,
            title: 'STARWAY',
            className: ''
        },{
            post: track9,
            org: track9Raw,
            img: boy,
            title: 'IMPETUS',
            className: 'boy'
        },{
            post: track10,
            org: track10Raw,
            img: img8,
            title: 'RAILROAD SWITCH',
            className: ''
        }];
        this.image = this.albumArray[0].img;
        this.title = this.albumArray[0].title;
        this.imgClass = this.albumArray[0].className;
        this.progressTimer = null;
        this.debounceTimer = null;
        this.audioType = 'org';
        this.currentTime = 0;
        this.settingsVisibility = false;
        this.onLoadMedia = this.onLoadMedia.bind(this);
        this.playNext = this.playNext.bind(this);
        this.setAudioType = this.setAudioType.bind(this);
        this.showSettings = this.showSettings.bind(this);
    }

    showSettings() {
        this.settingsVisibility = !this.settingsVisibility;
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

    playNext() {
        this.initAudio('next');
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
        if (type === "typeChange") {
            this.currentTime = this.audio.currentTime;
        }
        this.audio.removeEventListener("ended", this.playNext);
        this.setState({currentTrack: nextTrack});
        this.audio.src = this.albumArray[nextTrack][this.audioType];
        this.image = this.albumArray[nextTrack].img;
        this.title = this.albumArray[nextTrack].title;
        this.imgClass = this.albumArray[nextTrack].className;
        this.audio.crossOrigin = "anonymous";
        this.audio.addEventListener('loadeddata', this.onLoadMedia);
        this.setState({audioObject: this.audio});
        this.audio.load();
    }

    onLoadMedia(e, d) {
        console.log('trigger event');
        this.audio.removeEventListener("loadeddata", this.onLoadMedia);
        this.setVolume();
        this.startProgressInteraval();
        this.audio.currentTime = this.currentTime;
        this.currentTime = 0;
        this.audio.play();
        this.audio.addEventListener("ended", this.playNext);
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

    setAudioType() {
        if(this.audioType === 'org') {
            this.audioType = 'post';
        } else {
            this.audioType = 'org';
        }
        this.audio.pause();
        this.initAudio('typeChange');
    }

    render() {
        const renderButton = () => {
            if (this.audio && !this.audio.paused) {
                return (
                    <span className="startButton material-icons md-48" onClick={this.handleButtonClick}>pause_circle_filled</span>
                );
            }
            return(<span className="startButton material-icons md-48" onClick={this.handleButtonClick}>play_circle_filled</span>);
        };

        const renderAudioTypeButton = () => {
            if (this.audioType === 'org') {
                return (
                    <span className="audioSwitcher material-icons md-48">toggle_off</span>
                );
            }
            return(<span className="audioSwitcher material-icons md-48">toggle_on</span>);
        };

        const renderImage = () => {
            if (!this.settingsVisibility) {
                return (<img className={"trackImage " + this.imgClass} src={this.image} alt={"logo"} />);
            }
            return false;
        };

        const renderSettings = () => {
            if (this.settingsVisibility) {
                return (
                    <div className={"settings"}>
                        <span className={"settings__title"}>post processing</span>
                        <span className={this.audioType === 'post' ? 'switcherHeader active' : 'switcherHeader'} onClick={this.setAudioType}>
                            OFF {renderAudioTypeButton()} ON.
                        </span>
                        <span className={"settings__title"}>volume</span>
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

                    </div>
                );
            }
            return false;
        };

        const renderSettingsIcon = () => {
            if (this.settingsVisibility) {
                return (<span className={"menuIcon material-icons md-36"} onClick={this.showSettings} >close</span>);
            }
            return (<span className={"menuIcon material-icons md-36"} onClick={this.showSettings}>settings</span>);
        }

        const renderVisualizer = () => {
            return(<Visualiser startAnimation={this.state.play} audio={this.state.audioObject}/>);
        }

        if (this.state.play) {
            return (
                <div className="App" >
                    <Space />
                    {renderVisualizer()}
                    {renderImage()}
                    <CircularInput className={'progressSwitcher'} value={this.playTime ? this.playTime : 0} onChange={this.setTrackPosition} radius={166}>
                        <CircularTrack strokeWidth={4} stroke="#86c06c"/>
                        <CircularProgress strokeWidth={10} stroke="#dff8d0"/>
                    </CircularInput>
                    {renderButton()}
                    <span className={"switcher next material-icons md-48"} onClick={this.initAudio.bind(this, 'next')}>
                        arrow_forward_ios
                    </span>
                    <span className={"switcher prev material-icons md-48"} onClick={this.initAudio.bind(this, 'prev')}>
                        arrow_back_ios
                    </span>
                    {renderSettingsIcon()}
                    {renderSettings()}
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