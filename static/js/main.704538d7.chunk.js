(this.webpackJsonpmup=this.webpackJsonpmup||[]).push([[0],{20:function(t,e,i){},21:function(t,e,i){},22:function(t,e,i){},25:function(t,e,i){"use strict";i.r(e);var a=i(1),s=i.n(a),n=i(15),r=i.n(n),c=(i(20),i(3)),h=i(4),o=i(7),u=i(6),l=i(5),d=(i(21),i(22),i(0)),v=function(t){Object(u.a)(i,t);var e=Object(l.a)(i);function i(t){var s;return Object(c.a)(this,i),(s=e.call(this,t)).putPixel=function(t,e,i){var a=255*i,n="rgb("+a+","+a+","+a+")";s.ctx.fillStyle=n,s.ctx.fillRect(t,e,1,1)},s.canvas=null,s.ctx=null,s.canvasRef=a.createRef(),s.h=0,s.w=0,s.stars=null,s.prevTime=null,s}return Object(h.a)(i,[{key:"drawImage",value:function(){var t=this;window.onresize=function(){t.setCanvasExtents()},this.canvas=this.canvasRef.current,this.ctx=this.canvas.getContext("2d"),this.setCanvasExtents(),this.stars=this.makeStars(2e3),this.init=this.init.bind(this),this.tick=this.tick.bind(this),requestAnimationFrame(this.init)}},{key:"setCanvasExtents",value:function(){this.w=document.body.clientWidth,this.h=document.body.clientHeight,this.canvas.width=this.w,this.canvas.height=this.h}},{key:"makeStars",value:function(t){for(var e=[],i=0;i<t;i++){var a={x:1600*Math.random()-800,y:900*Math.random()-450,z:1e3*Math.random()};e.push(a)}return e}},{key:"clear",value:function(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}},{key:"moveStars",value:function(t){for(var e=this.stars.length,i=0;i<e;i++){var a=this.stars[i];for(a.z-=t;a.z<=1;)a.z+=1e3}}},{key:"init",value:function(t){this.prevTime=t,requestAnimationFrame(this.tick)}},{key:"tick",value:function(t){var e=t-this.prevTime;this.prevTime=t,this.moveStars(.1*e),this.clear();for(var i=this.w/2,a=this.h/2,s=this.stars.length,n=0;n<s;n++){var r=this.stars[n],c=i+r.x/(.001*r.z),h=a+r.y/(.001*r.z);if(!(c<0||c>=this.w||h<0||h>=this.h)){var o=r.z/1e3,u=1-o*o;this.putPixel(c,h,u)}}requestAnimationFrame(this.tick)}},{key:"render",value:function(){return Object(d.jsx)("canvas",{ref:this.canvasRef,className:"space-element",style:{background:"transparent"},width:window.innerWidth,height:window.innerHeight})}},{key:"componentDidMount",value:function(t){console.log("draw"),this.drawImage()}}]),i}(a.Component),m=function(t){Object(u.a)(i,t);var e=Object(l.a)(i);function i(t){var a;return Object(c.a)(this,i),(a=e.call(this,t)).canvas=null,a.ctx=null,a.canvasRef=s.a.createRef(),a.requestRef=s.a.createRef(),a.isPlaying=!1,a.timeout=null,a.analyser=null,a.frequencyArray=[],a.updateVisualization=a.updateVisualization.bind(Object(o.a)(a)),a}return Object(h.a)(i,[{key:"initCanvas",value:function(){this.canvas=this.canvasRef.current,this.ctx=this.canvas.getContext("2d"),this.updateVisualization()}},{key:"initAudio",value:function(){var t=new(window.AudioContext||window.webkitAudioContext);this.analyser=t.createAnalyser(),this.analyser.fftSize=512,t.createMediaElementSource(this.props.audio).connect(this.analyser),this.analyser.connect(t.destination),this.frequencyArray=new Uint8Array(this.analyser.frequencyBinCount)}},{key:"pausePauseEvent",value:function(){var t=this;this.props.startAnimation?(clearTimeout(this.timeout),this.isPlaying=!0,this.initCanvas()):this.timeout=setTimeout((function(){t.isPlaying=!1}),2e3)}},{key:"drawCanvas",value:function(){if(this.canvasRef.current){this.analyser.getByteFrequencyData(this.frequencyArray);for(var t=Math.floor(this.frequencyArray[1]),e=.45*this.canvas.width<=450?-(.25*t+.45*this.canvas.width):-(.25*t+100),i=0;i<this.frequencyArray.length;i++){var a=this.frequencyArray[i];i>0&&(this.ctx.fillStyle="#86c06c",this.ctx.fillRect(0,e,2,-a/2),this.ctx.rotate(180/256*Math.PI/180))}for(var s=0;s<this.frequencyArray.length;s++){var n=this.frequencyArray[s];s>0&&(this.ctx.fillStyle="#316851",this.ctx.fillRect(0,e,2,-n/2),this.ctx.rotate(180/256*Math.PI/180))}this.ctx.restore()}}},{key:"updateVisualization",value:function(){this.isPlaying&&this.canvasRef.current&&(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.ctx.save(),this.ctx.translate(window.innerWidth/2,window.innerHeight/2),this.drawCanvas(),this.requestRef.current=requestAnimationFrame(this.updateVisualization))}},{key:"render",value:function(){return Object(d.jsx)(d.Fragment,{children:Object(d.jsx)("canvas",{ref:this.canvasRef,className:"visualiser-element",style:{background:"transparent"},width:window.innerWidth,height:window.innerHeight})})}},{key:"componentDidMount",value:function(t){(!t||t&&t.audio!==this.props.audio)&&(this.initAudio(),this.pausePauseEvent()),(!t||t&&t.startAnimation!==this.props.startAnimation)&&this.pausePauseEvent()}}]),i}(s.a.Component),f=i.p+"static/media/boy.09e91660.svg",p=function(t){Object(u.a)(i,t);var e=Object(l.a)(i);function i(t){var s;return Object(c.a)(this,i),(s=e.call(this,t)).state={counter:0},s.canvas=null,s.ctx=null,s.canvasRef=a.createRef(),s}return Object(h.a)(i,[{key:"drawImage",value:function(){var t=this;this.canvas=this.canvasRef.current,this.ctx=this.canvas.getContext("2d"),"boy"===this.props.imageType&&(this.image=new Image,this.image.src=f,this.image.onload=function(){t.ctx.drawImage(t.image,t.canvas.width/2-104,t.canvas.height/2-120,220,220),t.ctx.save()})}},{key:"render",value:function(){return Object(d.jsx)("canvas",{ref:this.canvasRef,className:"boy-element",style:{background:"transparent"},width:window.innerWidth,height:window.innerHeight})}},{key:"componentDidMount",value:function(t){(!t||t&&t.startAnimation!==this.props.startAnimation)&&this.drawImage()}}]),i}(a.Component),y=i(2),b=i.p+"static/media/1.552b61c6.mp3",j=i.p+"static/media/2.c69434d0.mp3",w=i.p+"static/media/3.06f37e67.mp3",k=i.p+"static/media/4.da4ee228.mp3",x=i.p+"static/media/5.bcaf96c5.mp3",g=i.p+"static/media/6.e9392241.mp3",O=i.p+"static/media/7.669dcbf8.mp3",A=i.p+"static/media/8.56748b33.mp3",C=i.p+"static/media/9.54d847f6.mp3",R=i.p+"static/media/10.f5ddc0c9.mp3",q=function(t){Object(u.a)(i,t);var e=Object(l.a)(i);function i(t){var a;return Object(c.a)(this,i),(a=e.call(this,t)).state={play:!1,audioObject:null,currentTrack:0,volume:.1},a.audio=new Audio,a.handleButtonClick=a.handleButtonClick.bind(Object(o.a)(a)),a.setVolume=a.setVolume.bind(Object(o.a)(a)),a.albumArray=[b,j,w,k,x,g,O,A,C,R],a}return Object(h.a)(i,[{key:"handleButtonClick",value:function(){this.audio.paused?this.audio.src&&this.audio.src.length?this.audio.play():this.initAudio():this.audio.pause(),this.setState({play:!0})}},{key:"setVolume",value:function(t){console.log(t),t?(this.setState({volume:t}),this.audio.volume=t):this.audio.volume=this.state.volume}},{key:"initAudio",value:function(t){var e=this.state.currentTrack,i=this.state.currentTrack;t&&"next"===t&&(e<9?++i:i=0),t&&"prev"===t&&(e<=0?i=9:--i),this.setState({currentTrack:i}),this.audio.src=this.albumArray[i],this.audio.crossOrigin="anonymous",this.audio.load(),this.setState({audioObject:this.audio}),this.setVolume(),this.audio.play()}},{key:"render",value:function(){var t=this,e=function(){return t.audio&&!t.audio.paused?Object(d.jsx)("p",{className:"startButton",onClick:t.handleButtonClick,children:"PAUSE"}):Object(d.jsx)("p",{className:"startButton",onClick:t.handleButtonClick,children:"PLAY"})};return this.state.play?Object(d.jsxs)("div",{className:"App",children:[Object(d.jsx)(v,{}),Object(d.jsx)(m,{startAnimation:this.state.play,audio:this.state.audioObject}),Object(d.jsx)(p,{imageType:"boy",startAnimation:this.state.play}),Object(d.jsxs)(y.CircularInput,{className:"volumeSwitcher",value:this.state.volume,onChange:this.setVolume,radius:150,children:[Object(d.jsx)(y.CircularTrack,{strokeWidth:4,stroke:"#86c06c"}),Object(d.jsx)(y.CircularProgress,{strokeWidth:10,stroke:"#dff8d0"})]}),e(),Object(d.jsx)("span",{className:"switcher next material-icons md-48",onClick:this.initAudio.bind(this,"next"),children:"arrow_forward_ios"}),Object(d.jsx)("span",{className:"switcher prev material-icons md-48",onClick:this.initAudio.bind(this,"prev"),children:"arrow_back_ios"})]}):Object(d.jsxs)("div",{className:"App",children:[Object(d.jsx)(v,{}),e()]})}}]),i}(a.Component);r.a.render(Object(d.jsx)(s.a.StrictMode,{children:Object(d.jsx)(q,{})}),document.getElementById("root"))}},[[25,1,2]]]);
//# sourceMappingURL=main.704538d7.chunk.js.map