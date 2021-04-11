import * as React from "react";

class Description  extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const stnLink = "https://s-tn.space/mup";
        const katikaLink = "https://www.instagram.com/katika_taoka_art/";
        const streamlink = "https://band.link/kR9Zc";
        const lsdjLink = "https://www.littlesounddj.com/";
        return(
            <div>
                <p className={'info__description'}>
                    All tracks have been composed just on one Nintendo Gameboy Original and <a  rel="noopener noreferrer" href={lsdjLink} className={"info__link"} target={"_blank"}> LittleSoundDj</a> cartridge.
                    <br />
                    <a href={streamlink}  rel="noopener noreferrer" className={"info__buy"} target={"_blank"}>ADD TO LIBRARY</a>
                </p>
                <p className={'info__title'}>
                    MUSIC: <a href={stnLink}  rel="noopener noreferrer" className={"info__link info__link_stn"} target={"_blank"}>S_TN</a>
                    <br />
                    ART: <a href={katikaLink} className={"info__insta"}  rel="noopener noreferrer" target={"_blank"}>
                        <span class={"info__gradient"}>@ Katika_Taoka</span>
                    </a>
                </p>

            </div>
        );
    }
}

export default Description;




