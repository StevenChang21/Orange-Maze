class gadget extends p5.Vector {
	constructor(x, y, maze, image) {
		super(x, y);
		this.cellIn = maze.GetCellByCoordinate(x, y);
		this.cellIn.content = this;
		this.position = p5.Vector.add(this.cellIn.absolute_v, createVector(1, 1).mult(maze.cell_length / 2));
		this.image = image;
		this.imageSize = maze.cell_length * 0.5;
		this.delay = random(0, 100);
	}

	explode(cell) {
		function findNeighbourCell(radians) {
			const x = round(sin(radians));
			const y = round(cos(radians));
			const coordinate = p5.Vector.add(cell.vector, createVector(x, y));
			return cell.maze.GetCellByCoordinate(coordinate.x, coordinate.y);
		}
		for (let i = 0; i < TAU; i += PI / 2) {
			const neighbourCell = findNeighbourCell(i);
			cell.maze.ConnectNeighbours(cell, neighbourCell);
		}
	}

	pick() {
		this.image = undefined;
		this.cellIn.content = undefined;
		return this;
	}

	render() {
		if (!this.image) return;
		const Y_position = oscillator.oscillateInCell(this.imageSize * 0.6, this.position.y, this.delay, 3);
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
		const gadgets = [];

		function hasDuplicate(vector) {
			if (gadgets.length <= 0) return false;
			for (let i = 0; i < gadgets.length; i++) {
				if (gadgets[i].dist(vector) <= 0.01) {
					return true;
				}
			}
			return false;
		}

		for (let i = 0; i < numGadgets; i++) {
			const randomisedDirection = p5.Vector.random2D();
			const Θ = atan2(randomisedDirection.x, randomisedDirection.y);
			const x = sin(Θ) * Half_X_AxisMagnitude;
			const y = cos(Θ) * Half_Y_AxisMagnitude;
			const vector = createVector(x, y);
			vector.mult(random(0.1, 0.9));
			vector.add(mazeCenterPoint);
			const g = new gadget(round(vector.x), round(vector.y), maze, image);
			if (hasDuplicate(g)) {
				i--;
				continue;
			}
			gadgets.push(g);
		}
		gadgets.push(new gadget(0, 1, maze, image));
		return gadgets;
	}

	static render() {
		const { maze, center } = this.mazeInfo;
		strokeWeight(4);
		noFill();
		stroke(30);
		ellipse(center.x, center.y, maze.columns * maze.cell_length * 0.9, maze.rows * maze.cell_length * 0.9);
	}
}
