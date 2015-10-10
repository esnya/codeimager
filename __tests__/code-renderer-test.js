'use strict';

jest.dontMock('../js/code-renderer.js');
describe('CodeRenderer', function() {
    var React= require('react'); // React is used by compiled codes from JSX. Important!!! 
    var ReactDOM = require('react-dom');
    var TestUtils = require('react-addons-test-utils');

    var CodeRenderer = require('../js/code-renderer.js');

    let fontSize = 12;
    let ctx = {
        fillRect: jest.genMockFunction(),
        fillText: jest.genMockFunction(),
        putImageData: jest.genMockFunction(),
        getImageData: function(x, y, width, height) {
            let data = [];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    for (let c = 0; c < 4; c++) {
                        if (c == 4) data.push(255);
                        else data.push((x < 100 && y < 55) ? 0 : 255);
                    }
                }
            }
            expect(data.length).toBe(width * height * 4);

            return {
                width: width,
                height: height,
                data: data,
            };
        },
    };
    let canvas = {
        getContext: function() {
            return ctx;
        },
        toDataURL: jest.genMockFunction()
            .mockReturnValueOnce({}),
    };

    let code = [
        'module hello;',
        'import std.stdio;',
        ' ',
        'void main() {',
            '  writeln("Hello,World!");',
        '}',
    ];
    let rendered;
    it('should be able to render codes', function() {
        rendered = CodeRenderer.render(canvas, code.join('\n'));
    });

    it('should set width and height of canvas', function() {
        expect(canvas.width).toBeDefined();
        expect(canvas.height).toBeDefined();
    });
    it('should set font to 12px, monospace', function() {
        expect(ctx.font).toContain('12px');
        expect(ctx.font).toContain('monospace');
    });

    it('should fill background', function() {
        expect(ctx.fillRect).toBeCalled;
        expect(ctx.fillRect.mock.calls[0][0]).toBe(0);
        expect(ctx.fillRect.mock.calls[0][1]).toBe(0);
        expect(ctx.fillRect.mock.calls[0][2]).toBe(26 * fontSize);
        expect(ctx.fillRect.mock.calls[0][3]).toBe(6 * fontSize);
    });
    it('should render text and line numbers', function() {
        expect(ctx.fillText.mock.calls.length).toBe(code.length * 2);

        code.forEach(function(line, n) {
            expect(ctx.fillText.mock.calls[n * 2 + 0][0]).toEqual((n + 1) + ': ');
            expect(ctx.fillText.mock.calls[n * 2 + 1][0]).toEqual(line);

            expect(ctx.fillText.mock.calls[n * 2 + 0][1]).toBe(fontSize * 3 * 0.5);
            expect(ctx.fillText.mock.calls[n * 2 + 1][1]).toBe(fontSize * 3 * 0.5);

            let y = (n + 1) * fontSize;
            expect(ctx.fillText.mock.calls[n * 2 + 0][2]).toBe(y);
            expect(ctx.fillText.mock.calls[n * 2 + 1][2]).toBe(y);
        });
    });

    it('should return trimed image', function() {
        expect(rendered).toBeDefined();
        expect(rendered).not.toBeNull();
        expect(canvas.width).toBe(100 + 5 * 2);
        expect(canvas.height).toBe(55 + 5 * 2);
        expect(canvas.toDataURL).toBeCalled();
    });
});
