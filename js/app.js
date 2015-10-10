'use strict';

import { AppBar, FlatButton, SelectField, TextField } from 'material-ui';
import React, { PropTypes } from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import CodeRenderer from './code-renderer.js';

let Input = React.createClass({
    propTypes: {
        style: PropTypes.any,
    },

    render: function() {
        let {
            ...otherProps,
        } = this.props;

        return (
                <textarea {...otherProps} /> 
               );
    },
});

let App = React.createClass({
    mixins: [LinkedStateMixin],

    propTypes: {
    },

    getInitialState: function() {
        return {
            language: 'd',
            code: '',
            tweet: '',
            image: null,
        };
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

    render: function() {
        let {
            language,
            code,
            tweet,
            image,
        } = this.state;

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

        //<TextField multiLine={true} fullWidth={true} floatingLabelText="Tweet" valueLink={this.linkState('tweet')} />
        //<FlatButton>Tweet</FlatButton>
        return (
                <div>
                    <AppBar title="CodeImager" />
                    <SelectField fullWidth={true} floatingLabelText="Language" menuItems={languages} valueLink={this.linkState('language')} />
                    <div style={{display: 'flex', alignItems: 'flex-end'}}>
                        <TextField style={{flex: '0 0 20px', textAlign: 'right'}} multiLine={true} fullWidth={true} readOnly={true} disabled={true} value={lineNumbers} />
                        <TextField style={{flex: '1 1 auto'}} rows={3} multiLine={true} fullWidth={true} floatingLabelText="Code" onKeyDown={this.handleKeyDownOnCode} valueLink={this.linkState('code')} />
                    </div>
                    <div>
                        <FlatButton primary={true} onTouchTap={this.handleGenerate}>Generate</FlatButton>
                    </div>
                    {imageElement}
                </div>
               );
    },
});

module.exports = App;
