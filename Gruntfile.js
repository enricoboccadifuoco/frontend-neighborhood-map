module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n',
            },
            dist: {
                src: ['src/js/services/*.js', 'src/js/model/*.js', 'src/js/*.js'],
                dest: 'dist/main.js'
            }
        },
        uglify: {
            dist: {
                src: ['dist/main.js'],
                dest: 'dist/main.min.js'
            }
        },
        jshint: {
            beforeconcat: ['src/**/*.js'],
            afterconcat: ['dist/main.js']
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/main.css': ['src/**/*.css']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html',
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'cssmin', 'htmlmin']);

};
