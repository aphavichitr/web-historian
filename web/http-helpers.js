var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.access(asset, function(error) {
    if (error) {
      res.writeHead(404);
      res.end('Resource not found.');
    } else {
      fs.readFile(asset, 'utf8', function(error, content) {
        if (error) {
          console.log(error);
          res.writeHead(500);
          res.end('Internal server error.');
        } else {
          callback(error, content);
        }
      });
    }
  });
};
// As you progress, keep thinking about what helper functions you can put here!
