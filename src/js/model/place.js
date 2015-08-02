/**
 *  Place model
 *	populate function, nyt and wikipedia services to populate data
 */
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
            }

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
    };

    return self;
};
