class Wall {
	#vertexOne;
	#vertexTwo;

	constructor(vertex1, vertex2, is_active) {
		this.#vertexOne = createVector(vertex1.x, vertex1.y);
		this.#vertexTwo = createVector(vertex2.x, vertex2.y);
		this.is_active = is_active;
	}

	get vertices() {
		return {
			vertexOne: this.#vertexOne,
			vertexTwo: this.#vertexTwo,
		};
	}
}

class Cell {
	walls = [];

	constructor(x, y, maze) {
		this.vector = createVector(x, y);
		this.maze = maze;
		this.absolute_v = p5.Vector.mult(this.vector, maze.cell_length);
		this.GenerateWalls();
	}

	GenerateWalls() {
		const cell_midPoint = p5.Vector.add(this.absolute_v, p5.Vector.mult(createVector(1, 1), this.maze.cell_length / 2));
		const cell_cornerVector = createVector(-this.maze.cell_length / 2, -this.maze.cell_length / 2);
		for (let i = 0; i < 4; i++) {
			const vertex_one = p5.Vector.add(cell_midPoint, cell_cornerVector);
			cell_cornerVector.rotate(HALF_PI);
			const vertex_two = p5.Vector.add(cell_midPoint, cell_cornerVector);
			this.walls.push(new Wall(vertex_one, vertex_two, true));
		}
	}

	Show(cell_color, wall_color) {
		strokeWeight(2); //Show the cell and their active walls with color
		stroke(wall_color);
		for (let i = 0; i < this.walls.length; i++) {
			if (this.walls[i].is_active) {
				const wallVertices = this.walls[i].vertices;
				line(wallVertices.vertexOne.x, wallVertices.vertexOne.y, wallVertices.vertexTwo.x, wallVertices.vertexTwo.y);
			} else {
				this.walls.splice(i, 1);
			}
		}

		noStroke();
		fill(cell_color);
		rect(this.absolute_v.x, this.absolute_v.y, this.maze.cell_length, this.maze.cell_length);
	}

	CheckNeighbors(visited_cells) {
		//Used in the maze generation algorithm
		if (!this.maze) {
			console.warn("This cell doesn't belongs to any maze !!!");
			return undefined;
		}

		let neighbours = [];
		const initial_vector = createVector(0, -1);

		for (let i = 0; i < this.walls.length; i++) {
			const neighbour = this.maze.GetCellByCoordinate(initial_vector.x + this.vector.x, initial_vector.y + this.vector.y);

			if (neighbour && !visited_cells.includes(neighbour)) {
				neighbours.push(neighbour);
			}

			initial_vector.rotate(HALF_PI);
		}

		if (neighbours.length > 0) {
			let randomNeighbourIndex = floor(random(0, neighbours.length));
			return neighbours[randomNeighbourIndex];
		} else {
			return undefined;
		}
	}
}

const directions = {
	Up: { x: 0, y: -1 },
	Right: { x: 1, y: 0 },
	Down: { x: 0, y: 1 },
	Left: { x: -1, y: 0 },
};
