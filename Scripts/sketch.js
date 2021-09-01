let game, config;
let debug = false;
let webcamVid;

function preload() {
	webcamVid = document.querySelector("#webcam");
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
			webcamVid.srcObject = stream;
			webcamVid.play();
		});
	}

	config = new configuration();

	//Models
	config.loadAssets(
		"Model",
		{
			Direction: {
				source: "https://teachablemachine.withgoogle.com/models/WXBWVjQDX/", //"https://teachablemachine.withgoogle.com/models/nNtbYUnn-/",
				instanceName: "imageClassifier",
			}, //"https://teachablemachine.withgoogle.com/models/7WRHgCGqz/",
			Vertical: {
				source: {
					model: "../Models/model.json",
					metadata: "../Models/model_meta.json",
					weights: "../Models/model.weights.bin",
				},
				instanceName: "poseClassifier",
			}, //"https://teachablemachine.withgoogle.com/models/gvwdkEKSF/",
			Horizontal: {
				source: "https://teachablemachine.withgoogle.com/models/9r5lWuqRi/",
				instanceName: "imageClassifier",
			},
		},
		(source) => {
			let models = {};
			for (const key in source) {
				const $classifier = eval(`new ${source[key].instanceName}(key)`);
				$classifier
					.load(source[key].source)
					.then((loadedModel) => {
						if (loadedModel) {
							$classifier.model = loadedModel;
						}
						config.onAssetReady();
					})
					.catch((err) => console.log(err));
				models[key] = $classifier;
			}
			return models;
		}
	);

	//Setup webcam video
	// config.loadAssets("Video", { video: VIDEO }, (source) => {
	// 	const video = createCapture(source.video, () => {
	// 		config.onAssetReady();
	// 	}).hide();
	// 	video.size(640, 360);
	// 	return video;
	// });

	config.loadAssets("Difficulty", {
		difficultyOffset: 2,
		difficultySpeed: 1,
		difficultyAcceleration: 0.5,
	});

	//Colors
	config.loadAssets(
		"Color",
		{
			background: color("#FFB740"),
			maze: color("#DF711B"),
			mazeWall: color(255, 213, 126),
			player: color("#64C9CF"),
			target: color(255),
			text: color(200),
			button: color(100),
		},
		(source) => {
			for (let i = 0; i < Object.keys(source).length; i++) {
				config.onAssetReady();
			}
			return source;
		}
	);
}

function setup() {
	createCanvas(900, 700).parent("canvas-container");
	const maze = new Maze(50, 580, 460);
	game = new gameSystem(maze, new Player());

	function onLoadedAssets() {
		game.gameState.gameStatus = "Ready to start game !!!";
		game.gameState.instructionText = "Ready? Open your hand palm \n to start the game !!!";
		game.ready = true;
		game.assets = config.getResourceAssets();
		runEditor();
	}

	if (config.loadAssets) onLoadedAssets();
	else document.addEventListener("OnAllAssetsReady", onLoadedAssets);
}

function draw() {
	background(config.assets.getChildAssetByType("Color").data.background);
	game.update();
}
