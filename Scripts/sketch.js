let game, config;
let debug = false;

function preload() {
	config = new configuration();

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

	config.loadAssets(
		"Image",
		{
			bomb: "../Images/bomb2.png",
		},
		(source) => {
			let imgs = {};
			for (const key in source) {
				loadImage(source[key], (img) => {
					imgs[key] = img;
				});
			}
			return imgs;
		}
	);

	//Colors
	config.loadAssets(
		"Color",
		{
			background: color("#fd9e02"),
			maze: color("#DF711B"),
			mazeWall: color(255, 213, 126),
			player: color("#64C9CF"),
			target: color(255),
			text: color("#023047"),
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
	imageMode(CENTER);
	createCanvas(900, 700).parent("canvas-container");
	const maze = new Maze(70, width, height);
	game = new gameSystem(maze, new Player());

	function onLoadedAssets() {
		game.assets = config.getResourceAssets();
		game.ready = true;
		game.gameState.initiate();
		runEditor();
	}

	if (config.loadedAssets) onLoadedAssets();
	else document.addEventListener("OnAllAssetsReady", onLoadedAssets);
}

function draw() {
	background(config.assets.getChildAssetByType("Color").data.background);
	game.update();
}
