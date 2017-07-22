var path = require('path');
var gulp = require('gulp');
var	sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var spawn = require('child_process').spawn;
var node, env = process.env;

// ---------------- Build Stuff Tasks ---------------- //
gulp.task('build-sass', function () {
	gulp.src(path.join(__dirname, '/scss/*.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(path.join(__dirname,'/scss/temp')))			//build them here first
		.pipe(concat('main.css'))									//concat them all
		//.pipe(gulp.dest(path.join(__dirname, '/public/css')))
		.pipe(cleanCSS())											//minify
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(path.join(__dirname,'/public/css')));		//dump it here
});

// ---------------- Run Application Task ---------------- //
gulp.task('server', function(a, b) {
	if(node) node.kill();
	node = spawn('node', ['app.js'], {env: env, stdio: 'inherit'});	//command, file, options
});

// ---------------- Watch for Change Tasks ---------------- //
gulp.task('watch-sass', ['build-sass'], function () {
	gulp.watch(path.join(__dirname, '/scss/*.scss'), ['build-sass']);
});
gulp.task('watch-server', function () {
	gulp.watch(path.join(__dirname, '/routes/**/*.js'), ['server']);
	gulp.watch([path.join(__dirname, '/utils/fc_wrangler/*.js')], ['server']);
	gulp.watch([path.join(__dirname, '/utils/*.js')], ['server']);
	gulp.watch(path.join(__dirname, '/app.js'), ['server']);
});


// ---------------- Runable Gulp Tasks ---------------- //
gulp.task('default', ['watch-sass', 'watch-server', 'server']);
gulp.task('marbles_tls', ['start_marbles1', 'watch-sass', 'watch-server', 'server']);	//run with command `gulp marbles_tls` [THIS ONE!]
gulp.task('marbles_local', ['start_marbles2', 'watch-sass', 'watch-server', 'server']);	//run with command `gulp marbles_local`
gulp.task('marbles_dev', ['start_marbles3', 'watch-sass', 'watch-server', 'server']);	//run with command `gulp marbles_dev`
gulp.task('dev', ['start_marbles3', 'watch-sass']);										//run with command `gulp dev`


// launch marbles 
gulp.task('start_marbles1', function () {
	env['creds_filename'] = 'marbles_tls.json';
});

// launch marbles - Docker Compose version
gulp.task('start_marbles2', function () {
	env['creds_filename'] = 'marbles_local.json';
});

// launch marbles - Dev version
gulp.task('start_marbles3', function () {
	env['creds_filename'] = 'marbles_dev.json';
});
