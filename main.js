// Get map options:
var dropdownOptions =  document.getElementsByClassName("dropdown-option");

document.getElementById('search').focus();
// Change display based on URL
changeFromURL(dropdownOptions);

// Initialize Shared URL
createSharedURL();

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

// Add marker when the map is clicked
function mapClick(e) {

	let mapDimension = e.target.getBoundingClientRect();

	let clickLocation = {
		x: e.clientX - mapDimension.left,
		y: e.clientY - mapDimension.top
	};

  setMarker(clickLocation);
  // Update the sharing URL with the click location
  updateSharedURL("upsert", clickLocation);
}

function setMarker(clickLocation) {
	with(document.getElementById('marker'))
  {
    style.left = clickLocation.x - 35;
		style.top = clickLocation.y - 25;
    style.display = 'block';
  }
}

function clearMarker() {
	with(document.getElementById('marker'))
	{
		style.display = 'none';
	}
}

function createSharedURL() {
		// Iterate through the existing parameters, append them to a shareable URL
		var shareUrl = Object.keys(document.params).reduce(function(url, parameter) {
				return url + (url.indexOf('?') === -1 ? '?' : '&') + parameter + "=" + document.params[parameter]
		},document.location.href.split('?')[0]);
		document.getElementById('share').value = shareUrl;
		try {
			window.history.pushState('','','?'+shareUrl.split('?')[1]);
		} catch(e) {
			console.log(e);
		}
		dataLayer.push({'event': 'locationUpdated', 'location': document.params});
}

function updateSharedURL(type, locationObj) {
		// Edit the document.params object to store current location
		if (type === 'clear') {
				document.params = locationObj;
		} else if (type === 'upsert') {
				Object.keys(locationObj).forEach(function(key) {
					document.params[key] = locationObj[key];
				})
		}
		createSharedURL();
}

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



