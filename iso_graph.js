

function createTestRun(test) {
    var currentTest = new Test(test);
    console.log(`Current Test :: ${currentTest.testName}`.black.bgGreen);
}

function getRandomMatrix (w, h) {
    let max = 80;
    let buffer = [];
    let output = [];

    for (let i = 0; i < w; i++) {
        buffer = [];        
        for(let j = 0; j < h; j++) {
            buffer.push(Math.floor(Math.random() * max));
        }
        output.push(buffer);
    }

    console.log('---Output :::', output);
    return output;
}

class IsoGraph {
    constructor(config) {
        this.element = config.element;
        this.name = config.name;
        this._canvas = this.setUpCanvas(config.element);
        this._context = this._canvas.getContext('2d');
        this._padding = 30;
        this._side = this.calculateSide();
        this._rectHeight = this._side;
        this._rectWidth = this._side * (Math.sqrt(3) / 2);
        this._graphData = {
            vertices: this._calculateVertices(this._side)
        };
        this.data = config.data;
        console.log('==> IsoGraph JS instance :::', this);

        this._defaultColors = {
            lightGray: '#cccccc',
            lightBlue: '#abc9ff'
        }
    }

    calculateSide() {
        if (this._canvas.width > this._canvas.height) {
            return this._canvas.height - 2 * this._padding;
        }

        return this._canvas.width - 2 * this._padding;
    }

    init() {
        // this._renderCenterBlock(this._canvas, this._context);
        this._drawGraphOutlines(this._graphData.vertices);
        this.drawGrid(this.data.length, this.data[0].length);
        this.drawDataDots(this.data.length, this.data[0].length);
        return this;
    }

    setUpCanvas(el) {
        let canvas = this._createCanvas(el.offsetWidth, el.offsetHeight);
        this.element.appendChild(canvas);
        return canvas;
    }

    offsetToRect (coord) {
        console.log('Infotmatio', this._rectHeight, this._rectWidth);
        return {
            x: coord.x + (this._canvas.width - this._rectWidth) / 2,
            y: coord.y + (this._canvas.height - this._rectHeight) / 2
        }
    }

    _renderVertices (vertices) {
        const ctx = this._context;
        vertices.forEach(vertex => {
            console.log('Vertex Data ::', vertex);
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            ctx.stroke();
        })
    }

    _renderCenterBlock(canvas, ctx) {
        let side = this._side;
        let x, y, w, h;
        
        x = (canvas.width - this._rectWidth) / 2;
        y = (canvas.height - this._rectHeight) / 2;

        ctx.beginPath();
        ctx.rect(x, y, this._rectWidth, this._rectHeight);
        ctx.stroke();

        console.log('DATA', x, y, this._rectHeight, this._rectWidth);
    }

    _calculateVertices () {
        let rectH = this._rectHeight;
        let rectW = this._rectWidth; 
        return [
            this.offsetToRect({x: rectW / 2, y: 0}),
            this.offsetToRect({x: rectW, y: rectW  /  (2 * Math.sqrt(3))}),
            this.offsetToRect({x: rectW, y: rectH - rectW  /  (2 * Math.sqrt(3))}),
            this.offsetToRect({x: rectW / 2, y: rectH}),
            this.offsetToRect({x: 0, y: rectH - rectW  /  (2 * Math.sqrt(3))}),
            this.offsetToRect({x: 0, y: rectW  /  (2 * Math.sqrt(3))}),
            this.offsetToRect({x: rectW / 2, y: rectH / 2})
        ];
    } 

    _drawXLine (x, y, color) {
        let vDiff = this._rectHeight / 4;
        let hDiff = this._rectWidth / 2;
        let ctx = this._context;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineTo(x + hDiff, y + vDiff);
        ctx.stroke();
    }

    _drawYLine (x, y, color) {
        let vDiff = this._rectHeight / 4;
        let hDiff = -this._rectWidth / 2;
        let ctx = this._context;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineTo(x + hDiff, y + vDiff);
        ctx.stroke();
    }

    _drawZLine (x, y, color) {
        let vDiff = -this._rectHeight / 2;
        let ctx = this._context;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineTo(x, y + vDiff);
        ctx.stroke();
    }

    _drawGraphOutlines (vertices) {
        const ctx = this._context;
        let defColor = this._defaultColors.lightBlue;

        this._drawZLine(vertices[2].x, vertices[2].y, defColor);
        this._drawZLine(vertices[4].x, vertices[4].y, defColor);
        this._drawZLine(vertices[6].x, vertices[6].y, defColor);

        this._drawXLine(vertices[0].x, vertices[0].y, defColor);
        this._drawXLine(vertices[4].x, vertices[4].y, defColor);
        this._drawXLine(vertices[6].x, vertices[6].y, defColor);

        this._drawYLine(vertices[6].x, vertices[6].y, defColor);
        this._drawYLine(vertices[2].x, vertices[2].y, defColor);
        this._drawYLine(vertices[0].x, vertices[0].y, defColor);

        ctx.stroke();
    }

    drawGrid (px, py) {
        const isoGraph = this;
        let defColor = this._defaultColors.lightBlue;

        this._calculateGridSections(this._graphData.vertices[6], this._graphData.vertices[4], px)
            .forEach((point) => {
                isoGraph._drawXLine(point.x, point.y, defColor);
            });
        this._calculateGridSections(this._graphData.vertices[6], this._graphData.vertices[2], py)
            .forEach((point) => {
                isoGraph._drawYLine(point.x, point.y, defColor);
            });
    }

    drawDataDots (px, py) {
        const isoGraph = this;
        let startPoints =  this._calculateGridSections(this._graphData.vertices[4], this._graphData.vertices[3], py);
        let endPoints = this._calculateGridSections(this._graphData.vertices[6], this._graphData.vertices[2], py);

        for (let i = 0; i < py; i++) {
            this._calculateGridSections(startPoints[i], endPoints[i], px)
                .forEach((point) => {
                    isoGraph.drawDot(point.x, point.y, 5, '#377cf7');
                });
        }
    }

    drawDot (x, y, r, color) {
        const context = this._context;

        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = this._defaultColors.lightBLue;
        context.stroke();
    }

    drawWord (x,y, text) {
        const ctx = this._context;

        ctx.font = "12px arial";
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.textBaseline = "hanging";
        ctx.fillText(text, x, y);
    }

    _calculateGridSections (start, end, sections) {
        let hDiff = start.x - end.x;
        let vDiff = start.y - end.y;
        let vStep = vDiff / (sections - 1);
        let hStep = hDiff / (sections - 1);
        let points = [];

        console.log('DIFF', vDiff, hDiff, vStep, hStep);

        for (let i = 0; i < sections; i++) {
            points.push({
                x: start.x - i * hStep,
                y: start.y - i * vStep
            });
        }

        return points;
    }
    
    _createCanvas(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }

    _getMaxValue (matrix) {
        let arrayMaxes = [];
        matrix.forEach(arr => {
            console.log('ARRAY', arr);
            arrayMaxes.push(Math.max(...arr));
        });
        return Math.max(...arrayMaxes);
    }
}
