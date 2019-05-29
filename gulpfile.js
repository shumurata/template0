var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var plumber = require( 'gulp-plumber' );
var notify = require( 'gulp-notify' );
var sassGlob = require( 'gulp-sass-glob' );
var mmq = require( 'gulp-merge-media-queries' );
var sourcemaps = require( 'gulp-sourcemaps' );
var browserSync = require( 'browser-sync' );
var imagemin = require( 'gulp-imagemin' );
var imageminPngquant = require( 'imagemin-pngquant' );
var imageminMozjpeg = require( 'imagemin-mozjpeg' );

var postcss = require( 'gulp-postcss' );
var autoprefixer = require( 'autoprefixer' );
var cssdeclsort = require( 'css-declaration-sorter' );

var ejs = require( 'gulp-ejs' );
var rename = require( 'gulp-rename' );
var replace = require( 'gulp-replace' );

var imageminOption = [
	imageminPngquant({ quality: '65-80' }),
	imageminMozjpeg({ quality: 85 }),
	imagemin.gifsicle({
		interlaced: false,
		optimizationLevel: 1,
		colors: 256
	}),
	imagemin.jpegtran(),
	imagemin.optipng(),
	imagemin.svgo()
];

gulp.task( 'sass', function() {
	return gulp
		.src( './sass/**/*.scss' )
		.pipe( plumber({ errorHandler: notify.onError( 'Error: <%= error.message %>' ) }) )
		.pipe( sassGlob() )
		.pipe( sourcemaps.init() )
		.pipe( sass({ outputStyle: 'expanded' }) )
		.pipe( postcss([ autoprefixer() ]) )
		.pipe( postcss([ cssdeclsort({ order: 'alphabetically' }) ]) )
		.pipe( mmq() )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( './css' ) );
});

gulp.task( 'watch', function() {
	gulp.watch( './ejs/**/*.ejs', [ 'ejs' ]);
	gulp.watch( './sass/**/*.scss', [ 'sass' ]);
});

gulp.task( 'browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: './',
			index: 'index.html'
		}
	});
});

gulp.task( 'bs-reload', function() {
	browserSync.reload();
});

gulp.task( 'default', [ 'browser-sync', 'watch' ], function() {
	gulp.watch( './*.html', [ 'bs-reload' ]);
	gulp.watch( './css/*.css', [ 'bs-reload' ]);
	gulp.watch( './js/*.js', [ 'bs-reload' ]);
});

gulp.task( 'imagemin', function() {
	return gulp
		.src( './img/**/*' )
		.pipe( imagemin( imageminOption ) )
		.pipe( gulp.dest( './img' ) );
});

gulp.task( 'ejs', function() {
	return gulp
		.src([ 'ejs/**/*.ejs', '!ejs/**/_*.ejs' ])
		.pipe( ejs({}, {}, { ext: '.html' }) )
		.pipe( rename({ extname: '.html' }) )
		.pipe( replace( /[\s\S]*?(<!DOCTYPE)/, '$1' ) )
		.pipe( gulp.dest( './' ) );
});
