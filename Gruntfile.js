/* eslint-disable func-names */
const sass = require('node-sass');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // "<%= proper(pkg.name) %>"
    proper: (pkgName) =>
      pkgName.replace(/-/g, ' ').replace(/[a-z]+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),

    clean: {
      css: ['dist/*.css'],
      html: ['dist/*.html'],
      js: ['dist/<%= pkg.name %>.user.js'],
      extra: ['dist/<%= pkg.name %>.meta.js', 'dist/<%= pkg.name %>.dev.js'],
    },

    'userscript-meta': {
      meta: { dest: 'dist/<%= pkg.name %>.meta.js' },
      dev: { dest: 'dist/<%= pkg.name %>.dev.js' },
    },
    'userscript-dev': {
      main: {
        options: { devURL: '<%= pkg.devURL %>' },
        src: 'dist/<%= pkg.name %>.dev.js',
      },
    },

    // https://stackoverflow.com/questions/21118598/how-to-compile-multiple-scss-files-using-grunt-sass
    sass: {
      main: {
        options: { implementation: sass, style: 'compact' },
        files: [
          {
            flatten: !0,
            expand: !0,
            cwd: 'src/css',
            src: ['**/*.scss'],
            dest: 'dist',
            ext: '.css',
          },
        ],
      },
    },

    cssmin: {
      main: {
        files: [
          {
            expand: !0,
            cwd: 'dist',
            src: ['*.css'],
            dest: 'dist',
            ext: '.min.css',
          },
        ],
      },
    },

    htmlmin: {
      dist: {
        options: { removeComments: !0, collapseWhitespace: !0 },
        files: [
          {
            flatten: !0,
            expand: !0,
            cwd: 'src/html',
            src: ['**/*.html'],
            dest: 'dist',
            ext: '.html',
          },
        ],
      },
    },

    copy: {
      main: { src: '<%= pkg.main %>', dest: 'dist/<%= pkg.name %>.user.js' },
    },

    includes: {
      main: {
        options: { includeRegexp: /include: (dist\/[^'\n]+)/ },
        files: [{ src: 'dist/<%= pkg.name %>.user.js', dest: 'dist/<%= pkg.name %>.user.js' }],
      },
      import: {
        options: {
          includeRegexp: /^import(?: \w+ from)? '([^']+\.js)';/,
          includePath: 'src',
        },
        files: [{ src: 'dist/<%= pkg.name %>.user.js', dest: 'dist/<%= pkg.name %>.user.js' }],
      },
    },

    'string-replace': {
      dist: {
        options: {
          replacements: [
            { pattern: /export default \w+;/g, replacement: '' },
            { pattern: /; }\n(\n`?)/g, replacement: '; \n}$1' },
            { pattern: /\n{2,}/g, replacement: '\n\n' },
          ],
        },
        files: [{ src: 'dist/<%= pkg.name %>.user.js', dest: 'dist/<%= pkg.name %>.user.js' }],
      },
    },

    concat: {
      dist: {
        src: ['dist/<%= pkg.name %>.meta.js', 'dist/<%= pkg.name %>.user.js'],
        dest: 'dist/<%= pkg.name %>.user.js',
      },
    },

    watch: {
      css: {
        files: ['src/css/**/*.scss'],
        tasks: ['clean:css', 'clean:js', 'sass', 'cssmin', 'copy', 'includes', 'string-replace', 'concat'],
        options: { atBegin: !0, spawn: !1 },
      },
      html: {
        files: ['src/html/**/*.html'],
        tasks: ['clean:html', 'clean:js', 'htmlmin', 'copy', 'includes', 'string-replace', 'concat'],
        options: { atBegin: !0, spawn: !1 },
      },
      js: {
        // files: ['Gruntfile.js', 'src/**/*' /* '!src/temp.js' */],
        files: ['Gruntfile.js', 'src/index.js', 'src/js/**/*.js'], // '!src/temp.js'
        tasks: [
          'clean:js',
          'clean:extra',
          'userscript-meta',
          'userscript-dev',
          'userscript-meta',
          'userscript-dev',
          'copy',
          'includes',
          'string-replace',
          'concat',
        ],
        options: { atBegin: !0, spawn: !1 },
      },
      /* extra: {
        files: ['package.json'],
        tasks: [
          //
          'clean:js',
          'clean:extra',
          'userscript-meta',
          'userscript-dev',
          'copy',
          'includes',
          'string-replace',
          'concat',
        ],
        options: { atBegin: !0, spawn: !1 },
      }, */
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-userscript-meta-f4w');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-includes-relative-path');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerMultiTask('userscript-dev', 'Helps in creating the developer version of the script', function () {
    const { src, options } = this.data;
    let devScript;
    devScript = grunt.file.read(src);
    devScript = devScript.replace(/(^\/\/ @name *userscript-modules-template)/m, '$1 [DEV]');
    devScript = [
      devScript,
      `GM_xmlhttpRequest({\n  url: '${options.devURL}',`,
      '  // eslint-disable-next-line no-eval',
      '  onload: ({ responseText }) => eval(responseText),',
      '});\n',
    ].join('\n');
    grunt.file.write(src, devScript);
  });

  grunt.registerTask('default', [
    'clean',
    'userscript-meta',
    'userscript-dev',
    'sass',
    'cssmin',
    'htmlmin',
    'copy',
    'includes',
    'string-replace',
    'concat',
    'watch',
  ]);
};

// https://stackoverflow.com/questions/18900772/grunt-watch-compile-only-one-file-not-all
// grunt.event.on('watch', function (action, filepath, target) {});
