function CreateEntity(x, y, renderFunc) {
	var entity = {};
	entity.x = x;
	entity.y = y;
	entity.render = renderFunc;
	
	return entity;
}


var allEntities = [];

function renderAllEntities(ctx) {
	for (var idx in allEntities) {
		allEntities[idx].render(ctx);
	}
}

function CreateSprite(url) {
	var sprite = {};
	sprite.isLoaded = false;
	sprite.dataUrl = url;
	
	// TODO: Send http request, get data, add to sprite
	var img = new Image();
	img.onload = function () {
		sprite.isLoaded = true;
	}
	
	img.src = url;
	
	sprite.image = img;
	
	return sprite;
}

var allSprites = [];

// TODO: Defaults, remove this
allSprites.push(CreateSprite("https://s.imgur.com/images/favicon-32x32.png"));
allSprites.push(CreateSprite("https://i.imgur.com/S7fKdJu.gif"));
allSprites.push(CreateSprite("https://www.codester.com/static/img/smileys/happy.png"));
allSprites.push(CreateSprite("https://www.lf-empire.de/forum/images/smilies/hmph.png"));
allSprites.push(CreateSprite("https://78.media.tumblr.com/avatar_3f9e26f4051c_16.pnj"));

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

var spriteSize = 16;

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

window.onload = function() {
	var canvas = document.getElementById('game_canvas');
	var ctx = canvas.getContext('2d');
	var bgWidth = Math.ceil(canvas.width / spriteSize);
	var bgHeight = Math.ceil(canvas.height / spriteSize);
	bgSpriteLayer = InitSpriteLayerWithSize(bgWidth, bgHeight);

	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		RenderSpriteLayer(ctx, bgSpriteLayer);
		renderAllEntities(ctx);
	}, 33);
}



