import * as React from "react";

class Description  extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const stnLink = "https://s-tn.space/mup";
        const katikaLink = "https://www.instagram.com/katika_taoka_art/";
        const streamlink = "https://band.link/kR9Zc";
        return(
            <div>
                <p className={'info__description'}>
                    All tracks have been composed just on one Nintendo Gameboy Original and LittleSoundDj cartridge.
                    <br />
                    <a href={streamlink} className={"info__buy"} target={"_blank"}>ADD TO LIBRARY</a>
                </p>
                <p className={'info__title'}>
                    MUSIC: <a href={stnLink} className={"info__link"} target={"_blank"}>S_TN</a>
                    <br />
                    ART: <a href={katikaLink} className={"info__insta"} target={"_blank"}> @ KATIKA_TAOKA_ART</a>
                    <br /><br />

                </p>

            </div>
        );
    }
}

export default Description;




