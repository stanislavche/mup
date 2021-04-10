import * as React from "react";
import {
    FacebookShareButton,
    FacebookMessengerShareButton,
    FacebookMessengerIcon,
    LinkedinShareButton,
    TwitterShareButton,
    PinterestShareButton,
    VKShareButton,
    OKShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    RedditShareButton,
    EmailShareButton,
    TumblrShareButton,
    LivejournalShareButton,
    MailruShareButton,
    ViberShareButton,
    WorkplaceShareButton,
    LineShareButton,
    WeiboShareButton,
    PocketShareButton,
    InstapaperShareButton,
    HatenaShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    PinterestIcon,
    VKIcon,
    OKIcon,
    TelegramIcon,
    WhatsappIcon,
    RedditIcon,
    TumblrIcon,
    MailruIcon,
    EmailIcon,
    LivejournalIcon,
    ViberIcon,
    WorkplaceIcon,
    LineIcon,
    PocketIcon,
    InstapaperIcon,
    WeiboIcon,
    HatenaIcon,
} from "react-share";
import exampleImage from '../image/mup.gif';

class Share  extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const shareUrl = 'https://s-tn.space/mup';
        const title = 'Mup title';
        return(
            <div className="Demo__container">
                <div className="share__button">
                    <FacebookShareButton
                        url={shareUrl}
                        quote={title}
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </div>

                <div className="share__button">
                    <FacebookMessengerShareButton
                        url={shareUrl}
                        appId="923834238416978"
                    >
                        <FacebookMessengerIcon size={32} round />
                    </FacebookMessengerShareButton>
                </div>

                <div className="share__button">
                    <TwitterShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                </div>

                <div className="share__button">
                    <TelegramShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </div>

                <div className="share__button">
                    <WhatsappShareButton
                        url={shareUrl}
                        title={title}
                        separator=":: "
                    >
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>

                <div className="share__button">
                    <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>

                <div className="share__button">
                    <PinterestShareButton
                        url={String(window.location)}
                        media={`${String(window.location)}/${exampleImage}`}
                    >
                        <PinterestIcon size={32} round />
                    </PinterestShareButton>
                </div>

                <div className="share__button">
                    <VKShareButton
                        url={shareUrl}
                        image={`${String(window.location)}/${exampleImage}`}
                    >
                        <VKIcon size={32} round />
                    </VKShareButton>
                </div>

                <div className="share__button">
                    <OKShareButton
                        url={shareUrl}
                        image={`${String(window.location)}/${exampleImage}`}
                    >
                        <OKIcon size={32} round />
                    </OKShareButton>
                </div>

                <div className="share__button">
                    <RedditShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={660}
                        windowHeight={460}
                    >
                        <RedditIcon size={32} round />
                    </RedditShareButton>
                </div>

                <div className="share__button">
                    <TumblrShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <TumblrIcon size={32} round />
                    </TumblrShareButton>
                </div>

                <div className="share__button">
                    <LivejournalShareButton
                        url={shareUrl}
                        title={title}
                        description={shareUrl}
                    >
                        <LivejournalIcon size={32} round />
                    </LivejournalShareButton>
                </div>

                <div className="share__button">
                    <MailruShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <MailruIcon size={32} round />
                    </MailruShareButton>
                </div>

                <div className="share__button">
                    <EmailShareButton
                        url={shareUrl}
                        subject={title}
                        body="body"
                    >
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </div>
                <div className="share__button">
                    <ViberShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <ViberIcon size={32} round />
                    </ViberShareButton>
                </div>

                <div className="share__button">
                    <WorkplaceShareButton
                        url={shareUrl}
                        quote={title}
                    >
                        <WorkplaceIcon size={32} round />
                    </WorkplaceShareButton>
                </div>

                <div className="share__button">
                    <LineShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <LineIcon size={32} round />
                    </LineShareButton>
                </div>

                <div className="share__button">
                    <WeiboShareButton
                        url={shareUrl}
                        title={title}
                        image={`${String(window.location)}/${exampleImage}`}
                    >
                        <WeiboIcon size={32} round />
                    </WeiboShareButton>
                </div>

                <div className="share__button">
                    <PocketShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <PocketIcon size={32} round />
                    </PocketShareButton>
                </div>

                <div className="share__button">
                    <InstapaperShareButton
                        url={shareUrl}
                        title={title}
                    >
                        <InstapaperIcon size={32} round />
                    </InstapaperShareButton>
                </div>

                <div className="share__button">
                    <HatenaShareButton
                        url={shareUrl}
                        title={title}
                        windowWidth={660}
                        windowHeight={460}
                    >
                        <HatenaIcon size={32} round />
                    </HatenaShareButton>
                </div>
            </div>
        );
    }
}

export default Share;