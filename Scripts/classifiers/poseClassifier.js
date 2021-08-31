class poseClassifier extends classifier {
	constructor(name, model) {
		super(name, model);
	}

	async classify(data) {
		const poses = await this.poseNet.multiPose(data).catch((err) => console.log(err));
		if (!poses || poses.length <= 0) {
			console.log("No pose");
			return {
				label: "Idle",
				probability: 1,
			};
		}
		const pose = poses[0].pose;
		let inputs = [];
		for (let i = 0; i < pose.keypoints.length; i++) {
			let x = pose.keypoints[i].position.x;
			let y = pose.keypoints[i].position.y;
			inputs.push(x, y);
		}
		const prediction = await this.neuralNetwork.classify(inputs).catch((err) => console.log(err));
		return {
			label: prediction[0].label,
			probability: prediction[0].confidence.toFixed(2),
			poses: pose.keypoints,
		};
	}

	async load(modelInfo) {
		const nnOptions = {
			inputs: 34,
			outputs: 4,
			task: "classification",
			debug: true,
		};
		const posenetOptions = {
			flipHorizontal: true,
		};
		this.neuralNetwork = ml5.neuralNetwork(nnOptions);
		this.poseNet = await ml5.poseNet(undefined, posenetOptions);
		return this.neuralNetwork.load(modelInfo).catch((err) => console.log(err));
	}

	gotPoses(poses) {
		if (poses.length > 0) {
			this.pose = poses[0].pose;
			this.skeleton = poses[0].skeleton;
		}
	}
}
