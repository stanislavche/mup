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

import Slider from '@appigram/react-rangeslider';
import Share from "./components/Share";
import Description from "./components/Description";
const cUserAgent = navigator.userAgent.toLowerCase();


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            audioObject: null,
            currentTrack: 0,
            volume: 80,
            mode: 'normal',
            bass: 20,
            treble: 20
        };
        this.volumeRef = React.createRef();
        this.bassRef = React.createRef();
        this.trebleRef = React.createRef();
        this.playTime = 0;
        this.isAudioLoading = false;
        this.audio = new Audio();
        this.audioContext = null;
        this.audioContextSync = false;
        this.gainNode = null;
        this.bassFilter = null;
        this.trebleFilter = null;

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.setTrackPosition = this.setTrackPosition.bind(this);
        this.setBass = this.setBass.bind(this);
        this.setTreble = this.setTreble.bind(this);

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
        this.resetFilters = this.resetFilters.bind(this);
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
        if (this.isAudioLoading) {
            return false;
        }
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

    setVolume(event) {
        console.log('setVolume');
        if(event) {
            const value = event.target.value;
            this.setState({'volume': +value});
            this.gainNode.gain.value = value/100;
        } else {
            this.gainNode.gain.value = this.state.volume/100;
        }
    }

    setBass(event , value) {
        console.log('setBass');
        if(event || value) {
            const val = value || event.target.value;
            this.setState({'bass': +val});
            this.bassFilter.gain.value = val - 20;
        } else {
            this.bassFilter.gain.value = this.state.bass - 20;
        }
    }

    setTreble(event , value) {
        console.log('setTreble');
        if(event || value) {
            const val = value || event.target.value;
            this.setState({'treble': +val});
            this.trebleFilter.gain.value = val - 20;
        } else {
            this.trebleFilter.gain.value = this.state.treble - 20;
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
        this.isAudioLoading = true;
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
        // Set EQ FILTERS
        if (!this.audioContextSync) {
            this.audioContextSync = true;
            this.initAudioControls();
        }

        console.log('trigger event');
        this.audio.removeEventListener("loadeddata", this.onLoadMedia);
        this.setVolume();
        this.startProgressInteraval();
        this.audio.currentTime = this.currentTime;
        this.currentTime = 0;
        this.isAudioLoading = false;
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
        this.resetFilters();
        this.initAudio('typeChange');
    }
    renderSettings() {
        if (this.state.mode === 'settings') {
            return (
                <div className={"settings subWrapper"}>

                    <span className={this.audioType === 'post' ? 'switcherHeader active' : 'switcherHeader'} onClick={this.setAudioType}>
                        ORIG GB {this.renderAudioTypeButton()} POST PR
                    </span>
                    {this.renderVolControl()}
                    <span className={"subWrapper__title"}>
                        EQ
                        {this.renderResetIcon()}

                    </span>
                    {this.renderBassControl()}
                    {this.renderTrebleControl()}
                </div>
            );
        }
        return false;
    }
    renderResetIcon() {
        if(this.state.bass !== 20 || this.state.treble !== 20) {
            return (
                <span
                    onClick={this.resetFilters}
                    className={'reset-filters active material-icons md-18 buttonIcon buttonIcon_extrasmall'}>
                    close
                </span>
            );
        }
        return false;
    }

    resetFilters() {
        this.setBass(null, 20);
        this.setTreble(null, 20);
    }
    renderShare() {
        if (this.state.mode === 'share') {
            return (
                <div className={"share subWrapper"}>
                    <Share />
                </div>
            );
        }
        return false;
    }
    renderInfo() {
        if (this.state.mode === 'info') {
            return (
                <div className={"info subWrapper"}>
                    <span className={"subWrapper__title"}>MUP</span>
                    <Description />
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
        return(
        <span
                className={"playButton inactive material-icons active md-36 buttonIcon " + (this.isAudioLoading ? 'loading' : '')}
                onClick={this.handleButtonClick}>{this.isAudioLoading ? 'autorenew' : 'play_arrow'}</span>);
    }

    renderVisualizer(flag) {
        if (!this.isIOS && !this.isAndroid && !this.isConsole && flag) {
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
        return (
            <>
                <span className={"subWrapper__title"}>volume</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={this.state.volume}
                    className="subWrapper__slider"
                    ref={this.volumeRef}
                    onChange={event => this.setVolume(event)}
                />
            </>
        )
    }

    renderBassControl() {
        return (
            <>
                <input
                    type="range"
                    min={0}
                    max={40}
                    value={this.state.bass}
                    className="subWrapper__slider"
                    ref={this.bassRef}
                    onChange={event => this.setBass(event)}
                />
            </>
        );
    }

    renderTrebleControl() {
        return (
            <>
                <input
                    type="range"
                    min={0}
                    max={40}
                    value={this.state.treble}
                    className="subWrapper__slider"
                    ref={this.trebleRef}
                    onChange={event => this.setTreble(event)}
                />
            </>
        );
    }


    renderAudioTypeButton() {
        if (this.audioType === 'org') {
            return (
                <span className="audioSwitcher material-icons md-36">toggle_off</span>
            );
        }
        return(<span className="audioSwitcher material-icons md-36">toggle_on</span>);
    }

    renderSpace(flag) {
        if (flag) {
            return (<Space />);
        }
    }

    initAudioControls() {
        console.log('initAudio controls');
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = this.audioContext.createMediaElementSource(this.audio);

        this.gainNode = this.audioContext.createGain();
        this.bassFilter = this.audioContext.createBiquadFilter();
        this.bassFilter.type = "lowshelf";
        this.bassFilter.frequency.value = 200;
        this.trebleFilter = this.audioContext.createBiquadFilter();
        this.trebleFilter.type = "highshelf";
        this.trebleFilter.frequency.value = 2000;
        source.connect(this.bassFilter);
        this.bassFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.value = 1;
        // this.trebleFilter.gain.value = 0;
        // this.bassFilter.gain.value = 1541;
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
                    {this.renderVisualizer(false)}
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
                    {this.renderShare()}
                    {this.renderInfo()}
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
                {this.renderSpace(true)}
                {this.renderScene()}
            </div>
        )
    }
}

export default App;