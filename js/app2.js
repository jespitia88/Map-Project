//global variable
var map;
var url;

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
        	info: locations[i].content,
        });

			locations[i].marker = marker;
            marker.addListener('click', function() {

                populateInfoWindow(this, infoWindow);
            });


            function populateInfoWindow(marker, infoWindow) {
                if (infoWindow.marker != marker) {
                    infoWindow.marker = marker;

                    infoWindow.setContent('<div class="title">' + marker.title + '</div>' + '<div class="info">' + marker.info + '</div>'  + '<a title="+' + marker.wikiUrl + '" href="' + marker.wikiUrl + '">' + "Wikipedia" + '</a>');
       
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

        var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback";

        $.ajax({
        	url: wikiUrl,
        	dataType: "jsonp",
        	success: function( response ) {
        		var articleList = response[3];
        		for(var i = 0; i<articleList.length; i++) {
        			articleStr = articleList[i];
        			var url = "http://en.wikipedia.org/wiki/" + articleStr;
        			marker[i].wikiUrl = url;
        		}
        	}
        });
   
    }

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
		name : 'The Parlour',
		location : {lat: 35.9966, lng: -78.9022},
		content: "It's a great day for some ice cream!"
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
		this.url = data.url;
	}

};