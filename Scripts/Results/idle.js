class IDLE {
	static respond(info) {
		game.gameState.prediction = info.label;
		resultLabel.innerHTML = info.label;
		probabilityLabel.innerHTML = `${info.probability.toFixed(2) * 100} %`;
		const classifier = game.getClassifierByName("Direction");
		classifier.classify(game.getFlippedVideo()).then((results) => resultsHandler.handle(results));
	}
}
