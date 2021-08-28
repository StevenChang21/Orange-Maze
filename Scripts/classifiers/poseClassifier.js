class poseClassifier extends classifier {
	constructor(name, model) {
		super(name, model);
	}

	async classify(data) {
		super.classify(data);
		const { pose, posenetOutput } = await this.model.estimatePose(data);
		const prediction = await this.model.predict(posenetOutput);
		console.log(prediction[0].className);
		return {
			label: prediction[0].className,
			probability: prediction[0].probability.toFixed(2),
		};
	}
}
