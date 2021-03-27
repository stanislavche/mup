import * as React from "react";
import boy from '../image/boy.svg';

class Boy  extends React.Component {
    constructor(props) {
        super(props);
        this.state = { counter: 0 };
        this.canvas = null;
        this.ctx = null;
        this.canvasRef = React.createRef();

    }

    drawImage()  {
        this.canvas = this.canvasRef.current;
        this.ctx = this.canvas.getContext("2d");
        if (this.props.imageType === 'boy') {
            this.image = new Image();
            this.image.src = boy;
            this.image.onload = () => {
                this.ctx.drawImage(this.image, this.canvas.width/2 -104, this.canvas.height/2 -120, 220, 220);
                this.ctx.save();
            }

        }
    };


    render() {
        return(
            <canvas
                ref={this.canvasRef}
                className={'boy-element'}
                style={{ background: "transparent" }}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        );
    }
    componentDidMount(prevProps) {
        console.log(prevProps, this.props.startAnimation);
        if (!prevProps || prevProps && prevProps.startAnimation !== this.props.startAnimation) {
            this.drawImage();
        }
    }
}

export default Boy;