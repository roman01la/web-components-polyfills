'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      optimize: {
        files: {
          'build/web-components-polyfills.min.js': [
            'src/document.currentScript.js',
            'src/shadow-dom.js',
            'src/document.registerElement.js',
            'src/html-imports.js'
          ]
        },
        options: {
          wrap: true,
          sourceMap: true,
          sourceMapName: 'build/web-components-polyfills.min.js.map'
        }
      },
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify:optimize']);

};