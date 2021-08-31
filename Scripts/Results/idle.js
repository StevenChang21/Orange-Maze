class IDLE {
	static respond(info) {
		game.gameState.prediction = info.label;
		const classifier = game.getClassifierByName("Direction");
		classifier.classify(game.getFlippedVideo()).then((results) => resultsHandler.handle(results));
	}
}
