var nyTimesService = function(search) {

    if (search) {
        var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + search + '&page=0&sort=newest&api-key=5b283515d351e3a4795aa7be7d9455cb:18:72435683';
        return $.getJSON(nytimesUrl);
    }

    return false;
}

var wikiSerivice = function(search) {

    if (search) {
        var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search + "&callback=wikiCallback&format=json";

        return $.ajax(wikiUrl, {
            dataType: "jsonp"
        });
    }

    return false;
}

// model
var Place = function(place) {
	var self = this;

    self.name = place.name;
    self.marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    self.nyTimes = [];
    self.wikipedia = [];

    self.populate = function() {
        var deferred = $.Deferred();

        $.when(
            nyTimesService(self.name),
            wikiSerivice(self.name)
        ).then(function(response, response2) {
            articles = response[0].response.docs;

            for (var i = 0; i < articles.length; i++) {
                var article = articles[i];

                self.nyTimes.push({
                    url: article.web_url,
                    title: article.headline.main,
                    text: article.snippet
                });
            };

            var articleList = response2[0][1];

            articleList.forEach(function(article) {
                var url = "http://en.wikipedia.org/wiki/" + article;
                self.wikipedia.push({
                    url: url,
                    title: article
                });
            });

            deferred.resolve(self);

        });

        return deferred;
    }

    return self;
};

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
}

//octopus
var ViewModel = function(){
    var self = this;

    self.filter = ko.observable("");
    self.places = ko.observableArray([]);

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
                            infowindow.setContent("loading");
                            infowindow.open(map, p.marker);

                            p.populate().then(function (obj) {
                                View.renderPlace(p);
                            });
                        });
                    })(place);

                    place.focus = (function(place) {
                        return function () {
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
    }

    this.filteredPlaces = ko.computed(function() {
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
};

ko.applyBindings(new ViewModel());
