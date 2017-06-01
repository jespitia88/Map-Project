$(function() {

    var model = {
   
    };


    var octopus = {
    

        init: function() {
            view.init();
        }
    };


    var view = {
        init: var map;
      function initMap() {
        // Constructor function creates a map
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 35.9940, lng: -78.8986},
          zoom: 14
          });

        }
            this.render();
        },

        render: function() {
            // Cache vars for use in forEach() callback (performance)
           
        }
    };

    octopus.init();
}());
