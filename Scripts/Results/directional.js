class DIRECTIONAL {
	static respond({ result, direction }) {
		const classifier = game.getClassifierByName("Direction");
		game.gameState.prediction = result.label;
		game.player.Move(direction, () =>
			classifier.classify(game.getFlippedVideo()).then((result) => {
				resultsHandler.handle(result);
			})
		);
	}
}

class UP {
	static respond(result) {
		DIRECTIONAL.respond({
			result,
			direction: "Up",
		});
	}
}

class DOWN {
	static respond(result) {
		DIRECTIONAL.respond({
			result,
			direction: "Down",
		});
	}
}

class LEFT {
	static respond(result) {
		DIRECTIONAL.respond({
			result,
			direction: "Left",
		});
	}
}

class RIGHT {
	static respond(result) {
		DIRECTIONAL.respond({
			result,
			direction: "Right",
		});
	}
}
