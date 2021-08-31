class gameSystem {
	constructor(maze, player) {
		this.maze = maze;
		this.player = player;
		this.gameState = new InitialState(this);
	}

	getAsset(type) {
		return this.assets.getChildAssetByType(type).data;
	}

	update() {
		this.gameState.execute();
	}

	changeState(state) {
		new state(this);
	}

	getClassifierByName(name) {
		const classifiers = this.assets.getChildAssetByType("Model").data;
		for (const key in classifiers) {
			if (key === name) {
				return classifiers[key];
			}
		}
		return undefined;
	}

	getFlippedVideo() {
		const vid = this.assets.getChildAssetByType("Video").data;
		const flippedVid = ml5.flipImage(vid);
		return flippedVid;
	}
}
