const pump = require('pump');
const gulp = require('gulp');
const todo = require('gulp-todo');
 
// generate a todo.md from your javascript files
// -> Will output a TODO.md with your todos 
gulp.task('todo', function(cb) {
  pump([
      gulp.src(['./**/*.js', '!node_modules/**/*', '!dist/**/*']),
      todo(),
      gulp.dest('./')
  ], function(e) {
    if (typeof(e) != 'undefined') {
      console.log(e);
      process.exit(1);
    } else {
      cb();
    }
  })
});

gulp.task('default', ['todo']);
