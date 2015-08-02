module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n',
            },
            dist: {
                src: ['src/js/services/*.js', 'src/js/model/*.js', 'src/js/*.js'],
                dest: 'build/js/main.js'
            }
        },
        uglify: {
            dist: {
                src: ['build/js/main.js'],
                dest: 'build/js/main.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};
