module.exports = {
  webpack(config) {
    config.output.publicPath = './';
    return config // <-- Important, must return it
  },
  presets: [
    require('poi-preset-typescript')(/* options */)
  ],
};
