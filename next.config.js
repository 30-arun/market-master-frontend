// next.config.js
module.exports = {
  // Use the full path if your Django app is not at the root
  assetPrefix: process.env.NODE_ENV === "production" ? "/static/" : "",

};
