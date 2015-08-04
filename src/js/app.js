/*jshint loopfunc: true */

/**
 *  Map options
 */

var map,
    infowindow,
    center = {
        lat: 40.7127,
        lng: -74.0059
    },
    mapOptions = {
        center: center,
        zoom: 12,
        maxZoom: 12,
        minZoom: 12,
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

/**
 *  Offline
 */
var heyOffline = new Heyoffline();

/**
 *  View, render marker infowindow
 */
var View = {
    renderPlace: function(place) {
        var str = '<h3>' + place.name + '</h3>';

        if (place.nyTimes.length) {
            str += '<h4>NY Times</h4>';
        }

        place.nyTimes.forEach(function(nyt) {
            str +=  '<li class="article">'+
                        '<a href="' + nyt.url + '">' + nyt.title + '</a>'+
                        '<p>' + nyt.text + '</p>'+
                    '</li>';
        });

        if (place.wikipedia.length) {
            str += '<h4>Wikipedia</h4>';
        }

        place.wikipedia.forEach(function(w) {
            str += '<li><a href="' + w.url + '">' + w.title + '</a></li>';
        });

        infowindow.setContent(str);
        infowindow.open(map, place.marker);
    }
};

/**
 *  ViewModel, octopus
 *  initalization maps and filtering functionality
 */
var ViewModel = function(){
    var self = this;

    self.filter = ko.observable("");
    self.places = ko.observableArray([]);
    self.searchBarStatus = ko.observable(false);

    self.changeSearchBarStatus = function() {
        self.searchBarStatus(!self.searchBarStatus());
    };

    this.init = function() {
    	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	    infowindow = new google.maps.InfoWindow(
            {maxWidth: 200}
        );

	    var service = new google.maps.places.PlacesService(map);
	    service.nearbySearch({
			location: center,
			radius: 5000
	    }, function(results, status) {
	    	if (status == google.maps.places.PlacesServiceStatus.OK) {
		        for (var i = 0; i < results.length; i++) {
		        	var place = new Place(results[i]);

                    (function(p) {
                        google.maps.event.addListener(p.marker, 'click', function() {
                            self.searchBarStatus(false);
                            infowindow.setContent("loading");
                            infowindow.open(map, p.marker);

                            p.populate().then(function (obj) {
                                View.renderPlace(p);
                            });
                        });
                    })(place);

                    place.focus = (function(place) {
                        return function () {
                            self.searchBarStatus(false);
                            infowindow.setContent("loading");
                            infowindow.open(map, place.marker);

                            place.populate().then(function (obj) {
                                View.renderPlace(place);
                            });
                        };
                    })(place);

                    self.places.push(place);
		        }
		    }
	    });
    };

    self.filteredPlaces = ko.computed(function() {
        if(self.filter().length <= 0) {
            return self.places();
        } else {
            return ko.utils.arrayFilter(self.places(), function(item) {
                return item.name.toLowerCase().indexOf(self.filter().toLowerCase()) > -1;
            });
        }
    });

    // main
    this.init();

    /*
     *  key binding cmd+f to open sidebar list
     */
    $(document).keydown(function(e) {
        if (e.metaKey && e.which === 70) {
            e.preventDefault();
            self.searchBarStatus(!self.searchBarStatus());
        }
    });
};

ko.bindingHandlers.koFocus = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var $element = $(element);

        if (value()) {
            $element.focus();
        }
    }
};

ko.applyBindings(new ViewModel());
