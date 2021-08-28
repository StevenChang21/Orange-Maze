class VERTICAL {
	static respond(info) {
		const classifier = game.getClassifierByName("Vertical");
		classifier.classify(game.getFlippedVideo()).then((results) => {
			resultsHandler.handle(results);
		});
	}
}
