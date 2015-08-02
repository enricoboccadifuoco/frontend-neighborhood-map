## Frontend Neighborhood map

### Getting started

####How to run

1. local
    ```bash
    cd /path/to/frontend-neighborhood-map

    npm update
    bower update

    python -m SimpleHTTPServer 8080
    ```

####Grunt taks

1. uglify task

    ``` bash
    grunt minifyHtml
    ```

1. pagespeed ngrok task

    ``` bash
    grunt psi-ngrok
    ```

### Optimizations

####Part 1: Optimized PageSpeed Insights score for index.html
- web Font removed, cause a render-blocking in pagespeed
- added small Css in html>style to reduce the number of resources
- adding media="print" attribute in link stylesheet
- reduced images size and resolution

####Part 2: Optimized Frames per Second in pizza.html

- querySelector replaced with getElementById
- querySelectorAll replaced with getElementsByClassName
- improved performance for changePizzaSizes function
- collecting dom elements outside loop, if possible
- variables declaration outside of loops, if possible
- adding "tranform property" instead of "left property" in updatePositions function to move background pizzas
- calculate background Pizzas based of window width and height
