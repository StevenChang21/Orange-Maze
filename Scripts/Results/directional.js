class DIRECTIONAL {
	static respond({ result, direction }) {
		const classifier = game.getClassifierByName("Direction");
		if (typeof result.probability === "string") {
			result.probability = parseFloat(result.probability);
		}
		const resultProbability = result.probability.toFixed(2) * 100;
		function repeatClassification() {
			classifier.classify(game.getFlippedVideo()).then((result) => {
				resultsHandler.handle(result);
			});
		}
		if (resultProbability < 75) {
			repeatClassification();
			return;
		}
		game.gameState.resultLabels.probability.innerHTML = `${resultProbability} %`;
		game.gameState.resultLabels.class.innerHTML = result.label;
		game.player.Move(direction, repeatClassification);
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
