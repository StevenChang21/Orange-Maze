let video, posenet, myPose, skeleton, currentLabel;
let neuralNetwork, myCanvas;
let leftSampleCount = 0;
let rightSampleCount = 0;
let leftSampleCountLabel, rightSampleCountLabel;
let leftSampleContainer, rightSampleContainer;
let collectDataInterval;

function keyPressed() {
	if (leftSampleCount <= 0 || rightSampleCount <= 0) return;
	if (key == "t") {
		const trainingOptions = {
			epochs: 32,
			batchSize: 12,
		};
		neuralNetwork.normalizeData();
		neuralNetwork.train(trainingOptions, function () {
			console.log("Trained model !");
			neuralNetwork.save();
		});
		return;
	}
	if (key == "s") {
		neuralNetwork.saveData();
	}
}

function setup() {
	video = createCapture(VIDEO, () => {
		resizeCanvas(video.width, video.height);
	});
	video.hide();
	myCanvas = createCanvas(video.width, video.height);
	myCanvas.parent("canvas-container");
	leftSampleCountLabel = document.querySelector("#left-sample-count");
	rightSampleCountLabel = document.querySelector("#right-sample-count");
	leftSampleContainer = document.querySelector("#left-sample-container");
	rightSampleContainer = document.querySelector("#right-sample-container");
	const leftSampleButton = document.querySelector("#add-left-sample-button");
	const rightSampleButton = document.querySelector("#add-right-sample-button");
	leftSampleButton.addEventListener("mousedown", () => {
		collectDataInterval = setInterval(() => {
			addSample("Left");
			drawSampleOnCanvas(leftSampleContainer);
			leftSampleCount++;
		}, 500);
	});
	leftSampleButton.addEventListener("mouseup", () => {
		clearInterval(collectDataInterval);
	});

	rightSampleButton.addEventListener("mousedown", () => {
		collectDataInterval = setInterval(() => {
			addSample("Right");
			drawSampleOnCanvas(rightSampleContainer);
			rightSampleCount++;
		}, 500);
	});
	rightSampleButton.addEventListener("mouseup", () => {
		clearInterval(collectDataInterval);
	});

	posenet = ml5.poseNet(video, modelLoaded);
	posenet.on("pose", onPose);

	let options = {
		inputs: 34,
		outputs: 4,
		task: "classification",
		debug: true,
	};
	neuralNetwork = ml5.neuralNetwork(options);
}

function addSample(currentLabel) {
	let inputs = [];
	for (let i = 0; i < myPose.keypoints.length; i++) {
		const obj = myPose.keypoints[i];
		inputs.push(obj.position.x);
		inputs.push(obj.position.y);
	}
	let outputs = [currentLabel];
	neuralNetwork.addData(inputs, outputs);
}

function onPose(result) {
	if (result.length > 0) {
		myPose = result[0].pose;
		skeleton = result[0].skeleton;
	}
}

function drawSampleOnCanvas(parent) {
	var canvas = document.createElement("canvas");
	canvas.className = "sample";
	const ctx = canvas.getContext("2d");
	ctx.drawImage(get().drawingContext.canvas, 0, 0, 320, 100);
	parent.appendChild(canvas);
}

function modelLoaded() {
	console.log("Model loaded !");
}

function draw() {
	translate(video.width, 0);
	scale(-1, 1);
	image(video, 0, 0, video.width, video.height);
	leftSampleCountLabel.innerHTML = `Taken ${leftSampleCount} samples.`;
	rightSampleCountLabel.innerHTML = `Taken ${rightSampleCount} samples.`;
	if (myPose) {
		for (let i = 0; i < myPose.keypoints.length; i++) {
			const obj = myPose.keypoints[i];
			fill("blue");
			ellipse(obj.position.x, obj.position.y, 15, 15);
		}

		for (let i = 0; i < skeleton.length; i++) {
			let a = skeleton[i][0];
			let b = skeleton[i][1];
			strokeWeight(4);
			stroke(255);
			line(a.position.x, a.position.y, b.position.x, b.position.y);
		}
	}
}
