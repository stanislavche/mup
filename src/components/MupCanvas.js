import React, { Component } from 'react';
import {createRef} from "react/cjs/react.production.min";

class MupCanvas extends Component {
    state = { width: document.body.clientWidth, height: document.body.clientHeight };
    canvasRef = createRef();

    updateDimensions = () => {
        this.setState({ width: document.body.clientWidth, height: document.body.clientHeight });
        this.updateCanvas();
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        this.updateCanvas();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    updateCanvas() {
        const ctx = this.canvasRef.current.getContext('2d');
        ctx.fillRect(0,0, 100, 100);
    }

    render() {
        return (
            <canvas ref={this.canvasRef} width={this.state.width} height={this.state.height}/>
        );
    }
}

export default MupCanvas;