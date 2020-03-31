const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js').sourceMaps()
   .js('resources/js/paper-dashboard.js', 'public/js')
   .sass('resources/sass/_paper-dashboard.scss', 'public/css/paper-dashboard.css').sourceMaps()
   .sass('resources/sass/app.scss', 'public/css').sourceMaps();

mix.copy('resources/img', 'public/img')
   .copy('resources/js/plugins', 'public/js/plugins')
   .copy('resources/js/core', 'public/js/core')
   .copy('resources/js/paper-dashboard.js', 'public/js/');

