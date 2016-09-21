// Définition des dépendances dont on a besoin our exécuter les tâches
var 
	gulp = require( "gulp" ),
	imagemin = require( "gulp-imagemin" ),
	newer = require( "gulp-newer" ),
	size = require( "gulp-size" ),
	del = require( "del" ),
	destclean = require( "gulp-dest-clean" ),
	imacss = require( "gulp-imacss" ),
	sass = require( "gulp-sass" );

// Définition de quelques variables générales pour notre gulpfile
var
	source = 'sources/',
	dest = 'build/';

// Définitions de quelques variables liées à nos tâches (options de tâches)
var
	imagesOpts = {
		in: source + "images/*.*",
		out: dest + "images/",
		watch: source + "images/*.*"
	},
	imageUriOpts = {
		in: source + "images/inline/*.*",
		out: source + "scss/images/",
		filename: "_datauri.scss",
		namespace: "img"
	},
	// ici le out n'est pas la destination, ce sera un fichier css
	css = {
		in: source + "scss/main.scss",
		watch: [ source + "scss/**/*" ],
		out: dest + "css/",
		sassOpts: {
			outputStyle: "nested",
			precision: 3, // nombre de valeurs derrière la virgule
			errLogToConsole: true // pour que les erreurs s'affichent dans la console
		}
	};

// Définition des tâches
gulp.task( "clean", function() {
	del( [ dest + "*" ] );
} );

gulp.task( "images", function(){
	return gulp.src( imagesOpts.in )
		.pipe( destclean( imagesOpts.out ) )
		.pipe( newer( imagesOpts.out ) )
		.pipe( size( { title: "Images size before compression; ", showFiles: true } ) )
		.pipe( imagemin() )
		.pipe( size( { title: "Images size after compression; ", showFiles: true } ) )
		.pipe( gulp.dest( imagesOpts.out ) );
} );

gulp.task( "imageuri", function() {
	return gulp.src( imageUriOpts.in )
		.pipe( imagemin() )
		.pipe( imacss( imageUriOpts.filename, imageUriOpts.namespace ) )
		.pipe( gulp.dest( imageUriOpts.out ) );
} );

gulp.task( "sass", function() {
	return gulp.src( css.in )
		.pipe( sass( css.sassOpts ) )
		.pipe( gulp.dest( css.out ) )
} );

// Tâche par défaut exécutée lorsqu'on tape juste gulp dans le terminal.
gulp.task( "default", [ "images" ], function(  ) {
	gulp.watch( imagesOpts.watch, [ "images" ] );
} );