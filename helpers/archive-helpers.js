var path = require('path');
var httpHelp = require('../web/http-helpers');
var _ = require('underscore');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function() {
  return fs.readFileAsync(exports.paths.list, 'utf8')
    .then(function(content) {
      var urlArray = content.split('\n');
      return urlArray;
    })
    .catch(function(error) {
      throw new Error(error);
    });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, 'utf8', function(error, content) {
    var isInList = content.indexOf(url) !== -1;
    callback(isInList);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(error, content) {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(error, files) {
    var isArchived = files.indexOf(url) !== -1;
    callback(isArchived);
  });
};

exports.downloadUrls = function(urlArray) {
  _.each(urlArray, function(url) {
    httpHelp.getPage(url, function(body) {
      fs.writeFile(exports.paths.archivedSites + '/' + url, body);
    });
  });
};
