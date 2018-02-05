// Get map options:
var dropdownOptions =  document.getElementsByClassName("dropdown-option");

// Change display based on URL
changeFromURL(dropdownOptions);

// Initialize Shared URL
// createSharedURL();

// Add event handlers to dropdown menu
handleDropdown(dropdownOptions);


/* Change the image in the map based on URL params or dropdown selections */

// Change map image source URL
function changeImgSrc(id) {
	// Change image
	var imgSrc = "./img/"+id+".jpg"
  document.getElementById("mapImage").src = imgSrc;

  // Log
  console.log("changing image to "+id);
}

// Change map based on URL parameters
function changeFromURL(dropdownOptions) {
	// Grab parameters from the URL, establish document.params as the current location
	document.params = {};
	try {
		document.params = document.location.href.split('?')[1].split('&').reduce(function(obj, param) {
	    var keyValArr = param.split('=');
	    obj[keyValArr[0]] = decodeURIComponent(keyValArr[1]);
	    return obj
		},{});
	}
	catch(err) {
		console.log("no parameters found");
	}

	// Pull possible map IDs out of the dropdown HTML
	var options = Array.prototype.map.call(dropdownOptions, function(el) {
		return el.id;
	});

	// Change the image if the URL supplies a map ID
	if(options.indexOf(document.params.id) !== -1) {
			changeImgSrc(document.params.id);
			setMarker(document.params);
	} else if (document.params.id || document.params.x || document.params.y) {
		document.params = {};
		alert("Location not recognized!");
	}

	// Set the market if the URL supplies a location

}

// Change map based on dropdown selections
function changeFromDropdown(id) {
	changeImgSrc(id);
}

/* Handle map markers & sharing URL */

/* Handle dropdown menu functionality  */

// When the user clicks on the button, toggle between hiding and showing the dropdown content 
function toggleDropdown() {
		// Open/Close Dropdown
    document.getElementById("myDropdown").classList.toggle("show");

}

// On page-load, add all necessary event listeners to the dropdown menu
function handleDropdown(dropdownOptions) {

	// Close the dropdown menu if the user clicks outside of it
	window.onclick = function(event) {
	  if (!event.target.matches('.dropbtn')) {

	    var dropdowns = document.getElementsByClassName("dropdown-content");
	    var i;
	    for (i = 0; i < dropdowns.length; i++) {
	      var openDropdown = dropdowns[i];
	      if (openDropdown.classList.contains('show')) {
	        openDropdown.classList.remove('show');
	      }
	    }
	  }
	}

	// Handle dropdown changes with event listener
	Array.prototype.forEach.call(dropdownOptions,function(el) {
		el.addEventListener('click', function() {
			changeFromDropdown(el.id);
			clearMarker();
			updateSharedURL("clear", {"id": el.id});
	  }, false);
	});
}

import Messages from '/modules/messages.js';
import Notify from '/modules/notify.js';
import copyToClipboard from '/modules/clipboard.js'

var MapElements = {
	Map: {
		src: '/img/rv1_1.png',
		size: [1600, 1151],
		position: [0, 0],
		drawnImage: null
	},
	Star: {
		src: '/img/star.svg',
		size: [64, 64],
		radius: 32,
		position: [0, 0],
		drawnImage: null
	}
}

var rvmap = MapElements.Map;
var mapStar = MapElements.Star;

var canvas = null;
var ctx = null;
var siteMap = null;

function intialDraw() {

	function createMap() {

		rvmap.drawnImage = new Image(rvmap.size[0], rvmap.size[1]);

		rvmap.drawnImage.onload = function() {
			canvas.width = rvmap.size[0];
			canvas.height = rvmap.size[1];
	
			ctx.drawImage(rvmap.drawnImage, rvmap.position[0], rvmap.position[0], rvmap.size[0], rvmap.size[1]);

			mapStar.drawnImage = new Image(mapStar.size[0], mapStar.size[1]);
			mapStar.position = mapStar.position.toString();
			mapStar.onload = function() {
				ctx.drawImage(mapStar.drawnImage, mapStar.position[0], mapStar.position[1]);
			}
			mapStar.drawnImage.src = mapStar.src;
			siteMap = mapStar.drawnImage;
		};
	
		rvmap.drawnImage.src = rvmap.src;
	}

	createMap();
}

function draw() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	canvas.width = rvmap.size[0];
	canvas.height = rvmap.size[1];

	if (typeof rvmap.drawnImage === 'object') {
		rvmap.drawnImage.position = rvmap.position.toString();
		ctx.drawImage(rvmap.drawnImage, rvmap.position[0], rvmap.position[0], rvmap.size[0], rvmap.size[1]);
	}

	if (typeof siteMap === 'object') {
		siteMap.position = mapStar.position.toString();
		ctx.drawImage(siteMap, mapStar.position[0], mapStar.position[1]);
	}
}

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

// Map as Canvas element
intialDraw();

HTMLCanvasElement.prototype.relMouseCoords = function (event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while (currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    // Fix for variable canvas width
    canvasX = Math.round( canvasX * (this.width / this.offsetWidth) );
	canvasY = Math.round( canvasY * (this.height / this.offsetHeight) );
	
	var starRadius = MapElements.Star.radius; // radius of star icon

    return [canvasX - starRadius, canvasY - starRadius]
}

canvas.addEventListener('click', function(event) {
	MapElements.Star.position = canvas.relMouseCoords(event);
	draw();

	// if star position is near room in lookup table
	// then return room number and name
	// then create link
	// update history state

	var CanShareLink = true;

	if (CanShareLink) {
		copyToClipboard('https://campusmap.rvapps.io/?room=3110')
		// Send Notification
		Notify(Messages.COPY_EVENT);
	}

});