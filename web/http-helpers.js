var path = require('path');
var fs = require('fs');
var qs = require('querystring');
var archive = require('../helpers/archive-helpers');
var http = require('http');

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

exports.getPostData = function(req, callback) {
  var body = '';
  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function() {
    callback(qs.parse(body).url);
  });
};

exports.getPage = function(url, callback) {
  var options = {
    hostname: url,
    port: 80, 
    path: '/',
    method: 'GET',
    headers: {
      'Content-Type': 'text/html'
    }
  };

  var req = http.request(options, function(res) {
    res.on('error', function(error) {
      console.log('response', error);
    });

    var body = '';
    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      callback(body);
    });
  });

  req.on('error', function(error) {
    console.log('Request Error:', error);
  });

  req.end();
};