'use strict';

import pkg           from './package.json';
import gulp          from 'gulp';
import header        from 'gulp-header';
import gutil         from 'gulp-util';
import plugins       from 'gulp-load-plugins';
import browser       from 'browser-sync';
import merge         from 'merge-stream';
import lazypipe      from 'lazypipe';
import panini        from 'panini';
import rimraf        from 'rimraf';
import path          from 'path';
import fs            from 'fs';

// VARS
// ======================================================================
  const banner = ['/**',
                  ' * <%= pkg.name %> - <%= pkg.description %>',
                  ' * @author <%= pkg.author %>',
                  ' * @link <%= pkg.homepage %>',
                  ' * @version v<%= pkg.version %>',
                  ' */',
                  ''].join('\n');
  const $ = plugins();

  const PORT = 3000;
  const PATH = "dist";
  const PATH_JS = "src/js";
  const PATH_CSS = "src/css";


// TASKS
// ======================================================================
  gulp.task('build',    gulp.series(clean, pages, bootstrap, scripts, css));
  gulp.task('default',  gulp.series('build', server, watch));  


// PAGES / SCRIPTS / SASS 
// ======================================================================
  function pages() {
    return  gulp.src('src/pages/**/*.html')
                .pipe(panini({
                  root:     'src/pages',
                  layouts:  'src/layouts',
                  partials: 'src/partials'
                }))
                .pipe(gulp.dest(PATH));
  }

  function scripts(){    
    return gulp.src(PATH_JS+'/*.js')
              .pipe($.header(banner, { pkg : pkg } ))
              .pipe(gulp.dest(PATH+'/js'));
  }
  function css(){    
    return gulp.src(PATH_CSS+'/*.css')
              .pipe(gulp.dest(PATH+'/css'));
  }
  function bootstrap(){
    return gulp.src('node_modules/bootstrap/dist/**/*')
              .pipe(gulp.dest(PATH+'/lib/bootstrap'));
  }


// FUNCTIONS
// ======================================================================
  function clean(done) { rimraf(PATH, done); }
  function resetPages(done) { panini.refresh(); done(); }

// SERVER / WATCH
// ======================================================================
  function server(done) { browser.init({ server: PATH, port: PORT }); done(); }
  function refreshServer(done) { browser.reset(); browser.exit(); done(); }

  function watch() {
    gulp.watch('src/pages/**/*.html').on('all', gulp.series(resetPages, pages, browser.reload));
    gulp.watch(['src/layouts/**/*', 'src/partials/**/*']).on('all', gulp.series(resetPages, pages, browser.reload));
    gulp.watch(['src/assets/js/**/*','src/assets/css/**/*']).on('all', gulp.series(clean, resetPages, scripts, css, pages, browser.reload));
  }
