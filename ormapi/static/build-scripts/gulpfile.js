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

  var task1 = GULP.src(['./../app/incidents/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/incidents'));

  var task2 = GULP.src(['./../app/kri/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/kri'));

  var task3 = GULP.src(['./../app/rcsa/**/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/rcsa'));

  var task4 = GULP.src(['./../app/risk-appetite/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/risk-appetite'));
  
  var task5 = GULP.src(['./../app/risk-assessment/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/risk-assessment'));

  var task6 = GULP.src(['./../app/risk-metric-levels/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/risk-metric-levels'));

  var task7 = GULP.src(['./../app/risk-reports/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/risk-reports'));

  var task8 = GULP.src(['./../config/**/*'])
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/config'));

  var task9 = GULP.src(['./../data-access/**/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/data-access'));

  var task10 = GULP.src(['./../file-upload/**/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/file-upload'));

  var task11 = GULP.src(['./../log-files'])
  .pipe( GULP.dest('./../dist/risk-trac-orm-api'));

  var task12 = GULP.src(['./../log-notification'])
  .pipe( GULP.dest('./../dist/risk-trac-orm-api'));

  var task13 = GULP.src(['./../node_modules/**/*'])
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/node_modules'));
  
  var task14 = GULP.src(['./../utility/**/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/utility'));
  
  var task15 = GULP.src(['./../app-server.js'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/'));

  var task16 = GULP.src(['./../*.json'])
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/'));
  
  var task17 = GULP.src(['./../app/inApp-notification/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/inApp-notification'));

  var task18 = GULP.src(['./../app/dashboard/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/dashboard'));
  
  var task19 = GULP.src(['./../app/report/*'])
  .pipe(UGLIFY())
  .pipe( GULP.dest('./../dist/risk-trac-orm-api/app/report'))
  
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
    task9,
    task10,
    task11,
    task12,
    task13,
    task14,
    task15,
    task16,
    task17,
    task18,
    task19
    ];
});

// CLEAN
GULP.task('clean', function () {
  return DEL('./../dist/**/*', {force: true});  
});

// ziping of folder structure
GULP.task('zip', () =>
GULP.src('./../dist/**/*')
    .pipe(ZIP('risk-trac-orm-api.zip'))
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
     // console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(GULP.dest('scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(UGLIFY())
    .pipe(GULP.dest('scripts/'))
    .pipe(BROWSER_SYNC.reload({stream:true}))
});