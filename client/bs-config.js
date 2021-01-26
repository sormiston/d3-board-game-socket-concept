module.exports = {
  injectChanges: false,
  files: ['./**/*.{html,htm,css,js}'],
  watchOptions: { ignored: 'node_modules' },
  server: {
    baseDir: './src'
  },
  port: 8080,
  ghostMode: false
};
