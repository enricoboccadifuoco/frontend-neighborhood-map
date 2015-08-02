module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n',
            },
            dist: {
                src: ['src/js/services/*.js', 'src/js/model/*.js', 'src/js/*.js'],
                dest: 'build/main.js'
            }
        },
        uglify: {
            dist: {
                src: ['build/main.js'],
                dest: 'build/main.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};
