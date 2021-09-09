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
					config.onAssetReady();
				});
			}
			return imgs;
		}
	);

	config.loadAssets(
		"AnimationSheet",
		{
			Up: [
				"../Images/MoveAnim-sheet/Front.jpeg",
				"../Images/MoveAnim-sheet/Front (1).jpeg",
				"../Images/MoveAnim-sheet/Front (2).jpeg",
				"../Images/MoveAnim-sheet/Front (3).jpeg",
				"../Images/MoveAnim-sheet/Front (4).jpeg",
			],
			Down: [
				"../Images/MoveAnim-sheet/Back.jpeg",
				"../Images/MoveAnim-sheet/Back (1).jpeg",
				"../Images/MoveAnim-sheet/Back (2).jpeg",
				"../Images/MoveAnim-sheet/Back (3).jpeg",
				"../Images/MoveAnim-sheet/Back (4).jpeg",
			],
			Left: [
				"../Images/MoveAnim-sheet/Left.jpeg",
				"../Images/MoveAnim-sheet/Left (2).jpeg",
				"../Images/MoveAnim-sheet/Left (3).jpeg",
				"../Images/MoveAnim-sheet/Left (4).jpeg",
				"../Images/MoveAnim-sheet/Left (5).jpeg",
			],
			Right: [
				"../Images/MoveAnim-sheet/Right.jpeg",
				"../Images/MoveAnim-sheet/Right (1).jpeg",
				"../Images/MoveAnim-sheet/Right (2).jpeg",
				"../Images/MoveAnim-sheet/Right (3).jpeg",
				"../Images/MoveAnim-sheet/Right (4).jpeg",
			],
		},
		(source) => {
			let animationSheet = {};
			for (const key in source) {
				const sheets = [];
				source[key].forEach((frame) => {
					loadImage(frame, (img) => {
						sheets.push(img);
						if (sheets.length >= source[key].length) config.onAssetReady();
					});
				});
				animationSheet[key] = sheets;
			}
			return animationSheet;
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
