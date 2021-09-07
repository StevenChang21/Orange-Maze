class Player {
	speed = 5;
	#claimedBombs = [];

	Spawn(maze, spawning_point = null) {
		this.maze = maze;
		this.cell_in = spawning_point ? maze.GetCellByCoordinate(spawning_point.x, spawning_point.y) : maze.GetCellByCoordinate(0, 0);
		this.target_cell = this.cell_in;
		this.isMoving = false;
		this.hasCooledDown = true;

		if (!this.cell_in) {
			console.error("Player is not spawn in a maze !\nThe game cannot start!");
			return;
		}

		this.position = this.cell_in.absolute_v.copy();
	}

	destroyWalls(onDestroyedWalls) {
		if (this.#claimedBombs.length <= 0 || !this.hasCooledDown) {
			onDestroyedWalls();
			return;
		}
		const usedBomb = this.#claimedBombs.pop();
		usedBomb.explode(this.cell_in);
		const label = document.querySelector("#bomb-count-label");
		label.innerHTML = `${this.#claimedBombs.length} bombs`;
		this.hasCooledDown = false;
		setTimeout(() => (this.hasCooledDown = !this.hasCooledDown), 3000);
		onDestroyedWalls();
	}

	Render(fill_color, side_color = null) {
		if (this.target_cell.vector.dist(this.cell_in.vector) > 0) {
			this.position.lerp(this.target_cell.absolute_v, this.speed * deltaTime * 0.001);
			if (this.target_cell.absolute_v.dist(this.position) <= 0.01) {
				this.isMoving = false;
				this.cell_in = this.target_cell;

				this.onReachDestination();
			}
		}

		const size = this.maze.cell_length - 10;
		const offset = (this.maze.cell_length - size) / 2;
		fill(fill_color);
		rect(this.position.x + offset, this.position.y + offset, size, size);

		if (side_color) {
			stroke(side_color);
			strokeWeight(0.5);
		}
	}

	Move(direction, onReachDestination) {
		if (this.isMoving) return;
		if (this.blockByWall(direction)) {
			onReachDestination();
			return;
		}
		this.isMoving = true;
		const movingDir = directions[direction];
		const targetCellPosition = p5.Vector.add(createVector(movingDir.x, movingDir.y), this.cell_in.vector);
		this.target_cell = this.maze.GetCellByCoordinate(targetCellPosition.x, targetCellPosition.y);
		this.onReachDestination = onReachDestination;
		if (this.target_cell.content) {
			this.#claimedBombs.push(this.target_cell.content.pick());
			const label = document.querySelector("#bomb-count-label");
			label.innerHTML = `${this.#claimedBombs.length} bombs`;
		}
	}

	blockByWall(direction) {
		const wallIndex = Object.keys(directions).indexOf(direction);
		if (!this.cell_in.walls[wallIndex]) return true;
		return this.cell_in.walls[wallIndex].is_active;
	}
}
