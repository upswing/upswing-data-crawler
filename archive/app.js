var PostSecondarySchoolSurvey2012 = require('./util/postSecondarySchoolSurvey2012.js');
var Directory = require('./util/directory.js');

var Q = require('q');
var fs = require('fs');
var mongoose      = require('mongoose'),
    env           = 'production',
    config        = require('./util/config')[env];

//Connect to database
mongoose.connect(config.db);


//Crawler
var Crawler = require("simplecrawler");

function extractEmails(text, domain) {

  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}

function func(url, doc) {
  queue.push(function(cb) {
    var crawler = new Crawler(url);
    var object = {};

    crawler.timeout = 1000;
    crawler.stripWWWDomain = true;
    crawler.stripQuerystring = true;

    crawler.addFetchCondition(function(parsedURL) {
      if (parsedURL.path.match(/\.(css|jpg|pdf|gif|docx|js|png|ico)/i)) {
        return false;
      }
      return true;
    });

    crawler.on("crawlstart",function() {
      console.log("Crawl starting");
    });

    crawler.on("fetchheaders",function(item, response) {

    });


    crawler.on("fetchstart",function(item) {
      console.log("Fetching " + item.url);
    });

    crawler.on("fetchcomplete",function(item, buffer, response) {
      var html = buffer.toString();
      var array = extractEmails(html, domain);
      if (array && array.length > 0) {
        var domain = crawler.host.replace(/.*?:\/\//g, "");
        domain = domain.replace('www.', '');

        array.forEach(function(address) {
          if (address.indexOf(domain) != -1) {
            object[address] = item.url;
          }
        });
      }
    });

    crawler.on("complete",function() {

      console.log("Finished, now adding");

      var promises = [];
      Object.keys(object).forEach(function(address) {

        var deferred = Q.defer();
        promises.push(deferred.promise);
        Directory.findOne({email: address}, function(err, directory) {
          if (err)
            console.log(err);
          else if (!directory) {
            directory = new Directory({
              email: address,
              host: object[address],
              survey_ids: [doc._id]
            });
            directory.save(function(err, directory) {
              if (err)
                console.log(err);
              else
                console.log("Added " + address);
              deferred.resolve();
            });
          }
          else {
            directory.update({"$push": {"survey_ids": doc._id}}, function(err) {
              if (err) console.log(err);
              console.log("Updated " + address);
              deferred.resolve();
            });
          }
        });
      });
      if (promises.length > 0) {
        Q.all(promises).then(function() {
          console.log('Done with queue item');
          cb();
        });
      }
      else {
        console.log('Done with queue item');
        cb();
      }

    });

    crawler.start();

    doc.update({crawled: true}, function(err) {
      if (err) console.log(err);
    });


  });
  if (!queue.started) {

    queue.start();
    queue.started = true;
  }

}




var Queue   = require('queue');
var queue = new Queue({
  concurrency: 1
});
queue.on('end', function() {
  console.log('Done with directory');
  process.exit();
});
queue.started = false;


var regex = new RegExp("^(www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

var stream = PostSecondarySchoolSurvey2012.find({$and: [{community_college: true}, {crawled:{$exists: false}}]}).stream();
stream.on('data', function (doc) {

  if (doc.opeid != "OPEID") {

    var website = doc.fields[14];

    if (regex.test(website)) {
      func(website, doc);
    }


  }

}).on('error', function (err) {
  console.log(err);
}).on('close', function () {


});



// func("https://www.escc.edu/index.php/financial-aid/financial-aid-forms-14-15?task=callelement&format=raw&amp%3Bitem_id=62&amp%3Belement=f85c494b-2b32-4109-b8c1-083cca2b7db6&amp%3Bmethod=download&amp%3Bargs%5B0%5D=3c55c29e163526dc6249262249d516b9", {_id: "id"});







