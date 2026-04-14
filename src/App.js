import './App.css';
import * as React from "react";
import './scss-variables.scss';
import Space from './components/Space';
import Visualiser from "./components/Visualiser";
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
            volume: 50,
            mode: 'normal',
            bass: 20,
            treble: 20,
            showSpace: true,
            showSpectr: true,
            track2Unlocked: false,
            showKonamiPanel: false,
            konamiFlash: null,   // null | 'unlocked' | 'locked'
            pilotMode: false,
            // arrow-key state for ship tilt + star/spectrum direction
            keys: { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false },
        };

        // ─── Konami code: ↑ ↑ ↓ ↓ ← → ← → Enter ────────────────────────
        this.KONAMI     = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                           'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','Enter'];
        this.konamiBuf  = [];
        this.konamiHandler = this.konamiHandler.bind(this);
        this.queryParams = window.location.search.substring(1).split('&')
            .map(p => p.split('='))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        this.volumeRef = React.createRef();
        this.bassRef = React.createRef();
        this.trebleRef = React.createRef();
        this.playerRef = React.createRef();   // smooth tilt target
        // smooth tilt lerp state (bypasses React render cycle)
        this._sx = 0;  // current smooth tilt X  (-1 … +1)
        this._sy = 0;  // current smooth tilt Y
        this._tiltRafId = null;
        this._tiltTick = this._tiltTick.bind(this);
        this.playTime = 0;
        this.isAudioLoading = false;
        this.audio = new Audio();
        this.audioContext = null;
        this.audioContextSync = false;
        this.gainNode = null;
        this.bassFilter = null;
        this.trebleFilter = null;
        this.audioSource = null;

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.setTrackPosition = this.setTrackPosition.bind(this);
        this.setBass = this.setBass.bind(this);
        this.setTreble = this.setTreble.bind(this);
        this.handleArrowDown = this.handleArrowDown.bind(this);
        this.handleArrowUp   = this.handleArrowUp.bind(this);

        this.albumArray = [{
            post: track1,
            org: track1Raw,
            img: img1,
            title: 'S_TN * SERENITY **************'
        },{
            post: track2,
            org: track2Raw,
            img: img2,
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

    // ─── Smooth tilt via rAF lerp (like Space.js star offset) ───────────────
    _tiltTick() {
        this._tiltRafId = requestAnimationFrame(this._tiltTick);
        const { keys, pilotMode, mode } = this.state;
        const shouldTilt = pilotMode || mode === 'normal';
        const tx = shouldTilt ? ((keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0)) : 0;
        const ty = shouldTilt ? ((keys.ArrowDown  ? 1 : 0) - (keys.ArrowUp   ? 1 : 0)) : 0;
        // lerp speed: 0.04 ≈ smooth ~70 frame ramp, same feel as star offset
        this._sx += (tx - this._sx) * 0.04;
        this._sy += (ty - this._sy) * 0.04;
        const el = this.playerRef.current;
        if (el) {
            el.style.transform =
                `translate(-50%, -50%) perspective(700px) rotate(${this._sx * 22}deg) rotateX(${this._sy * 15}deg)`;
        }
    }

    // ─── Arrow-key / WASD ship direction tracking ────────────────────────────
    handleArrowDown(e) {
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        const WASD_MAP = { w: 'ArrowUp', s: 'ArrowDown', a: 'ArrowLeft', d: 'ArrowRight',
                           'ц': 'ArrowUp', 'ы': 'ArrowDown', 'ф': 'ArrowLeft', 'в': 'ArrowRight' };
        const key = WASD_MAP[e.key] || e.key;
        const DIRS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (DIRS.includes(key) && !this.state.keys[key]) {
            this.setState(s => ({ keys: { ...s.keys, [key]: true } }));
        }
    }

    handleArrowUp(e) {
        const WASD_MAP = { w: 'ArrowUp', s: 'ArrowDown', a: 'ArrowLeft', d: 'ArrowRight',
                           'ц': 'ArrowUp', 'ы': 'ArrowDown', 'ф': 'ArrowLeft', 'в': 'ArrowRight' };
        const key = WASD_MAP[e.key] || e.key;
        const DIRS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (DIRS.includes(key) && this.state.keys[key]) {
            this.setState(s => ({ keys: { ...s.keys, [key]: false } }));
        }
    }

    // ─── Konami-code handler ──────────────────────────────────────────────
    konamiHandler(e) {
        this.konamiBuf.push(e.key);
        if (this.konamiBuf.length > this.KONAMI.length) this.konamiBuf.shift();
        if (this.konamiBuf.join(',') === this.KONAMI.join(',')) {
            this.konamiBuf = [];
            this.setState({ showKonamiPanel: true });
        }
    }

    // Called from inside the panel — does the actual lock/unlock
    confirmKonami() {
        const nowUnlocked = !this.state.track2Unlocked;
        const nextTrack = (!nowUnlocked && this.state.currentTrack === 1)
            ? 0 : this.state.currentTrack;
        this.setState({
            track2Unlocked: nowUnlocked,
            currentTrack: nextTrack,
            showKonamiPanel: false,
            konamiFlash: nowUnlocked ? 'unlocked' : 'locked',
        });
        clearTimeout(this._konamiTimer);
        this._konamiTimer = setTimeout(() => this.setState({ konamiFlash: null }), 2600);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.konamiHandler);
        window.addEventListener('keydown', this.handleArrowDown);
        window.addEventListener('keyup',   this.handleArrowUp);
        this._tiltRafId = requestAnimationFrame(this._tiltTick);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.konamiHandler);
        window.removeEventListener('keydown', this.handleArrowDown);
        window.removeEventListener('keyup',   this.handleArrowUp);
        if (this._tiltRafId) cancelAnimationFrame(this._tiltRafId);
        clearTimeout(this._konamiTimer);
    }

    showSettings() {
        if (this.state.mode === 'settings') {
            this.setState({ mode: 'normal' });
        } else {
            this.setState({ mode: 'settings', pilotMode: false });
        }
    }

    showShare() {
        if (this.state.mode === 'share') {
            this.setState({ mode: 'normal' });
        } else {
            this.setState({ mode: 'share', pilotMode: false });
        }
    }

    showInfo() {
        if (this.state.mode === 'info') {
            this.setState({ mode: 'normal' });
        } else {
            this.setState({ mode: 'info', pilotMode: false });
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
        if(event) {
            const value = event.target.value;
            this.setState({'volume': +value});
            this.gainNode.gain.value = value/100;
        } else {
            this.gainNode.gain.value = this.state.volume/100;
        }
    }

    setBass(event , value) {
        if(event || value) {
            const val = value || event.target.value;
            this.setState({'bass': +val});
            this.bassFilter.gain.value = val - 20;
        } else {
            this.bassFilter.gain.value = this.state.bass - 20;
        }
    }

    setTreble(event , value) {
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
            // skip hidden track 2 (index 1) unless unlocked
            if (!this.state.track2Unlocked && nextTrack === 1) nextTrack = 2;
        }
        if(type && type === 'prev') {
            if(curTrack <= 0) {
                nextTrack = 9;
            } else {
                --nextTrack;
            }
            // skip hidden track 2 (index 1) unless unlocked
            if (!this.state.track2Unlocked && nextTrack === 1) nextTrack = 0;
        }
        if (type === "typeChange") {
            this.currentTime = this.audio.currentTime;
        }
        // Set EQ FILTERS
        if (!this.audioContextSync) {
            this.audioContextSync = true;
            this.initAudioControls();
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

    renderVisualSwitcher() {
        if (this.isAndroid || this.isIOS || this.isConsole || this.queryParams.animation === 'hide') {
            return false;
        }
        return (
            <div className="vis-toggles">
                <label className="vis-label">
                    <input
                        type="checkbox"
                        className="vis-check"
                        checked={this.state.showSpace}
                        onChange={() => this.setState(s => ({ showSpace: !s.showSpace }))}
                    />
                    <span>SPACE</span>
                </label>
                <label className="vis-label">
                    <input
                        type="checkbox"
                        className="vis-check"
                        checked={this.state.showSpectr}
                        onChange={() => this.setState(s => ({ showSpectr: !s.showSpectr }))}
                    />
                    <span>SPECTR</span>
                </label>
            </div>
        );
    }

    renderSettings() {
        if (this.state.mode === 'settings') {
            return (
                <div className={"settings subWrapper"}>
                    <span className={"subWrapper__title"}>SOUND</span>
                    <span className={this.audioType === 'post' ? 'switcherHeader active' : 'switcherHeader'} onClick={this.setAudioType}>
                        ORIG {this.renderAudioTypeButton()} POST
                    </span>
                    {this.renderVolControl()}
                    <span className={"subWrapper__title"}>
                        EQ
                        {this.renderResetIcon()}
                    </span>
                    {this.renderTrebleControl()}
                    {this.renderBassControl()}
                    {this.renderVisualSwitcher()}
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
                    className={'reset-filters active material-icons notranslate  md-18 buttonIcon buttonIcon_extrasmall'}>
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
        const { pilotMode, mode } = this.state;
        return (
            <>
                <span
                    className={"pilotIcon material-icons notranslate md-24 buttonIcon buttonIcon_small" + (pilotMode ? ' active' : '')}
                    onClick={() => this.setState(s => ({
                        pilotMode: !s.pilotMode,
                        ...(s.pilotMode ? {} : { mode: 'normal', showSpectr: true }),
                    }))}
                    title="Pilot mode"
                >
                    {pilotMode ? 'close' : (
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <rect x="3" y="13" width="18" height="8" rx="2"/>
                            <rect x="10.5" y="5" width="3" height="9" rx="1.5"/>
                            <circle cx="12" cy="4.5" r="2.5"/>
                            <circle cx="7.5" cy="17" r="2" fill="#e04040"/>
                        </svg>
                    )}
                </span>
                <span className={"ccIcon material-icons notranslate md-24 buttonIcon buttonIcon_small " + (mode === 'info' ? 'active' : '')} onClick={this.showInfo}>{mode === 'info' ? 'close' : 'info'}</span>
                <span className={"settingsIcon material-icons notranslate md-24 buttonIcon buttonIcon_small " + (mode === 'settings' ? 'active' : '')} onClick={this.showSettings}>{mode === 'settings' ? 'close' : 'settings'}</span>
                <span className={"shareIcon material-icons notranslate md-24 buttonIcon buttonIcon_small " + (mode === 'share' ? 'active' : '')} onClick={this.showShare}>{mode === 'share' ? 'close' : 'share'}</span>
            </>
        );
    }

    renderButton() {
        if (this.audio && !this.audio.paused) {
            return (
                <span className={"pauseButton material-icons notranslate  md-36 buttonIcon"} onClick={this.handleButtonClick}>pause</span>
            );
        }
        return(
            <span className={"playButton buttonIcon"} onClick={this.handleButtonClick}>
                <span className={"material-icons notranslate  active md-36 " + (this.isAudioLoading ? 'loading' : '')}>
                    {this.isAudioLoading ? 'autorenew' : 'play_arrow'}
                </span>
            </span>
        );
    }

    renderVisualizer() {
        if (!this.isIOS && !this.isAndroid && !this.isConsole && this.state.showSpectr) {
            return(<Visualiser startAnimation={this.state.play} analyser={this.analyser} keys={this.state.keys} />);
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
            <div className={'subWrapper__f-container'}>
                <span className={'subWrapper__f-title'}>vol</span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={this.state.volume}
                    className="subWrapper__slider"
                    ref={this.volumeRef}
                    onChange={event => this.setVolume(event)}
                />
            </div>
        )
    }

    renderBassControl() {
        return (
            <div className={'subWrapper__f-container'}>
                <span className={'subWrapper__f-title'}>low</span>
                <input
                    type="range"
                    min={0}
                    max={40}
                    value={this.state.bass}
                    className="subWrapper__slider"
                    ref={this.bassRef}
                    onChange={event => this.setBass(event)}
                />
            </div>
        );
    }

    renderTrebleControl() {
        return (
            <div className={'subWrapper__f-container'}>
                <span className={'subWrapper__f-title'}>hi</span>
                <input
                    type="range"
                    min={0}
                    max={40}
                    value={this.state.treble}
                    className="subWrapper__slider"
                    ref={this.trebleRef}
                    onChange={event => this.setTreble(event)}
                />
            </div>
        );
    }


    renderAudioTypeButton() {
        if (this.audioType === 'org') {
            return (
                <span className="audioSwitcher material-icons notranslate  md-36">toggle_off</span>
            );
        }
        return(<span className="audioSwitcher material-icons notranslate  md-36">toggle_on</span>);
    }

    renderSpace() {
        if (this.state.showSpace && this.queryParams.animation !== 'hide') {
            return (<Space keys={this.state.keys} />);
        }
    }

    initAudioControls() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = this.audioContext.createMediaElementSource(this.audio);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.gainNode = this.audioContext.createGain();
        this.bassFilter = this.audioContext.createBiquadFilter();
        this.bassFilter.type = "lowshelf";
        this.bassFilter.frequency.value = 200;
        this.trebleFilter = this.audioContext.createBiquadFilter();
        this.trebleFilter.type = "highshelf";
        this.trebleFilter.frequency.value = 2000;
        this.audioSource.connect(this.bassFilter);
        this.bassFilter.connect(this.trebleFilter);
        this.trebleFilter.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
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
            const { mode, pilotMode } = this.state;

            return (
                <>
                    {this.renderVisualizer(true)}
                    <div className={'playerWrapper'} ref={this.playerRef}>

                        {/* In pilot mode show boy.gif, otherwise current track image */}
                        <div className={"imageWrapper"}>
                            {pilotMode
                                ? <img className={"trackImage"} src={boy} alt={"pilot"} />
                                : this.renderImage()
                            }
                            <div className={"trackTitle"}>{this.setTitle()}</div>
                        </div>

                        <CircularInput className={'progressSwitcher'} value={this.playTime ? this.playTime : 0} onChange={this.setTrackPosition} radius={166}>
                            <CircularTrack strokeWidth={4} stroke="#86c06c"/>
                            <CircularProgress strokeWidth={10} stroke="#dff8d0"/>
                        </CircularInput>

                        {/* playerMenu: prev/play/next hidden in pilot mode */}
                        <section className={'playerMenu'}>
                            {!pilotMode && (
                                <>
                                    <span className={"switcher next material-icons notranslate  md-36 buttonIcon"} onClick={this.initAudio.bind(this, 'next')}>
                                        arrow_forward_ios
                                    </span>
                                    <span className={"switcher prev material-icons notranslate  md-36 buttonIcon"} onClick={this.initAudio.bind(this, 'prev')}>
                                        arrow_back_ios
                                    </span>
                                    {this.renderButton()}
                                </>
                            )}
                        </section>

                        <section className={'subMenu'}>
                            {this.renderSettingsIcon()}
                        </section>
                        {this.renderSettings()}
                        {this.renderShare()}
                        {this.renderInfo()}
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <img className={"mainLogo"} src={img9} alt={"logo"} />
                    <span className="startButton inactive material-icons notranslate " onClick={this.handleButtonClick}>&#xE037;</span>
                </>
            );
        }
    }

    renderKonamiPanel() {
        if (!this.state.showKonamiPanel) return null;
        const locked = !this.state.track2Unlocked;
        return (
            <div className="konami-panel" onClick={e => e.stopPropagation()}>
                <div className="konami-panel__header">
                    <span className="konami-panel__label">◆ C L A S S I F I E D ◆</span>
                    <span
                        className="konami-panel__close material-icons notranslate md-18"
                        onClick={() => this.setState({ showKonamiPanel: false })}
                    >close</span>
                </div>

                <div className="konami-panel__track">
                    S_TN * HOLY ROCKET
                </div>

                <div className="konami-panel__status">
                    <span className={`konami-panel__dot ${locked ? 'konami-panel__dot--locked' : 'konami-panel__dot--unlocked'}`} />
                    {locked ? 'TRACK HIDDEN' : 'TRACK VISIBLE'}
                </div>

                <button
                    className={`konami-panel__btn ${locked ? 'konami-panel__btn--unlock' : 'konami-panel__btn--lock'}`}
                    onClick={this.confirmKonami.bind(this)}
                >
                    {locked ? '🚀 UNLOCK TRACK' : '🔒 HIDE TRACK'}
                </button>
            </div>
        );
    }

    render() {
        return(
            <div className="App" >
                {this.renderSpace()}
                <div className="galaxy-layer" />
                {this.renderScene()}

                {/* Konami panel + backdrop */}
                {this.state.showKonamiPanel && (
                    <div
                        className="konami-backdrop"
                        onClick={() => this.setState({ showKonamiPanel: false })}
                    />
                )}
                {this.renderKonamiPanel()}

                {/* Brief flash after confirm */}
                {this.state.konamiFlash && (
                    <div className={`konami-flash konami-flash--${this.state.konamiFlash}`}>
                        {this.state.konamiFlash === 'unlocked'
                            ? '🚀 HOLY ROCKET  UNLOCKED'
                            : '🔒 HOLY ROCKET  HIDDEN'}
                    </div>
                )}
            </div>
        )
    }
}

export default App;