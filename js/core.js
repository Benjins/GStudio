function CreateEntity(x, y, renderFunc) {
	var entity = {};
	entity.x = x;
	entity.y = y;
	entity.render = renderFunc;
	
	return entity;
}

var inputData = {
	mouseDown: false,
	mouseX: 0,
	mouseY: 0
};


var allEntities = [];

function renderAllEntities(ctx) {
	for (var idx in allEntities) {
		allEntities[idx].render(ctx);
	}
}

function CreateSprite(url, idx) {
	var sprite = {};
	sprite.isLoaded = false;
	sprite.dataUrl = url;
	
	// TODO: Send http request, get data, add to sprite
	var img = new Image();
	img.onload = function () {
		sprite.isLoaded = true;
		var spriteSelect = document.getElementById('sprite_select');
		var input = document.createElement("input");
		
		var handle = "sprite_radio_" + idx;
		
		input.setAttribute("type", "radio");
		input.setAttribute("name", "sprite_radio");
		input.setAttribute("id", handle);
		input.setAttribute("value", idx);
		input.onclick = function() {
			spritePaintingData.currentlySelectedSprite=parseInt(input.value);
		};
		
		var label = document.createElement("label");
		label.setAttribute("for", handle);
		label.setAttribute("class", "sprite_item");
		label.style.backgroundImage = "url('" + url + "')";
		
		spriteSelect.appendChild(input);
		spriteSelect.appendChild(label);
	}
	
	img.src = url;
	
	sprite.image = img;
	
	return sprite;
}

var allSprites = [];

function AddSprite(url) {
	var idx = allSprites.length;
	allSprites.push(CreateSprite(url, idx));
}

var bgSpriteLayer = [];

// TODO: Check how much garbage this makes
function InitSpriteLayerWithSize(width, height) {
	var layer = [];
	for (var x = 0; x < width; x++) {
		layer[x] = [];
		for (var y = 0; y < height; y++) {
			layer[x].push(-1);
		}
	}
	
	return layer;
}

var spriteSize = 32;

function RenderSpriteLayer(ctx, layer) {
	for (var idxX in layer) {
		for (var idxY in layer[idxX]) {
			var spriteIndex = layer[idxX][idxY];
			if (spriteIndex !== -1) {
				var sprite = allSprites[spriteIndex];
				if (sprite !== null && sprite !== undefined && sprite.isLoaded) {
					ctx.drawImage(sprite.image, idxX * spriteSize, idxY * spriteSize, spriteSize, spriteSize);
				}
			}
		}
	}
}

function RenderGridForSprites(ctx) {
	for (var idxX in bgSpriteLayer) {
		ctx.moveTo(idxX * spriteSize, 0);
		ctx.lineTo(idxX * spriteSize, ctx.canvas.height);
	}
	
	for (var idxY in bgSpriteLayer[0]) {
		ctx.moveTo(0, idxY * spriteSize);
		ctx.lineTo(ctx.canvas.width, idxY * spriteSize);
	}
	
	ctx.strokeStyle = "black";
	ctx.stroke();
}

var spriteLayerSaveKey = '_bgSpriteLayer0';

function SaveSpriteLayer() {
	localStorage[spriteLayerSaveKey] = JSON.stringify(bgSpriteLayer);
}

function LoadSpriteLayer() {
	bgSpriteLayer = JSON.parse(localStorage[spriteLayerSaveKey]);
}

var InteractionMode = {
	BackgroundPainting: 0
};

var currentMode = InteractionMode.BackgroundPainting;

var spritePaintingData = {
	currentlySelectedSprite: -1
};

window.onload = function() {
	{
		// TODO: Defaults, remove this
		AddSprite("https://s.imgur.com/images/favicon-32x32.png");
		AddSprite("https://i.imgur.com/S7fKdJu.gif");
		AddSprite("https://www.codester.com/static/img/smileys/happy.png");
		AddSprite("https://www.lf-empire.de/forum/images/smilies/hmph.png");
		AddSprite("https://78.media.tumblr.com/avatar_3f9e26f4051c_16.pnj");
	}
	
	var canvas = document.getElementById('game_canvas');
	var ctx = canvas.getContext('2d');
	var bgWidth = Math.ceil(canvas.width / spriteSize);
	var bgHeight = Math.ceil(canvas.height / spriteSize);
	
	canvas.onmousedown = function(event) {
		inputData.mouseDown = true;
	}
	
	canvas.onmouseup = function(event) {
		inputData.mouseDown = false;
	}
	
	canvas.onmouseleave = function() {
		inputData.mouseDown = false;
	}
	
	canvas.onmousemove = function(event) {
		var rect = canvas.getBoundingClientRect();
		inputData.mouseX = event.clientX - rect.left;
		inputData.mouseY = event.clientY - rect.top;
	}
	
	var showGridCB = document.getElementById('show_grid_cb');
	
	if (localStorage[spriteLayerSaveKey] != undefined) {
		LoadSpriteLayer();
	} else {
		bgSpriteLayer = InitSpriteLayerWithSize(bgWidth, bgHeight);
	}

	setInterval(function() {
		if (currentMode == InteractionMode.BackgroundPainting) {
			if (inputData.mouseDown) {
				var gridX = Math.floor(inputData.mouseX / spriteSize);
				var gridY = Math.floor(inputData.mouseY / spriteSize);
				bgSpriteLayer[gridX][gridY] = spritePaintingData.currentlySelectedSprite;
			}
		}
	}, 16);
	
	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		if (showGridCB.checked) {
			RenderGridForSprites(ctx);
		}
		RenderSpriteLayer(ctx, bgSpriteLayer);
		renderAllEntities(ctx);
	}, 50);
	
	// TODO: Better way?
	setInterval(SaveSpriteLayer, 1000);
}


