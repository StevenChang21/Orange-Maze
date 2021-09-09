class Player {
	#speed = 5;
	#claimedBombs = [];
	#currentFrame = {
		ctx: undefined,
		index: 0,
	};
	#animationSheet;

	Spawn(maze, animationSheet = undefined, spawning_point = undefined) {
		this.maze = maze;
		this.cell_in = spawning_point ? maze.GetCellByCoordinate(spawning_point.x, spawning_point.y) : maze.GetCellByCoordinate(0, 0);
		this.#animationSheet = animationSheet;
		this.target_cell = this.cell_in;
		this.movement = {
			isMoving: false,
			direction: undefined,
		};
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
			const dir = directions[this.movement.direction];
			this.position.add(createVector(dir.x, dir.y).mult(this.#speed));
			// this.position.lerp(this.target_cell.absolute_v, this.#speed * deltaTime * 0.001);
			if (this.target_cell.absolute_v.dist(this.position) <= 0.01) {
				this.movement.isMoving = false;
				this.cell_in = this.target_cell;

				this.onReachDestination();
			}
		}
		this.#currentFrame.index += 1;
		const offset = this.maze.cell_length / 2;
		const spritePos = p5.Vector.add(this.position, createVector(1, 1).mult(offset));
		if (this.movement.isMoving && this.#animationSheet) {
			const frameIndex = this.#currentFrame.index % this.#animationSheet[this.movement.direction].length;
			image(this.#animationSheet[this.movement.direction][frameIndex], spritePos.x, spritePos.y);
			this.#currentFrame = {
				ctx: this.#animationSheet[this.movement.direction][0],
				index: frameIndex,
			};
			return;
		}
		if (this.#currentFrame.ctx) {
			image(this.#currentFrame.ctx, spritePos.x, spritePos.y);
			return;
		} else {
			image(this.#animationSheet["Right"][0], spritePos.x, spritePos.y);
			this.#currentFrame.ctx = this.#animationSheet["Right"][0];
		}
	}

	Move(direction, onReachDestination) {
		if (this.movement.isMoving) return;
		if (this.blockByWall(direction)) {
			onReachDestination();
			return;
		}
		this.movement.isMoving = true;
		this.movement.direction = direction;
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
