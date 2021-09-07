class gadget extends p5.Vector {
	constructor(x, y, maze) {
		super(x, y);
		console.log(x, y);
		this.cellIn = maze.GetCellByCoordinate(x, y);
		this.position = p5.Vector.add(this.cellIn.absolute_v, createVector(1, 1).mult(maze.cell_length / 2));
	}

	render() {
		ellipse(this.position.x, this.position.y, 20, 20);
	}

	static generate(occupiedCells, offset, numGadgets, maze) {
		const unplacebleCoordinates = [];
		occupiedCells.forEach((cell) => {
			for (let i = 0; i < TAU; i += PI / 2) {
				const x = round(sin(i));
				const y = round(cos(i));
				const rot = createVector(x, y);
				for (let j = 0; j < offset; j++) {
					const unplacebleCoordinate = p5.Vector.add(cell.vector, rot.mult(j + 1));
					unplacebleCoordinates.push(unplacebleCoordinate);
				}
			}
		});

		function axisCenter(quantity) {
			return round(quantity) / 2;
		}

		const mazeCenterPoint = createVector(axisCenter(maze.columns), axisCenter(maze.rows));
		const centerCell = maze.GetCellByCoordinate(mazeCenterPoint.x, mazeCenterPoint.y);
		const Half_X_AxisMagnitude = maze.columns / 2;
		const Half_Y_AxisMagnitude = maze.rows / 2;
		this.mazeInfo = {
			maze,
			mazeCenterPoint,
		};

		function checkCoordinateDuplication(collection, coordinate) {
			if (collection.length === 0) return true;
			for (let j = 0; j < collection.length; j++) {
				if (collection[j].dist(coordinate) <= 0.01) {
					return false;
				} else if (j === collection.length - 1) {
					return true;
				}
			}
		}

		for (let i = 0; i < numGadgets; i++) {
			const randomisedDirection = p5.Vector.random2D();
			const Θ = atan2(randomisedDirection.x, randomisedDirection.y);
			const x = sin(Θ) * Half_X_AxisMagnitude;
			const y = cos(Θ) * Half_Y_AxisMagnitude;
			const v = createVector(x, y);
			v.mult(random(0.1, 1));
			v.add(mazeCenterPoint);
			console.log(v);
			const g = new gadget(round(v.x), round(v.y), maze);
			if (checkCoordinateDuplication(unplacebleCoordinates, g) && checkCoordinateDuplication(game.gadgets, g)) {
				game.gadgets.push(g);
			} else {
				i--;
			}
		}
	}

	static render() {
		const { maze, mazeCenterPoint } = this.mazeInfo;
		strokeWeight(4);
		const centerCell = maze.GetCellByCoordinate(mazeCenterPoint.x, mazeCenterPoint.y).absolute_v;

		noFill();
		stroke(30);
		ellipse(centerCell.x, centerCell.y, maze.columns * maze.cell_length, maze.rows * maze.cell_length);
	}
}
