'use strict';

import axios from 'axios';
import Firebase from 'firebase';
import { AppBar, FlatButton, SelectField, TextField } from 'material-ui';
import React, { PropTypes } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import config from '../config.json';
import Login from './login.js';
import CodeRenderer from './code-renderer.js';

let rootRef = new Firebase(config.firebase);

let App = React.createClass({
    mixins: [LinkedStateMixin],

    propTypes: {
    },

    childContextTypes: {
        rootRef: PropTypes.any,
    },
    getChildContext: function() {
        return {
            rootRef: rootRef,
        };
    },

    getInitialState: function() {
        return {
            language: 'd',
            code: '',
            tweet: '',
            image: null,
            auth: null,
        };
    },

    componentWillMount: function() {
        rootRef.onAuth(this.handleAuth);
    },
    componentWillUnmount: function() {
        rootRef.offAuth(this.handleAuth);
    },

    handleAuth: function(data) {
        console.log(data);
        this.setState({
            auth: data
        });
    },
    handleKeyDownOnCode: function(e) {
        if (e.keyCode == KeyEvent.DOM_VK_TAB) {
            e.preventDefault();
            e.target.setRangeText('    ');
            e.target.selectionStart += 4;
        }
    },
    handleGenerate: function() {
        let {
            code,
        } = this.state;

        this.setState({
            image: CodeRenderer.render(CodeRenderer.createCanvas(), code),
        });
    },
    handleTweet: function() {
        let {
            image,
            auth,
        } = this.state;

        if (auth && image) {
            console.log(image); // ToDo: send image to twitter
        }
    },

    render: function() {
        let {
            language,
            code,
            tweet,
            image,
            auth,
        } = this.state;

        let contentElement;
        if (!auth) {
            contentElement = <Login />;
        } else {
            let languages = [
                { text: 'C', payload: 'c' },
                { text: 'C++', payload: 'cpp' },
                { text: 'D', payload: 'd' },
            ];

            let lines = code.split(/\r?\n/).length;
            let lineNumbers = [];
            for (let i = 1; i <= lines || i <= 3; i++) {
                lineNumbers.push(`${i}: `);
            }
            lineNumbers = lineNumbers.join('\n');

            let imageElement = image && <img src={image} />;

            contentElement = (
                    <div>
                        <SelectField fullWidth={true} floatingLabelText="Language" menuItems={languages} valueLink={this.linkState('language')} />
                        <div style={{display: 'flex', alignItems: 'flex-end'}}>
                            <TextField style={{flex: '0 0 20px', textAlign: 'right'}} multiLine={true} fullWidth={true} readOnly={true} disabled={true} value={lineNumbers} />
                            <TextField style={{flex: '1 1 auto'}} rows={3} multiLine={true} fullWidth={true} floatingLabelText="Code" onKeyDown={this.handleKeyDownOnCode} valueLink={this.linkState('code')} />
                        </div>
                        <div>
                            <FlatButton primary={true} onTouchTap={this.handleGenerate}>Generate</FlatButton>
                        </div>
                        {imageElement}
                        <div>
                            <FlatButton secondary={true} onTouchTap={this.handleTweet} isDisabled={!!image}>Tweet</FlatButton>
                        </div>
                    </div>
                    );
        }

        return (
                <div>
                    <AppBar title="CodeImager (Alpha)" />
                    {contentElement}
                </div>
               );
    },
});

module.exports = App;
