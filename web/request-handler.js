var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var url = req.url;
  var method = req.method;
  console.log(method, 'request made for ', url);

  if (method === 'GET') {
    if (url === '/') {
      httpHelp.serveAssets(res, url);
    } else {
      if (archive.isUrlInList(url)) {
        console.log('Found', url);
      }
    }
  }

  // res.end(archive.paths.list);
};
