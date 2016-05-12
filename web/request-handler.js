var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var url = req.url;
  var method = req.method;
  console.log(method, 'request made for ', url);

  var assetPath;
  if (method === 'GET') {

    if (url === '/') {
      res.writeHead(200, archive.headers);
      assetPath = __dirname + '/public/index.html';
    } else {
      assetPath = archive.paths.archivedSites + url;
    }

    httpHelp.serveAssets(res, assetPath, function(error, content) {
      res.write(content);
      res.end();
    });

  } else if (method === 'POST') {
    httpHelp.getPostData(req, function(url) {
      archive.addUrlToList(url, function() {
        archive.isUrlArchived(url, function(isArchived) {

          if (isArchived) {
            res.writeHead(200, archive.headers);
            assetPath = archive.paths.archivedSites + '/' + url;
          } else {
            res.writeHead(302, archive.headers);
            assetPath = __dirname + '/public/loading.html';
          }

          httpHelp.serveAssets(res, assetPath, function(error, content) {
            res.write(content);
            res.end();
          });

        });
      });
    });

  }

  // res.end(archive.paths.list);
};
