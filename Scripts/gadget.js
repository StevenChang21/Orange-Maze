class gadget extends p5.Vector {
	constructor(x, y, maze, image) {
		super(x, y);
		this.cellIn = maze.GetCellByCoordinate(x, y);
		this.position = p5.Vector.add(this.cellIn.absolute_v, createVector(1, 1).mult(maze.cell_length / 2));
		this.image = image;
		this.imageSize = maze.cell_length * 0.5;
		this.delay = random(0, 100);
	}

	render() {
		const Y_position = oscillator.oscillateInCell(this.imageSize, this.position.y, this.delay, 2);
		image(this.image, this.position.x, Y_position, this.imageSize, this.imageSize);
	}

	static generate(numGadgets, maze, image) {
		function axisCenter(quantity) {
			return round(quantity) / 2;
		}

		const mazeCenterPoint = createVector(axisCenter(maze.columns), axisCenter(maze.rows));
		const centerCell = maze.GetCellByCoordinate(mazeCenterPoint.x, mazeCenterPoint.y);
		const Half_X_AxisMagnitude = maze.columns / 2;
		const Half_Y_AxisMagnitude = maze.rows / 2;
		this.mazeInfo = {
			maze,
			center: centerCell.absolute_v,
		};

		for (let i = 0; i < numGadgets; i++) {
			const randomisedDirection = p5.Vector.random2D();
			const Θ = atan2(randomisedDirection.x, randomisedDirection.y);
			const x = sin(Θ) * Half_X_AxisMagnitude;
			const y = cos(Θ) * Half_Y_AxisMagnitude;
			const vector = createVector(x, y);
			vector.mult(random(0.1, 0.9));
			vector.add(mazeCenterPoint);
			const g = new gadget(round(vector.x), round(vector.y), maze, image);
			game.gadgets.push(g);
		}
	}

	static render() {
		const { maze, center } = this.mazeInfo;
		strokeWeight(4);
		noFill();
		stroke(30);
		ellipse(center.x, center.y, maze.columns * maze.cell_length * 0.9, maze.rows * maze.cell_length * 0.9);
	}
}
