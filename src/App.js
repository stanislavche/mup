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
import boy from './image/boy.gif';

import InputRange from "react-input-range-ios-fix";
import Slider from '@appigram/react-rangeslider'
const cUserAgent = navigator.userAgent.toLowerCase();


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            audioObject: null,
            currentTrack: 0,
            volume: 100,
            mode: 'normal',
            bass: 100
        };
        this.titleRef = React.createRef();
        this.playTime = 0;
        this.audio = new Audio();
        // this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // this.audioContextSync = false;
        // this.gainNode = this.audioContext.createGain();
        // this.bassFilter = this.audioContext.createBiquadFilter();


        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.setTrackPosition = this.setTrackPosition.bind(this);
        this.setBass = this.setBass.bind(this);

        this.albumArray = [{
            post: track1,
            org: track1Raw,
            img: img1,
            title: 'S_TN * SERENITY **************'
        },{
            post: track2,
            org: track2Raw,
            img: img6,
            title: 'S_TN * HOLY ROCKET ***********'
        },{
            post: track3,
            org: track3Raw,
            img: boy,
            title: 'S_TN * PROMISE ***************'
        },{
            post: track4,
            org: track4Raw,
            img: img4,
            title: 'S_TN * SPACE TIME ***********'
        },{
            post: track5,
            org: track5Raw,
            img: img5,
            title: 'S_TN * POPCORN **************'
        },{
            post: track6,
            org: track6Raw,
            img: img6,
            title: 'S_TN * GOAL ACHIEVEMENT *****'
        },{
            post: track7,
            org: track7Raw,
            img: img7,
            title: 'S_TN * CRYOGENIC DREAM ******'
        },{
            post: track8,
            org: track8Raw,
            img: img3,
            title: 'S_TN * STARWAY **************'
        },{
            post: track9,
            org: track9Raw,
            img: boy,
            title: 'S_TN & BALLONBEAR * IMPETUS *'
        },{
            post: track10,
            org: track10Raw,
            img: img8,
            title: 'S_TN * RAILROAD SWITCH ******'
        }];
        this.image = this.albumArray[0].img;
        this.title = this.albumArray[0].title;
        this.progressTimer = null;
        this.debounceTimer = null;
        this.audioType = 'org';
        this.currentTime = 0;
        this.isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
            !window.MSStream;
        this.isAndroid = cUserAgent.indexOf("android") > -1;
        this.isConsole = cUserAgent.indexOf("xbox") > -1 || cUserAgent.indexOf("playStation") > -1 || cUserAgent.indexOf("nintendo") > -1 || cUserAgent.indexOf("crkey") > -1;
        this.onLoadMedia = this.onLoadMedia.bind(this);
        this.playNext = this.playNext.bind(this);
        this.setAudioType = this.setAudioType.bind(this);
        this.showSettings = this.showSettings.bind(this);
        this.showShare = this.showShare.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    showSettings() {
        if (this.state.mode === 'settings') {
            this.setState({mode: 'normal'})
        } else {
            this.setState({mode: 'settings'})
        }
    }

    showShare() {
        if (this.state.mode === 'share') {
            this.setState({mode: 'normal'})
        } else {
            this.setState({mode: 'share'})
        }
    }

    showInfo() {
        if (this.state.mode === 'info') {
            this.setState({mode: 'normal'})
        } else {
            this.setState({mode: 'info'})
        }
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

    setBass(bassVol) {
        if(bassVol) {
            this.setState({bass: bassVol});
        } else {
            console.log(bassVol);
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
        this.audio.crossOrigin = "anonymous";
        this.audio.addEventListener('loadeddata', this.onLoadMedia);
        this.setState({audioObject: this.audio});
        this.audio.load();
    }

    onLoadMedia() {
        if (!this.audioContextSync) {
            this.audioContextSync = true;

        }

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
    renderSettings() {
        if (this.state.mode === 'settings') {
            return (
                <div className={"settings"}>
                    {this.renderVolControl()}
                    <span className={"settings__title"}>bass</span>
                    <Slider
                        max={100}
                        min={0}
                        tooltip={false}
                        value={this.state.bass}
                        orientation="horizontal"
                        onChange={this.setBass} />
                    <span className={"settings__title"}>mastering</span>
                    <span className={this.audioType === 'post' ? 'switcherHeader active' : 'switcherHeader'} onClick={this.setAudioType}>
                            OFF {this.renderAudioTypeButton()} ON.
                        </span>

                </div>
            );
        }
        return false;
    }

    renderSettingsIcon() {
        return (
            <>
                <span className={"ccIcon material-icons md-24 buttonIcon buttonIcon_small " + (this.state.mode === 'info' ? 'active' : '')} onClick={this.showInfo} >{(this.state.mode === 'info' ? 'close': 'info')}</span>
                <span className={"settingsIcon material-icons md-24 buttonIcon buttonIcon_small " + (this.state.mode === 'settings' ? 'active' : '')} onClick={this.showSettings} >{(this.state.mode === 'settings' ? 'close': 'settings')}</span>
                <span className={"shareIcon material-icons md-24 buttonIcon buttonIcon_small " + (this.state.mode === 'share' ? 'active' : '')} onClick={this.showShare} >{(this.state.mode === 'share' ? 'close': 'share')}</span>
            </>
        );
    }

    renderButton() {
        if (this.audio && !this.audio.paused) {
            return (
                <span className={"pauseButton material-icons md-36 buttonIcon"} onClick={this.handleButtonClick}>pause</span>
            );
        }
        return(<span className={"playButton inactive material-icons active md-36 buttonIcon"} onClick={this.handleButtonClick}>play_arrow</span>);
    }

    renderVisualizer() {
        if (!this.isIOS && !this.isAndroid && !this.isConsole && false) {
            return(<Visualiser startAnimation={this.state.play} audio={this.state.audioObject}/>);
        }
    }

    renderImage() {
        if (this.state.mode === 'normal') {
            return (<img className={"trackImage"} src={this.image} alt={"logo"} />);
        }
        return false;
    }

    renderVolControl() {
        if (!this.isIOS) {
            return (
                <>
                    <span className={"settings__title"}>volume</span>
                    <Slider
                        max={100}
                        min={0}
                        tooltip={false}
                        value={this.state.volume}
                        orientation="horizontal"
                        onChange={this.setVolume} />
                </>
            )
        }
        return false;
    }

    renderAudioTypeButton() {
        if (this.audioType === 'org') {
            return (
                <span className="audioSwitcher material-icons md-48">toggle_off</span>
            );
        }
        return(<span className="audioSwitcher material-icons md-48">toggle_on</span>);
    }

    renderSpace(flag) {
        if (flag) {
            return (<Space />);
        }
    }

    initAudioApi() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var gainNode = audioContext.createGain();
        gainNode.gain.value = 0.5;
    }

    setTitle() {
        const text = this.albumArray[this.state.currentTrack].title;
        const characters = [];
        for (let i = 0; i < text.length; i++) {
            characters.push(<span key={'char-' + i} className={'char char-' + i}>{text[i]}</span>);
        }
        return characters;
    }

    renderScene() {
        if (this.state.play) {
            return (
                <div className={'playerWrapper'}>
                    {this.renderVisualizer()}
                    <div className={"imageWrapper"}>
                        {this.renderImage()}
                        <div className={"trackTitle"}>{this.setTitle()}</div>
                    </div>
                    <CircularInput className={'progressSwitcher'} value={this.playTime ? this.playTime : 0} onChange={this.setTrackPosition} radius={166}>
                        <CircularTrack strokeWidth={4} stroke="#86c06c"/>
                        <CircularProgress strokeWidth={10} stroke="#dff8d0"/>
                    </CircularInput>
                    <section className={'playerMenu'}>
                        <span className={"switcher next material-icons md-36 buttonIcon"} onClick={this.initAudio.bind(this, 'next')}>
                            arrow_forward_ios
                        </span>
                            <span className={"switcher prev material-icons md-36 buttonIcon"} onClick={this.initAudio.bind(this, 'prev')}>
                            arrow_back_ios
                        </span>
                        {this.renderButton()}
                    </section>
                    <section className={'subMenu'}>
                        {this.renderSettingsIcon()}
                    </section>
                    {this.renderSettings()}
                </div>
            )
        } else {
            return (
                <>
                    <img className={"mainLogo"} src={img9} alt={"logo"} />
                    <span className="startButton inactive material-icons" onClick={this.handleButtonClick}>play_arrow</span>
                    <span className={"material-icons hidden-text"}>arrow_forward_ios</span>
                </>
            );
        }
    }

    render() {
        return(
            <div className="App" >
                {this.renderSpace(false)}
                {this.renderScene()}
            </div>
        )
    }
}

export default App;