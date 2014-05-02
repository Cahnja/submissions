var VORON = {
	canvas : document.getElementById("canvas"),
	pointSet : [],
	vPolygons : [],
};

// With thanks to Wolfenstein3D-browser
VORON.setConsts = function(C) {
    for (var a in C) {
        if (C.hasOwnProperty(a) && !(a in VORON)) {
            VORON[a] = C[a];
        }
    }
}

//If v is undefined, return d, else return v
VORON.defaultTo = function(v, d) {
    return typeof v != "undefined" ? v : d;
}

VORON.setup = function() {
	console.log("Setting up Voronoi");
	
	VORON.setConsts({
		ctx : canvas.getContext("2d"),
	});

	// generate points
	for (var i = 0; i < VORON.NUM_POINTS; i++) {
		VORON.Poly.generatePoint();
	}
	// generate underlying grid
	VORON.Poly.generatePolyGrid();

	console.log("Done setting up Voronoi");
};

VORON.run = function() {
	VORON.Renderer.render();

	setTimeout(VORON.run, 0);
};

window.onload = function() {
	VORON.Renderer.setup();
	VORON.setup();
	VORON.run();
};
