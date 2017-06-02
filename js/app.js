//global variable
var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
     	center: {lat: 35.9940, lng: -78.8986},
     	zoom: 13
     	});
   
    var infoWindow = new google.maps.InfoWindow();

    for (i = 0; i < locations.length; i++) {
           	var marker = new google.maps.Marker({
        	position: locations[i].location,
        	map: map,
        	title: locations[i].name,
        	info: locations[i].content
        });

			locations[i].marker = marker;
            marker.addListener('click', function() {

                populateInfoWindow(this, infoWindow);
            });


            function populateInfoWindow(marker, infoWindow) {
                if (infoWindow.marker != marker) {
                    infoWindow.marker = marker;

                    infoWindow.setContent('<div class="title">' + marker.title + '</div>' + marker.info);
       
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 2130);
                    infoWindow.open(map, marker);
                    infoWindow.addListener('closeclick', function() {
                        infoWindow.setMarker = null;
                    });
                }
            } 

   }

    var viewModel = new ViewModel();
	ko.applyBindings(viewModel);

}


//Model

var locations = [
	{
		name : 'Durham Bulls Stadium',
		location : {lat: 35.9917, lng: -78.9041},
		content: "Come grab a hotdog and watch the game!"
	},
	{
		name : 'Durham Performing Arts Center',
		location : {lat: 35.9932, lng: -78.9022},
		content: "Dpac h as tons of great broadway shows!"
	},
	{
		name : 'Elmo\'s Diner',
		location : {lat: 36.0104, lng: -78.9218},
		content: "Best bowl of soup in town!"
	},
	{
		name : 'The Parlour',
		location : {lat: 35.9966, lng: -78.9022},
		content: "It's a great day for some ice cream!"
	},
	{
		name : 'Motorco',
		location : {lat: 36.0036, lng: -78.9004},
		content: "Local venue, local shows!"
	}

];

//ViewModel

var ViewModel = function() {
	var self = this;

	self.allPlaces = [];
	locations.forEach(function(place) {
		self.allPlaces.push(new Place(place));
	});

	self.visiblePlaces = ko.observableArray();

	self.allPlaces.forEach(function(place) { 
		self.visiblePlaces.push(place);
		});

	self.userInput = ko.observable('');

	self.filterMarkers = function() {
		var searchInput = self.userInput().toLowerCase();

		self.visiblePlaces.removeAll();

		self.allPlaces.forEach(function(place) {
			place.marker.setVisible(false);

			if(place.name.toLowerCase().indexOf(searchInput) !== -1) {
				self.visiblePlaces.push(place);
			}
		});

		self.visiblePlaces().forEach(function(place) {
			place.marker.setVisible(true);
		});
	};


	function Place(data) {
		this.name = data.name;
		this.location = data.location;
		this.marker = data.marker;
	}

};