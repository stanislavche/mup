(this.webpackJsonpmup=this.webpackJsonpmup||[]).push([[0],{25:function(t,e,i){},26:function(t,e,i){},27:function(t,e,i){},47:function(t,e,i){"use strict";i.r(e);var a=i(1),s=i.n(a),n=i(19),r=i.n(n),c=(i(25),i(4)),o=i(5),l=i(3),u=i(7),h=i(6),d=(i(26),i(27),i(0)),m=function(t){Object(u.a)(i,t);var e=Object(h.a)(i);function i(t){var s;return Object(c.a)(this,i),(s=e.call(this,t)).putPixel=function(t,e,i){var a=255*i,n="rgb("+a+","+a+","+a+")";s.ctx.fillStyle=n,s.ctx.fillRect(t,e,1,1)},s.canvas=null,s.ctx=null,s.canvasRef=a.createRef(),s.h=0,s.w=0,s.stars=null,s.prevTime=null,s}return Object(o.a)(i,[{key:"drawImage",value:function(){var t=this;window.onresize=function(){t.setCanvasExtents()},this.canvas=this.canvasRef.current,this.ctx=this.canvas.getContext("2d"),this.setCanvasExtents(),this.stars=this.makeStars(2e3),this.init=this.init.bind(this),this.tick=this.tick.bind(this),requestAnimationFrame(this.init)}},{key:"setCanvasExtents",value:function(){this.w=document.body.clientWidth,this.h=document.body.clientHeight,this.canvas.width=this.w,this.canvas.height=this.h}},{key:"makeStars",value:function(t){for(var e=[],i=0;i<t;i++){var a={x:1600*Math.random()-800,y:900*Math.random()-450,z:1e3*Math.random()};e.push(a)}return e}},{key:"clear",value:function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}},{key:"moveStars",value:function(t){for(var e=this.stars.length,i=0;i<e;i++){var a=this.stars[i];for(a.z-=t;a.z<=1;)a.z+=1e3}}},{key:"init",value:function(t){this.prevTime=t,requestAnimationFrame(this.tick)}},{key:"tick",value:function(t){var e=t-this.prevTime;this.prevTime=t,this.moveStars(.1*e),this.clear();for(var i=this.w/2,a=this.h/2,s=this.stars.length,n=0;n<s;n++){var r=this.stars[n],c=i+r.x/(.001*r.z),o=a+r.y/(.001*r.z);if(!(c<0||c>=this.w||o<0||o>=this.h)){var l=r.z/1e3,u=1-l*l;this.putPixel(c,o,u)}}requestAnimationFrame(this.tick)}},{key:"render",value:function(){return Object(d.jsx)("canvas",{ref:this.canvasRef,className:"space-element",style:{background:"transparent"},width:window.innerWidth,height:window.innerHeight})}},{key:"componentDidMount",value:function(t){this.drawImage()}}]),i}(a.Component),p=function(t){Object(u.a)(i,t);var e=Object(h.a)(i);function i(t){var a;return Object(c.a)(this,i),(a=e.call(this,t)).canvas=null,a.ctx=null,a.canvasRef=s.a.createRef(),a.requestRef=s.a.createRef(),a.isPlaying=!1,a.timeout=null,a.analyser=null,a.frequencyArray=[],a.updateVisualization=a.updateVisualization.bind(Object(l.a)(a)),a}return Object(o.a)(i,[{key:"initCanvas",value:function(){this.canvas=this.canvasRef.current,this.ctx=this.canvas.getContext("2d"),this.updateVisualization()}},{key:"initAudio",value:function(){var t=new(window.AudioContext||window.webkitAudioContext);this.analyser=t.createAnalyser(),this.analyser.fftSize=256,t.createMediaElementSource(this.props.audio).connect(this.analyser),this.analyser.connect(t.destination),this.frequencyArray=new Uint8Array(this.analyser.frequencyBinCount)}},{key:"pausePauseEvent",value:function(){var t=this;this.props.startAnimation?(clearTimeout(this.timeout),this.isPlaying=!0,this.initCanvas()):this.timeout=setTimeout((function(){t.isPlaying=!1}),2e3)}},{key:"drawCanvas",value:function(){if(this.canvasRef.current){this.analyser.getByteFrequencyData(this.frequencyArray);for(var t=Math.floor(this.frequencyArray[1]),e=.45*this.canvas.width<=450?-(.25*t+.45*this.canvas.width):-(.25*t+120),i=0;i<this.frequencyArray.length;i++){var a=this.frequencyArray[i];i>0&&(this.ctx.fillStyle="#86c06c",this.ctx.fillRect(0,e,6,-a/3),this.ctx.rotate(2.8125*Math.PI/180))}for(var s=0;s<this.frequencyArray.length;s++){var n=this.frequencyArray[s];s>0&&(this.ctx.fillStyle="#86c06c",this.ctx.fillRect(0,e,6,-n/3),this.ctx.rotate(-2.8125*Math.PI/180))}this.ctx.restore()}}},{key:"updateVisualization",value:function(){this.isPlaying&&this.canvasRef.current&&(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.save(),this.ctx.globalCompositeOperation="color-dodge",this.ctx.translate(window.innerWidth/2,window.innerHeight/2),this.drawCanvas(),this.requestRef.current=requestAnimationFrame(this.updateVisualization))}},{key:"render",value:function(){return Object(d.jsx)(d.Fragment,{children:Object(d.jsx)("canvas",{ref:this.canvasRef,className:"visualiser-element",style:{background:"transparent"},width:window.innerWidth,height:window.innerHeight})})}},{key:"componentDidMount",value:function(t){(!t||t&&t.audio!==this.props.audio)&&(this.initAudio(),this.pausePauseEvent()),(!t||t&&t.startAnimation!==this.props.startAnimation)&&this.pausePauseEvent()}}]),i}(s.a.Component),v=i.p+"static/media/boy.09e91660.svg",f=(a.Component,i(2)),g=i.p+"static/media/1.552b61c6.mp3",y=i.p+"static/media/2.c69434d0.mp3",b=i.p+"static/media/3.06f37e67.mp3",k=i.p+"static/media/4.da4ee228.mp3",j=i.p+"static/media/5.bcaf96c5.mp3",x=i.p+"static/media/6.e9392241.mp3",w=i.p+"static/media/7.669dcbf8.mp3",O=i.p+"static/media/8.56748b33.mp3",A=i.p+"static/media/9.54d847f6.mp3",T=i.p+"static/media/10.f5ddc0c9.mp3",C=i.p+"static/media/1 raw.1997e876.mp3",N=i.p+"static/media/2 raw.e42b5919.mp3",P=i.p+"static/media/3 raw.d6fbf518.mp3",R=i.p+"static/media/4 raw.0e277f95.mp3",E=i.p+"static/media/5 raw.c4f739a2.mp3",S=i.p+"static/media/6 raw.0352083c.mp3",I=i.p+"static/media/7 raw.3398f783.mp3",M=i.p+"static/media/8 raw.65a0a3ab.mp3",_=i.p+"static/media/9 raw.cabec754.mp3",q=i.p+"static/media/10 raw.543e669a.mp3",z=i.p+"static/media/serenity.06125127.gif",L=(i.p,i.p+"static/media/promise.dcb6b41a.gif"),V=i.p+"static/media/spacetime.5425c92f.gif",B=i.p+"static/media/popcorn.5d0be16d.gif",W=i.p+"static/media/siting.dd02d76d.gif",F=i.p+"static/media/dream.0e409df5.gif",H=i.p+"static/media/rail.071c5107.gif",D=i.p+"static/media/mup-transparent.39296262.gif",Y=i(20),U=i.n(Y),G=function(t){Object(u.a)(i,t);var e=Object(h.a)(i);function i(t){var a;return Object(c.a)(this,i),(a=e.call(this,t)).state={play:!1,audioObject:null,currentTrack:0,volume:70},a.playTime=0,a.audio=new Audio,a.handleButtonClick=a.handleButtonClick.bind(Object(l.a)(a)),a.setVolume=a.setVolume.bind(Object(l.a)(a)),a.setTrackPosition=a.setTrackPosition.bind(Object(l.a)(a)),a.albumArray=[{post:g,org:C,img:z,title:"SERENITY",className:""},{post:y,org:N,img:W,title:"HOLY ROCKET",className:""},{post:b,org:P,img:v,title:"PROMISE",className:"boy"},{post:k,org:R,img:V,title:"SPACE TIME",className:""},{post:j,org:E,img:B,title:"POPCORN",className:""},{post:x,org:S,img:W,title:"GOAL ACHIEVEMENT",className:""},{post:w,org:I,img:F,title:"CRYOGENIC DREAM",className:""},{post:O,org:M,img:L,title:"STARWAY",className:""},{post:A,org:_,img:v,title:"IMPETUS",className:"boy"},{post:T,org:q,img:H,title:"RAILROAD SWITCH",className:""}],a.image=a.albumArray[0].img,a.title=a.albumArray[0].title,a.imgClass=a.albumArray[0].className,a.progressTimer=null,a.debounceTimer=null,a.audioType="org",a.onLoadMedia=a.onLoadMedia.bind(Object(l.a)(a)),a.playNext=a.playNext.bind(Object(l.a)(a)),a}return Object(o.a)(i,[{key:"handleButtonClick",value:function(){this.audio.paused?this.audio.src&&this.audio.src.length?(this.startProgressInteraval(),this.audio.play()):this.initAudio():(this.audio.pause(),this.clearProgressInterval()),this.setState({play:!0})}},{key:"setVolume",value:function(t){t?(this.setState({volume:t}),this.audio.volume=t/100):this.audio.volume=this.state.volume/100}},{key:"setProgressTime",value:function(){this.playTime=+(100/(this.audio.duration/this.audio.currentTime)/100).toFixed(3),this.setState({playTime:this.playTime})}},{key:"startProgressInteraval",value:function(){var t=this;this.clearProgressInterval(),this.progressTimer=setInterval((function(){t.setProgressTime()}),500)}},{key:"clearProgressInterval",value:function(){this.progressTimer&&clearInterval(this.progressTimer)}},{key:"playNext",value:function(){this.initAudio("next")}},{key:"initAudio",value:function(t){console.log(t);var e=this.state.currentTrack,i=this.state.currentTrack;t&&"next"===t&&(e<9?++i:i=0),t&&"prev"===t&&(e<=0?i=9:--i),console.log("hello"),this.audio.removeEventListener("ended",this.playNext),this.setState({currentTrack:i}),this.audio.src=this.albumArray[i][this.audioType],this.image=this.albumArray[i].img,this.title=this.albumArray[i].title,this.imgClass=this.albumArray[i].className,this.audio.crossOrigin="anonymous",this.audio.addEventListener("loadeddata",this.onLoadMedia),this.setState({audioObject:this.audio}),this.audio.load()}},{key:"onLoadMedia",value:function(t,e){console.log("trigger event"),this.audio.removeEventListener("loadeddata",this.onLoadMedia),this.setVolume(),this.startProgressInteraval(),this.audio.play(),this.audio.addEventListener("ended",this.playNext)}},{key:"setTrackPosition",value:function(t){var e=this;clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout((function(){e.setProgressTime();var i=0;i="number"===typeof t?e.audio.duration*t:e.audio.duration*t.slice(4,9),e.audio.currentTime=i}),200)}},{key:"render",value:function(){var t=this,e=function(){return t.audio&&!t.audio.paused?Object(d.jsx)("p",{className:"startButton",onClick:t.handleButtonClick,children:"PAUSE"}):Object(d.jsx)("p",{className:"startButton",onClick:t.handleButtonClick,children:"PLAY"})};return this.state.play?Object(d.jsxs)("div",{className:"App",children:[Object(d.jsx)(m,{}),Object(d.jsx)(p,{startAnimation:this.state.play,audio:this.state.audioObject}),Object(d.jsx)("img",{className:"trackImage "+this.imgClass,src:this.image,alt:"logo"}),Object(d.jsxs)(f.CircularInput,{className:"progressSwitcher",value:this.playTime?this.playTime:0,onChange:this.setTrackPosition,radius:166,children:[Object(d.jsx)(f.CircularTrack,{strokeWidth:4,stroke:"#86c06c"}),Object(d.jsx)(f.CircularProgress,{strokeWidth:10,stroke:"#dff8d0"})]}),Object(d.jsx)(U.a,{classNames:{activeTrack:"input-range__track input-range__track--active",inputRange:"input-range volumeSwitcher",slider:"input-range__slider",sliderContainer:"input-range__slider-container",track:"input-range__track input-range__track--background"},maxValue:100,minValue:0,value:this.state.volume,onChange:this.setVolume}),e(),Object(d.jsx)("span",{className:"switcher next material-icons md-48",onClick:this.initAudio.bind(this,"next"),children:"arrow_forward_ios"}),Object(d.jsx)("span",{className:"switcher prev material-icons md-48",onClick:this.initAudio.bind(this,"prev"),children:"arrow_back_ios"})]}):Object(d.jsxs)("div",{className:"App",children:[Object(d.jsx)(m,{}),Object(d.jsx)("img",{className:"mainLogo",src:D,alt:"logo"}),e(),Object(d.jsx)("span",{className:"material-icons hidden-text",children:"arrow_forward_ios"})]})}}]),i}(a.Component);r.a.render(Object(d.jsx)(s.a.StrictMode,{children:Object(d.jsx)(G,{})}),document.getElementById("root"))}},[[47,1,2]]]);
//# sourceMappingURL=main.737fc51a.chunk.js.map