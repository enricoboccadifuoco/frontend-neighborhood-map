/**
 *  Ajax Services, nyTimesService
 *
 *  @return promise
 */
var nyTimesService = function(search) {

    if (search) {
        var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + search + '&page=0&sort=newest&api-key=5b283515d351e3a4795aa7be7d9455cb:18:72435683';
        return $.getJSON(nytimesUrl);
    }

    return false;
};

/**
 *  Ajax Services, wikiSerivice
 *
 *  @return promise
 */
var wikiSerivice = function(search) {

    if (search) {
        var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search + "&callback=wikiCallback&format=json";

        return $.ajax(wikiUrl, {
            dataType: "jsonp"
        });
    }

    return false;
};
