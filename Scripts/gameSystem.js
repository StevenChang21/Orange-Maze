class gameSystem {
	constructor(maze, player) {
		this.maze = maze;
		this.player = player;
		this.gameState = new InitialState(this);
		this.canvas = document.querySelector("#snap");
		this.ctx = this.canvas.getContext("2d");
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
		const vid = this.getAsset("Video");
		this.canvas.width = vid.videoWidth;
		this.canvas.height = vid.videoHeight;
		this.ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
		return this.ctx;
	}
}
