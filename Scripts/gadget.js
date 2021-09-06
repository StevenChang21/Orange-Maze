class gadget extends p5.Vector {
	constructor(x, y) {
		super(x, y);
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

		const mazeCenter = createVector(axisCenter(maze.rows), axisCenter(maze.columns));
		const maxY_AxisRadius = maze.rows / 2;
		const maxX_AxisRadius = maze.columns / 2;

		for (let i = 0; i < numGadgets; i++) {
			const randomisedDirection = p5.Vector.random2D();
			randomisedDirection.y = map(randomisedDirection.y, 0, 1, 0.1, 1);
			const Θ = atan(randomisedDirection.x, randomisedDirection.y);
			const x = sin(Θ) * maxX_AxisRadius;
			const y = cos(Θ) * maxY_AxisRadius;
			ellipse(x, y, 10, 20);
		}
	}
}
