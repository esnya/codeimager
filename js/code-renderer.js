'use strict';

let CodeRenderer = {
    createCanvas: function() {
        return document.createElement('canvas');
    },
    render: function(canvas, code) {
        let fontSize = 12; 
        let margin = 5; 
        let lines = code.split(/[\r\n]+/);

        let width = lines.map(line => line.length).reduce((a, b) => Math.max(a, b)) * fontSize;
        let height = lines.length * fontSize;
        canvas.width = width;
        canvas.height = height;

        let lineDigits = Math.floor(Math.log10(lines.length)) + 1;

        let ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px monospace`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = 'black';

        lines.forEach(function(line, n) {
            let x = (lineDigits + 2) * fontSize * 0.5;
            let y = (n + 1) * fontSize;

            ctx.textAlign = 'right';
            ctx.fillText(`${n + 1}: `, x, y);

            ctx.textAlign = 'left';
            ctx.fillText(line, x, y);
        });

        let image = ctx.getImageData(0, 0, width, height);
        let twidth = -1, theight = -1;
        image.data.forEach(function(value, index) {
            let c = index % 4;
            let x = Math.floor(index / 4) % width;
            let y = Math.floor(index / 4 / width);

            if (c != 3 && value < 255) {
                twidth = Math.max(twidth, x + 1);
                theight = Math.max(theight, y + 1);
            }
        });
        canvas.width = twidth + margin * 2;
        canvas.height = theight + margin * 2;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(image, margin, margin,
                0, 0, Math.min(twidth + margin, width), Math.min(theight + margin, height));

        return canvas.toDataURL();
    },
};

module.exports = CodeRenderer;
