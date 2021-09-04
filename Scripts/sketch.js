let game, config, resultLabel, probabilityLabel;
let debug = false;

function preload() {
	config = new configuration();

	resultLabel = document.querySelector("#result-label");
	probabilityLabel = document.querySelector("#probability-label");

	const webcamVid = document.querySelector("#webcam");
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		//Video
		config.loadAssets("Video", webcamVid, (source) => {
			navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
				webcamVid.srcObject = stream;
				webcamVid.play();
				config.onAssetReady();
			});
			return source;
		});
	}
	//Models
	config.loadAssets(
		"Model",
		{
			Direction: {
				//version 1: "https://teachablemachine.withgoogle.com/models/7WRHgCGqz/"
				//version 2: "https://teachablemachine.withgoogle.com/models/WXBWVjQDX/"
				source: "https://teachablemachine.withgoogle.com/models/ORW4hdSSa/",
				instanceName: "imageClassifier",
			},
			Vertical: {
				source: {
					model: "../Models/model.json",
					metadata: "../Models/model_meta.json",
					weights: "../Models/model.weights.bin",
				},
				instanceName: "poseClassifier",
			}, //"https://teachablemachine.withgoogle.com/models/gvwdkEKSF/",
			Horizontal: {
				//version 1: "https://teachablemachine.withgoogle.com/models/9r5lWuqRi/"
				source: "https://teachablemachine.withgoogle.com/models/tynvznpSm/",
				instanceName: "imageClassifier",
			},
		},
		(source) => {
			let models = {};
			for (const key in source) {
				const $classifier = eval(`new ${source[key].instanceName}(key)`);

				loadModel();

				function loadModel() {
					$classifier
						.load(source[key].source)
						.then((loadedModel) => {
							$classifier.model = loadedModel;
							config.onAssetReady();
						})
						.catch((err) => {
							console.log(err);
							setTimeout(() => location.reload(), 5000);
						});
				}
				models[key] = $classifier;
			}
			return models;
		}
	);

	config.loadAssets("Difficulty", {
		difficultyOffset: 2,
		difficultySpeed: 1,
		difficultyAcceleration: 0.5,
	});

	//Colors
	config.loadAssets(
		"Color",
		{
			background: color("#fd9e02"),
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

	if (config.loadedAssets) onLoadedAssets();
	else document.addEventListener("OnAllAssetsReady", onLoadedAssets);
}

function draw() {
	background(config.assets.getChildAssetByType("Color").data.background);
	game.update();
}
