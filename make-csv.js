var SurveySchoolCrawled = require('./util/surveySchoolCrawled.js');

var mongoose      = require('mongoose'),
    env           = 'production',
    config        = require('./util/config')[env];

var fs = require('fs');

mongoose.connect(config.db);


var data = [];
var header = ['opeid', 'unitid'];
for (var i in SurveySchoolCrawled.schema.paths) {
  if (i.indexOf('data') != -1)
    header.push(i);
}
console.log(header);

data.push(header)


function deepFind(obj, path) {
  var paths = path.split('.')
    , current = obj
    , i;

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
}



var Queue = require('queue');
var queue = new Queue({
  timeout: 20000,
  concurrency: 4
});

queue.on('end', function() {
  console.log("Finished");
  var csv = require("fast-csv");
  csv.writeToStream(fs.createWriteStream("my.csv"), data, {headers: false, encoding: "utf8"});
});
queue.on('success', function(result, job) {
  console.log(queue.length);
});
queue.on('timeout', function() {

});



var func = function(doc){

    var array = [];
    header.forEach(function(path) {
      var value = deepFind(doc, path);
      if (value)
        array.push(value);
      else
        array.push(" ");
    });
    data.push(array);
    console.log(count);
    count++;



};

var stream = SurveySchoolCrawled.find({crawled:true}).stream();
var count = 0;
stream.on('data', function (college) {
  func(college);

}).on('error', function (err) {
  // handle the error
}).on('close', function () {
  // the stream is closed
  console.log("Finished");
  // console.log(data);
  var csv = require("fast-csv");
  csv.writeToStream(fs.createWriteStream("my.csv"), data, {headers: false, encoding: "utf8"});
});



// func("www.aamu.edu//", {_id: "id"});














