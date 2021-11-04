

function createTestRun(test) {
    var currentTest = new Test(test);
    console.log(`Current Test :: ${currentTest.testName}`.black.bgGreen);
}

class IsoGraph {
    constructor(config) {
        this.element = config.element;
        this.name = config.name;
        this._canvas = this.setUpCanvas(config.element);
        this._context = this._canvas.getContext('2d');
        this._side = this.calculateSide();
        this._graphData = {
            vertices: this._calculateVertices(this._side)
        };
        console.log('==> IsoGraph JS instance :::', this);
    }

    calculateSide() {
        if (this._canvas.width > this._canvas.height) {
            return this._canvas.height;
        }

        return this._canvas.width;
    }

    init() {
        this._renderCenterBlock(this._canvas, this._context);
        this._drawGraphOutlines(this._graphData.vertices)
    }

    setUpCanvas(el) {
        let canvas = this._createCanvas(el.offsetWidth, el.offsetHeight);
        this.element.appendChild(canvas);
        return canvas;
    }

    offsetToRect (coord) {
        return {
            x: coord.x + (this._canvas.width - this._side) / 2,
            y: coord.y + (this._canvas.height - this._side) / 2
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
        let side = this.side, x, y;

        x = (canvas.width - side) / 2;
        y = (canvas.height - side) / 2;
        ctx.strokeRect(x, y, side, side);
    }

    _calculateVertices (side) {
        let dots = [
            this.offsetToRect({x: side / 2, y: 0}),
            this.offsetToRect({x: side, y: side / 4}),
            this.offsetToRect({x: side, y: side - side / 4}),
            this.offsetToRect({x: side / 2, y: side}),
            this.offsetToRect({x: 0, y: side - side / 4}),
            this.offsetToRect({x: 0, y: side / 4}),
            this.offsetToRect({x: side / 2, y: side / 2})
        ];
        return dots;
    } 

    _drawGraphOutlines (vertices) {
        const ctx = this._context;

        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        ctx.lineTo(vertices[1].x, vertices[1].y);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        ctx.lineTo(vertices[3].x, vertices[3].y);
        ctx.lineTo(vertices[4].x, vertices[4].y);
        ctx.lineTo(vertices[5].x, vertices[5].y);
        ctx.lineTo(vertices[0].x, vertices[0].y);
        ctx.lineTo(vertices[6].x, vertices[6].y);

        ctx.moveTo(vertices[6].x, vertices[6].y);
        ctx.lineTo(vertices[2].x, vertices[2].y);
        ctx.moveTo(vertices[6].x, vertices[6].y);
        ctx.lineTo(vertices[4].x, vertices[4].y);

        ctx.stroke();
    }
    
    _createCanvas(w, h) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        return canvas;
    }
}
