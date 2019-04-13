const karmaTypescriptConfig = {
  tsconfig: 'tsconfig.json',
  // Disable coverage reports and instrumentation by default for tests
  coverageOptions: {instrumentation: false},
  reports: {}
};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      '*.ts',
      '../src/shaderc/*.js',
      { pattern: '../src/shaderc/*.wasm', included: false },
    ],
    preprocessors: {
      '*.ts': ['karma-typescript'],
      'src/shaderc/index.js': ['karma-typescript'],
    },
    karmaTypescriptConfig,
    reporters: ['progress', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true
  })
}
