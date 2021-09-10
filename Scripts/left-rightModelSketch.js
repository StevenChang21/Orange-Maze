let video;
let poseNet;
let pose;
let skeleton;

let brain;
let leftConfidenceLabel, rightConfidenceLabel, leftResultLabels, rightResultLabels;

function setup() {
	const canvas = createCanvas(640, 480);

	canvas.parent(document.querySelector("#canvas-container"));
	leftConfidenceLabel = document.querySelector("#left-probability");
	rightConfidenceLabel = document.querySelector("#right-probability");
	leftResultLabels = document.querySelector("#left-result-labels");
	rightResultLabels = document.querySelector("#right-result-labels");
	video = createCapture(VIDEO);
	video.hide();
	poseNet = ml5.poseNet(video, modelLoaded);
	poseNet.on("pose", gotPoses);

	let options = {
		inputs: 34,
		outputs: 4,
		task: "classification",
		debug: true,
	};
	brain = ml5.neuralNetwork(options);
	const modelInfo = {
		model: "models/model.json",
		metadata: "models/model_meta.json",
		weights: "models/model.weights.bin",
	};
	brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
	console.log("pose classification ready!");
	classifyPose();
}

function classifyPose() {
	if (pose) {
		let inputs = [];
		for (let i = 0; i < pose.keypoints.length; i++) {
			let x = pose.keypoints[i].position.x;
			let y = pose.keypoints[i].position.y;
			inputs.push(x);
			inputs.push(y);
		}
		brain.classify(inputs, gotResults);
	} else {
		setTimeout(classifyPose, 1000);
	}
}

function gotResults(error, results) {
	if (error) {
		return;
	}
	results.forEach((result) => {
		if (result.label === "Left") {
			updateLabel(leftConfidenceLabel, result.confidence * 100);
			leftResultLabels.style.backgroundColor = `rgba(2, 48, 71,${result.confidence.toFixed(2)})`;
		}

		if (result.label === "Right") {
			updateLabel(rightConfidenceLabel, result.confidence * 100);
			rightResultLabels.style.backgroundColor = `rgba(2, 48, 71,${result.confidence.toFixed(2)})`;
		}
	});
	classifyPose();
}

function updateLabel(confidenceLabel, confidence) {
	confidenceLabel.innerHTML = `${confidence.toFixed(2)} %`;
}

function gotPoses(poses) {
	if (poses.length > 0) {
		pose = poses[0].pose;
		skeleton = poses[0].skeleton;
	}
}

function modelLoaded() {
	console.log("poseNet ready");
}

function draw() {
	translate(video.width, 0);
	scale(-1, 1);
	image(video, 0, 0, video.width, video.height);

	if (pose) {
		for (let i = 0; i < skeleton.length; i++) {
			let a = skeleton[i][0];
			let b = skeleton[i][1];
			strokeWeight(2);
			stroke(0);

			line(a.position.x, a.position.y, b.position.x, b.position.y);
		}
		for (let i = 0; i < pose.keypoints.length; i++) {
			let x = pose.keypoints[i].position.x;
			let y = pose.keypoints[i].position.y;
			fill(0);
			stroke(255);
			ellipse(x, y, 16, 16);
		}
	}
}
