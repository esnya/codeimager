'use strict';

import { RaisedButton } from 'material-ui';
import React, {PropTypes} from 'react';

let Login = React.createClass({
    contextTypes: {
        rootRef: PropTypes.any.isRequired,
    },
    propTypes: {
    },

    handleOAuthTwitter: function(e) {
        e.preventDefault();

        let {
            rootRef,
        } = this.context;

        rootRef.authWithOAuthRedirect('twitter', function(error) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Login OK!");
            }
        });
    },

    render: function() {
        return (
                <div style={{ marginTop: 10, textAlign: 'center' }}>
                    <RaisedButton backgroundColor="#55acee" onTouchTap={this.handleOAuthTwitter}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                            <div><img src="/img/TwitterLogo_white_34.png" /></div>
                            <div style={{ color: 'white' }}>Login with Twitter</div>
                        </div>
                    </RaisedButton>
                </div>
               );
    },
});

module.exports = Login;
