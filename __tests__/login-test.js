'use strict';

jest.dontMock('../js/login.js');
describe('Login', function() {
    var React= require('react'); // React is used by compiled codes from JSX. Important!!! 
    var ReactDOM = require('react-dom');
    var TestUtils = require('react-addons-test-utils');

    var rootRef = {
        authWithOAuthRedirect: jest.genMockFunction(),
    };

    var Wrapper = React.createClass({
        childContextTypes: {
            rootRef: React.PropTypes.any,
        },
        getChildContext: function() {
            return {
                rootRef: rootRef,
            };
        },
        render: function() {
            return (<div>{this.props.children}</div>);
        },
    });

    var Login = require('../js/login.js');
    var login = TestUtils.renderIntoDocument(<Wrapper><Login /></Wrapper>);
    it('should contain the twitter login button', function() {
        var button = TestUtils.findRenderedDOMComponentWithTag(login, 'button');
        expect(ReactDOM.findDOMNode(button).textContent).toContain('Twitter');
    });

    //it('should be redirected when clicked twitter login button', function() {
    //    var button = TestUtils.findRenderedDOMComponentWithTag(login, 'button');

    //    TestUtils.Simulate.tap(button);
    //    expect(rootRef.authWithOAuthRedirect).toBeCalled();
    //});
});
