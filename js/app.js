//global variable
var map;

function initMap() {
//creates map and centers on Durham, NC
    map = new google.maps.Map(document.getElementById('map'), {
     	center: {lat: 35.9940, lng: -78.8986},
     	zoom: 13
     	});
   
    var infoWindow = new google.maps.InfoWindow();
//loops through locations array and creates markers for each location
    for (i = 0; i < locations.length; i++) {
           	var marker = new google.maps.Marker({
        	position: locations[i].location,
        	map: map,
        	title: locations[i].name,
        	info: locations[i].content,
        });

			locations[i].marker = marker;
            marker.addListener('click', function() {

                populateInfoWindow(this, infoWindow);
            });
   
    }

//creates infowindow with title of marker, information about the location, and a link to wikipedia page

        function populateInfoWindow(marker, infoWindow) {
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
       
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 700);
            infoWindow.open(map, marker);
            infoWindow.addListener('closeclick', function() {
            	infoWindow.setMarker = null;
            });
        }

        var content;
        content = '<div class="title">' + marker.title + '</div>' + '<div class="info">' + marker.info + '</div>'  + '<a title="+' + marker.wikiUrl + '" href="' + marker.wikiUrl + '">' + "Wikipedia" + '</a>';
      

        infoWindow.setContent(content);
    } 

//applies bindings to the view model
    var viewModel = new ViewModel();
	ko.applyBindings(viewModel);

};


//Model

var locations = [
	{
		name : 'Museum of Life and Science',
		location : {lat: 36.0292, lng: -78.8993},
		content: "Come learn about science!"
	},
	{
		name : 'Durham Performing Arts Center',
		location : {lat: 35.9932, lng: -78.9022},
		content: "Dpac has tons of great broadway shows!"
	},
	{
		name : 'Counter Culture Coffee',
		location : {lat: 35.9963, lng: -78.8883},
		content: "Best coffee in town!"
	},
	{
		name : 'Duke University',
		location : {lat: 36.0055, lng: -78.9148},
		content: "Take some classes at Duke!"
	},
	{
		name : 'Durham School of the Arts',
		location : {lat: 36.0023, lng: -78.9061},
		content: "Great public school dedicated to the arts!"
	}

];

//ViewModel

var ViewModel = function() {
	var self = this;

	self.allPlaces = [];
	self.visiblePlaces = ko.observableArray();

	locations.forEach(function(place) {
		var loc = new Place(place);
		self.allPlaces.push(loc);
		self.visiblePlaces.push(loc);
	});

	self.userInput = ko.observable('');
//filters locations
	self.filterMarkers = function() {
		var searchInput = self.userInput().toLowerCase();

		self.visiblePlaces.removeAll();

		self.allPlaces.forEach(function(place) {
			place.marker.setVisible(false);

			if(place.name.toLowerCase().indexOf(searchInput) !== -1) {
				self.visiblePlaces.push(place);
				place.marker.setVisible(true);
			}
		});

//map marker bounces when location is clicked
		self.showLocation = function(place) {
        google.maps.event.trigger(place.marker, 'click');
    };
};

//constructor function that creates instances of the locations and attaches properties to the locations
	function Place(data) {
		this.name = data.name;
		this.location = data.location;
		this.marker = data.marker;

		var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + data.name + "&format=json&callback=wikiCallback";
		var wikiRequestTimeout = setTimeout(function() {
			alert("failed to load wikipedia pages");
		}, 3000);
//wikipedia api
        $.ajax({
        	url: wikiUrl,
        	dataType: "jsonp",
        	success: function( response ) {      		
        		var articleList = response[3][0];
        		var url = articleList;
        		data.marker.wikiUrl = url;
        		
        		clearTimeout(wikiRequestTimeout);
        	}
        });
	};
};