import React from "react";
import { getGift, updateTitle } from '../api';
import Router from 'next/router';
import Error from './_error';
import Copy from '../components/copiableText';
import Edit from '../components/editableText';
import '../styles.scss';
import Footer from '../components/footer';
import axios from 'axios';

export default class Gift extends React.Component {
    static async getInitialProps({ res, query }) {
        const response = await getGift(query.id, query.owner);

        return Object.assign({}, query, response);
    }

    constructor(props) {
        super(props);
        this.state = {
            videoURL: null,
            loading: true
        };
    }

    componentDidMount() {
        this.tryFetchVideo();
    }

    videoLoaded(url) {
    }

    async updateTitle(newName) {
        const response = await updateTitle(this.props.id, this.props.owner, newName);
        return response.success;
    }
    
    async tryFetchVideo() {
        try {
            const response = await axios.get(this.props.videoURL, { responseType: 'blob' });
            const URL = window.URL || window.webkitURL;
            const blob_url = URL.createObjectURL(response.data);
            this.setState({
                loading: false,
                videoURL: blob_url
            });
        } catch (e) {
            this.setState({
                loading: false
            });
            setTimeout(this.tryFetchVideo.bind(this), 10000);
        }
    }

    render() {
        if (!this.props.success) {
            return <Error />;
        }

        return (
            <>
                <title>You have received The Gift</title>
                <div className='container'>
                    <div className='row'>
                        {this.props.isOwner ? <Edit onUpdate={this.updateTitle.bind(this)}>{this.props.title}</Edit> : <h1>{this.props.title}</h1>}
                    </div>
                    <div className='row'>
                        {
                            this.state.videoURL ?
                                <video width='640' height='360' controls>
                                    <source src={this.state.videoURL} />
                                </video> :
                                <div className='videoPlaceholder'>
                                    <h5>{this.state.loading ? 'Loading...' : 'Your Gift is still processing. Please wait.'}</h5>
                                </div>
                        }
                    </div>
                    {
                        this.props.isOwner &&
                        <div className='row'>
                            <div className='col'>
                                <p>Share this Gift with your loved ones using this URL: <Copy>{WEBSITE_NAME}/gift/{this.props.id}</Copy></p>
                            </div>
                        </div>
                    }
                </div>
                <Footer />
            </>
        );
    }
}