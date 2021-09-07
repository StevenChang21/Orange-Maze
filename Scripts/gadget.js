class gadget extends p5.Vector {
	constructor(x, y, maze) {
		super(x, y);
		this.cellIn = maze.GetCellByCoordinate(x, y);
	}

	render() {
		fill(20);
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
			center: centerCell.absolute_v,
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
			const vector = createVector(x, y);
			vector.mult(random(0.1, 0.9));
			vector.add(mazeCenterPoint);
			const g = new gadget(round(vector.x), round(vector.y), maze);
			if (checkCoordinateDuplication(unplacebleCoordinates, g) && checkCoordinateDuplication(game.gadgets, g)) {
				game.gadgets.push(g);
			} else {
				i--;
			}
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
