let video, posenet, myPose, skeleton, currentLabel;
let neuralNetwork, state, myCanvas;
let leftSampleCount = 0;
let rightSampleCount = 0;
let leftSampleCountLabel, rightSampleCountLabel, timer;
const prepareTime = 3;
const collectTime = 2;
let leftSampleContainer, rightSampleContainer;
let frame;

function keyPressed() {
	if (state == "collecting") return;
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
	} else {
		if (key == "l") {
			currentLabel = "Left";
		} else if (key == "r") {
			currentLabel = "Right";
		} else {
			return;
		}

		timer.innerHTML = `Prepare your pose, starting to take <u>${currentLabel}</u> samples ...`;
		timer.style.display = "block";

		let timeLeft = prepareTime;
		const prepareCountdown = setInterval(() => {
			timer.innerHTML = `Taking <u>${currentLabel}</u> samples in ${timeLeft}`;
			timeLeft--;
			if (timeLeft < 0) {
				timer.innerHTML = `Started taking <u>${currentLabel}</u> samples`;
				clearInterval(prepareCountdown);
				timeLeft = collectTime;
				state = "collecting";
				const collectCountdown = setInterval(() => {
					timer.innerHTML = `Stop taking <u>${currentLabel}</u> samples in ${timeLeft}`;
					timeLeft--;
					if (timeLeft < 0) {
						clearInterval(collectCountdown);
						state = "idle";
						timer.style.display = "none";
					}
				}, 1000);
			}
		}, 1000);
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

	document.querySelectorAll(".accordion-button").forEach((button) => {
		button.addEventListener("click", () => {
			// const accordionContent = button.nextElementSibling;
			button.classList.toggle("accordion-button--active");
			// if (button.classList.contains("accordion-button--active")) {
			// 	accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
			// } else {
			// 	accordionContent.style.maxHeight = 0;
			// }
		});
	});

	timer = document.querySelector("#timer");
	posenet = ml5.poseNet(video, modelLoaded);
	posenet.on("pose", onPose);

	let options = {
		inputs: 34,
		outputs: 4,
		task: "classification",
		debug: true,
	};
	neuralNetwork = ml5.neuralNetwork(options);
	state = "Idle";
}

function onPose(result) {
	if (result.length > 0) {
		myPose = result[0].pose;
		skeleton = result[0].skeleton;
		//console.log(myPose);
		if (state == "collecting") {
			let inputs = [];
			for (let i = 0; i < myPose.keypoints.length; i++) {
				const obj = myPose.keypoints[i];
				inputs.push(obj.position.x);
				inputs.push(obj.position.y);
			}
			let outputs = [currentLabel];
			neuralNetwork.addData(inputs, outputs);
			if (currentLabel == "Left") {
				drawSampleOnCanvas(leftSampleContainer);
				leftSampleCount++;
			} else if (currentLabel == "Right") {
				drawSampleOnCanvas(rightSampleContainer);
				rightSampleCount++;
			}
		}
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
