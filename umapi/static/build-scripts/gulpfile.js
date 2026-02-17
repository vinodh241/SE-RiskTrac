const GULP 			    = require('gulp');
const PLUMBER 		  = require('gulp-plumber');
const BROWSER_SYNC  = require('browser-sync');
const BUILD 			  = require('gulp-build');
const GUTIL 		    = require('gulp-util');
const CLEAN         = require('gulp-clean');
const ZIP           = require('gulp-zip');
const DEL           = require('del');
const GULP_SEQUENCE = require('gulp-sequence');
const UGLIFY        = require('gulp-uglify-es').default;

// Move all the folder from project structure to dist folder//
GULP.task('move', function () {

  var task1 = GULP.src(['./../app/auth/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-um-api/app/auth'));
  
  var task2 = GULP.src(['./../app/user-management/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-um-api/app/user-management'));

  var task3 = GULP.src(['./../config/**/*'])
  .pipe( GULP.dest('./../dist/risk-trac-um-api/config'));

  var task4 = GULP.src(['./../data-access/**/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-um-api/data-access'));

  var task5 = GULP.src(['./../log-files'])
  .pipe( GULP.dest('./../dist/risk-trac-um-api'));

  var task6 = GULP.src(['./../node_modules/**/*'])
  .pipe( GULP.dest('./../dist/risk-trac-um-api/node_modules'));
  
  var task7 = GULP.src(['./../utility/**/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-um-api/utility'));
  
  var task8 = GULP.src(['./../app-server.js'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-um-api/'));

  var task9 = GULP.src(['./../*.json'])
  .pipe( GULP.dest('./../dist/risk-trac-um-api/'))
  
  
  
// merging of all tasks
  return [ 
    task1, 
    task2, 
    task3, 
    task4, 
    task5, 
    task6, 
    task7, 
    task8, 
    task9
  ];
});

// CLEAN
GULP.task('clean', function () {
  return DEL('./../dist/**/*', {force: true});  
}); 

// ziping of folder structure
GULP.task('zip', () =>
GULP.src('./../dist/**/*')
    .pipe(ZIP('risk-trac-um-api.zip'))
    .pipe( GULP.dest('./../dist/'))
);

// Sequencing of different taks
GULP.task('sequence1', GULP_SEQUENCE('clean', 'move'));
//GULP.task('sequence2',GULP_SEQUENCE('sequence1','ZIP'));

// BUILD the project
GULP.task("build", ['sequence1']);

GULP.task('bs-reload', function () {
  BROWSER_SYNC.reload();
});

GULP.task('scripts', function(){
  return GULP.src('*.js')
    .pipe(PLUMBER({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(GULP.dest('scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(UGLIFY())
    .pipe(GULP.dest('scripts/'))
    .pipe(BROWSER_SYNC.reload({stream:true}))
});