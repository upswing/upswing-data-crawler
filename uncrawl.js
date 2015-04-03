var PostSecondarySchoolSurvey2012 = require('./util/postSecondarySchoolSurvey2012.js');

var fs = require('fs');
var mongoose      = require('mongoose'),
    env           = 'production',
    config        = require('./util/config')[env];

//Connect to database
mongoose.connect(config.db);
var regex = new RegExp("^(www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");


PostSecondarySchoolSurvey2012.find({}, function(err, docs) {
  if (err)
    console.log(err);
  else {
    for (var i = 0; i<docs.length; i++) {

      var doc = docs[i];
      var website = doc.fields[14];
      console.log(i);

      if (regex.test(website)) {
        website = website.replace(/\/$/, '');
      }
      doc.update({website: website, $unset: {competitor_crawled: '', facebook_crawled: '', facebook_crawling: '', instaedu: '', smarthinking: '', nettutor: '', tutordotcom: '', facebook_string: '', fields: ''}}, function(err) {
        if (err) console.log(err);
        console.log("Updated");
      });
    }
  }
});




