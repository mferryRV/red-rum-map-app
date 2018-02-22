/*
		Marker class
*/

// Establish Marker class
class Marker {

		constructor(htmlId) {
				// Define the current location
				this.floor = "rv1_1";
				this.x = null;
				this.y = null;
				this.room = null;
				// Define acceptable floors
				this.floorList = ['rv1_1', 'rv1_2', 'rv2_1', 'rv2_2', 'rv3_0b', 'rv3_0g', 'rv3_1', 'rv3_2', 'rv3_3', 'rv4_1', 'rv4_2', 'rv5_1', 'rv5_2', 'rv5_3', 'rv5_4', 'rv5_5', 'rv5_6', 'rv6_1', 'rv6_2'];
				// Find the Marker Image
				this.htmlId = htmlId;
				// Tell GTM about it
				dataLayer.push({
						'event': 'markerEstablished',
						'marker': {
								'floor': this.floor,
								'x': this.x,
								'y': this.y,
								'room': this.room
						}
				});
		}

		updateLocation(location) {
				// Update the marker object location
				this.floor = location.floor || this.floor;
				this.x = location.x || null;
				this.y = location.y || null;
				this.room = location.room || null;
				// Update the URL for sharing
				var search = '?floor='+this.floor+(this.x&&this.y?'&x='+this.x+'&y='+this.y+(this.room?'&room='+this.room:''):'')
				window.history.pushState('','',search);
		}

		clearImage() {
				var el = document.getElementById(this.htmlId);
				el.style.display = 'none';
		}

		setImage(x, y) {
				var el = document.getElementById(this.htmlId);
				el.style.display = 'block';
				el.style.left = x;
				el.style.top = y;
		}

		update(updateType, markerInput) {
				var markerUpdate = {};

				// Check for valid floor
				if (this.floorList.indexOf(markerInput.floor) !== -1) {

						// Keep track of the floor to update our Marker object
						markerUpdate.floor = markerInput.floor;

						// Update the map image, if necessary
						if(markerInput.floor !== document.marker.floor) {
								updateMapImage(markerInput.floor);
						}

						// If either x or y is invalid, clear the marker. Otherwise, set the marker
						if (isNaN(parseInt(markerInput.x)) || isNaN(parseInt(markerInput.y))) {

								// Clear the marker, since an update was attempted
								this.clearImage();

								console.error('Location Not Recognized: '+JSON.stringify(markerInput))
						} else {

								// Set the marker in the proper location
								this.setImage(markerInput.x, markerInput.y);

								// Keep track of the location to update our Marker object
								markerUpdate.x = markerInput.x;
								markerUpdate.y = markerInput.y;
						}

						// If we have a room name specified, add that to our update
						markerUpdate.room = markerInput.room || null;

						// Make the update
						this.updateLocation(markerUpdate);

						dataLayer.push({
								'event': 'markerUpdated',
								'updateType': updateType,
								'marker': markerUpdate,
								'input': markerInput,
								'xy-success': (markerInput.x === markerUpdate.x)
						});

				} else if (markerInput.floor) {
						// If there is a floor specified but it is invalid, say so
						console.error('Invalid Floor Selected: '+JSON.stringify(markerInput));

						dataLayer.push({
								'event': 'markerUpdateFailed',
								'updateType': updateType,
								'input': markerInput
						});
				} else {
						// If no floor is specified, do nothing
						console.log('No update needed from '+updateType);
				}

		}
}

/*
		Page Load Functions
*/

// Establish marker instance
document.marker = new Marker('marker');

updateFromUrl();


/*
		Marker Update Functions
*/

function updateFromUrl() {
		if (document.location.search.length !== 0) {
				// Take location parameters from URL
				var marker = document.location.search.replace('?','').split('&').reduce(function(marker,param) {
						var keyVal = param.split('=');
						marker[keyVal[0]] = decodeURIComponent(keyVal[1]);
						return marker;
				},{});

				console.log(marker);

				// Update the current marker
				document.marker.update('url', marker);
		}
}

function updateFromMapClick(click) {
		// Take location parameters from Click
		var marker = {
				'floor': document.marker.floor,
				'x': click.pageX,
				'y': click.pageY
		};

		// Update the current marker
		document.marker.update('click', marker);
}

function updateFromSearch(result) {
		// Take location parameters from Search Result
		var marker = {};

		// Update the current marker
		document.marker.update('search', marker);
}

function updateFromFloorSelection(click) {
		// Take location parameters from Floor Selection
		var marker = {};

		// Update the current marker
		document.marker.update('floor select', marker);
}

/*
		UI Functions
*/

function updateMapImage(floor) {
		// Change image
		var imgSrc = "./img/"+floor+".jpg"
	  document.getElementById("mapImage").src = imgSrc;

	  // Log
	  console.log("changing image to "+floor);
}