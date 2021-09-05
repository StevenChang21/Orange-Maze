class IDLE {
	static respond(info) {
		game.gameState.prediction = info.label;
		game.gameState.resultLabels["class"].innerHTML = info.label;
		game.gameState.resultLabels["probability"].innerHTML = `${info.probability.toFixed(2) * 100} %`;
		const classifier = game.getClassifierByName("Direction");
		setTimeout(() => {
			classifier.classify(game.getFlippedVideo()).then((results) => resultsHandler.handle(results));
		}, 500);
	}
}
