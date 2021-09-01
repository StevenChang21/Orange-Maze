class resultsHandler {
	static handle(prediction) {
		const results = prediction.label.toUpperCase();
		const resultsObject = eval(`${results}`);
		if (!resultsObject) {
			console.log("Result is invalid !!!");
			return;
		}
		const currentGameState = game.gameState;
		if (!(currentGameState instanceof PlayState)) {
			console.log(`Respond aborted as current game state is not in play state!!!`);
			return;
		}
		// console.log(prediction);
		resultsObject.respond(prediction);
	}
}
