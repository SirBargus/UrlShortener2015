module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //Configuracion del nodemon
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },

    //Configuracion del watch
    watch: {
      all: {
        options: {
          livereload: true,
          spawn: false
        },
        files: ['controllers/*.js','models/*.js']
      }
    },


    //Ejecuta watch y nodem al mismo tiempo
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      tasks: ['nodemon', 'watch']
    }

  });

  // Cargar libreria: Monitorizacion del server
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Cargar libreria: Arranque del server
  grunt.loadNpmTasks('grunt-nodemon');

  // Cargar libreria: Concurrencia de tareas
  grunt.loadNpmTasks('grunt-concurrent');

  //Tarea:  Monitorizacion de cambios en el server y re-aranque
  grunt.registerTask('default', 'concurrent');

};
