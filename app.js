var SurveySchoolCrawled = require('./util/surveySchoolCrawled.js');

var mongoose      = require('mongoose'),
    env           = 'production',
    config        = require('./util/config')[env];

mongoose.connect(config.db);


//Crawler
var Crawler = require("simplecrawler");
var cheerio = require('cheerio');
var promise = setTimeout(function(){
  process.exit();
}, 20000);


function func(url, doc) {



  var crawler = new Crawler(url);

  crawler.interval = 1000;
  crawler.maxConcurrency = 10;

  crawler.timeout = 5000;
  crawler.stripWWWDomain = true;
  crawler.stripQuerystring = true;

  crawler.addFetchCondition(function(parsedURL) {
    return parsedURL.path.match(/^([^0-9]*)$/i);
  });
  crawler.addFetchCondition(function(parsedURL) {
    if (parsedURL.path.match(/\.(css|doc|xls|ppt|xml|cgi|mso|avi|wmz|zip|wmv|swf|jpg|pdf|gif|docx|js|png|ico)/i)) {
      return false;
    }
    return true;
  });

  crawler.on("fetchtimeout",function(queueItem){
    console.log("Timed out: ",queueItem.url);
  });

  crawler.on("crawlstart",function() {
    console.log("Crawl starting");
  });

  crawler.on("fetchstart",function(item) {
    console.log("Fetching " + item.url);
  });

  crawler.on("discoverycomplete",function(queueItem, resources) {
    // console.log("Discovered " + queueItem.url);
  });

  crawler.on("fetchheaders",function(queueItem, response) {
    // console.log(response);
  });

  crawler.on("fetchredirect",function(queueItem, response) {
    // console.log("Fetchredirect");
  });
  crawler.on("fetch404",function(queueItem, response) {
    // console.log("fetch404");
  });
  crawler.on("fetcherror",function(queueItem, response) {
    // console.log("fetcherror");
  });
  crawler.on("fetchclienterror",function(queueItem, response) {
    // console.log("fetchclienterror");
  });

  crawler.on("fetchcomplete",function(item, buffer, response) {
    if (promise)
      clearTimeout(promise);
    promise = setTimeout(function(){
      process.exit();
    }, 20000);
    var html = buffer.toString();

    var save = false;



    $ = cheerio.load(html);
    var title = $('title').text();
    if (aContainsBOr(title, ['center', 'support'])) {
      //tutoring resources
      if (aContainsBAnd(html, ['tutor', 'live']))
        doc.data.support_center.tutoring_resources.live_tutor = true;
      if (aContainsBAnd(html, ['tutor', '24/7']))
        doc.data.support_center.tutoring_resources.all_day_tutor = true;
      if (aContainsBOr(html, ['group tutoring', 'group learning']))
        doc.data.support_center.tutoring_resources.group_tutoring = true;

      //online resources
      if (aContainsBOr(html, ['online tutoring', 'online coaching']))
        doc.data.support_center.online_resources.online_tutoring = true;
      if (aContainsBOr(html, ['online mentoring', 'online advising']))
        doc.data.support_center.online_resources.online_mentoring = true;
      if (aContainsBOr(html, ['smarthinking']))
        doc.data.support_center.online_resources.smarthinking = true;
      if (aContainsBOr(html, ['tutor.com']))
        doc.data.support_center.online_resources.tuturdotcom = true;
      if (aContainsBOr(html, ['nettutor']))
        doc.data.support_center.online_resources.nettutor = true;
      if (aContainsBOr(html, ['brainfuse']))
        doc.data.support_center.online_resources.brainfuse = true;
      if (aContainsBOr(html, ['askonline']))
        doc.data.support_center.online_resources.askonline = true;
      if (aContainsBOr(html, ['online learning support']))
        doc.data.support_center.online_resources.online_learning_support = true;
      if (aContainsBOr(html, ['instaedu']))
        doc.data.support_center.online_resources.instaedu = true;
      if (aContainsBOr(html, ['skype']))
        doc.data.support_center.online_resources.skype = true;
      if (aContainsBOr(html, ['google hangouts']))
        doc.data.support_center.online_resources.google_hangouts = true;
      if (aContainsBOr(html, ['blackboard collaborate']))
        doc.data.support_center.online_resources.blackboard_collaborate = true;
      if (aContainsBOr(html, ['etutoring.org']))
        doc.data.support_center.online_resources.etutoring_org = true;
      if (aContainsBOr(html, ['ctdlc.org']))
        doc.data.support_center.online_resources.ctdlc_org = true;
      if (aContainsBOr(html, ['tutorvista']))
        doc.data.support_center.online_resources.tutorvista = true;
      if (aContainsBOr(html, ['wyzant']))
        doc.data.support_center.online_resources.wyzant = true;


      //writing center
      if (aContainsBOr(html, ['writing center', 'reading center', 'writing and reading center', 'writing & reading center']))
        doc.data.support_center.writing_center = true;

      if (aContainsBOr(html, ['Learning Commons', 'Resource Center', 'Academic Excellence Center',  'Academic Assistance Center',  'academic support',  'Center for the global learner', 'learning support',  'center for academic excellence',  'Support Center',  'Learning Center']))
        doc.data.support_center.learning_center = true;

      if (aContainsBOr(html, ['career center', 'career services', 'career support',  'career advice', 'career counseling', 'profession advising', 'career coach']))
        doc.data.support_center.career_center = true;

      if (aContainsBOr(html, ['esl program', 'english as a second language',  'ESL support']))
        doc.data.support_center.esl_support = true;

      if (aContainsBOr(html, ['peer tutoring', 'peer mentoring']))
        doc.data.support_center.peer_mentoring = true;

    }

    //retention program
    if (aContainsBOr(html, ['retention program']))
      doc.data.retention_program.retention_programs = true;
    if (aContainsBOr(html, ['civitas']))
      doc.data.retention_program.civitas = true;
    if (aContainsBOr(html, ['starfish retention',  'starfish']))
      doc.data.retention_program.starfish = true;
    if (aContainsBOr(html, ['early warning system',  'early alert', 'attrition warning']))
      doc.data.retention_program.early_alerts = true;
    if (aContainsBOr(html, ['retention support']))
      doc.data.retention_program.retention_support = true;
    if (aContainsBOr(html, ['learning support']))
      doc.data.retention_program.learning_support = true;



    //student groups
    if (aContainsBOr(html, ['learning communities',  'learning association']))
      doc.data.student_groups.learning_community = true;
    if (aContainsBOr(html, ['cultural hub',  'cultural association',  'cultural center', 'cultural club']))
      doc.data.student_groups.cultural_hub = true;
    if (aContainsBOr(html, ['religious organization',  'religious group', 'religious association']))
      doc.data.student_groups.religious_organization = true;
    if (aContainsBOr(html, ['student organization',  'student group', 'association hub', 'student association', 'student clubs']))
      doc.data.student_groups.student_organization = true;


    //lms
    if (aContainsBOr(html, ['Blackboard Inc',  'Blackboard Learn',  'Blackboard ID']))
      doc.data.lms.blackboard = true;
    if (aContainsBOr(html, ['moodle']))
      doc.data.lms.moodle = true;
    if (aContainsBOr(html, ['sakai']))
      doc.data.lms.sakai = true;
    if (aContainsBOr(html, ['LMS', 'learning management system']))
      doc.data.lms.lms = true;



    //computer lab
    if (aContainsBOr(html, ['computer lab']))
      doc.data.computer_lab = true;




    //academic planning
    if (aContainsBOr(html, ['College Success Center',  'academic planning', 'success coach', 'academic advising', 'academic planning', 'advising and planning', 'academic engagement', 'academic counseling', 'advising appointment']))
      doc.data.academic_planning = true;


    //online academic planning
    if (aContainsBOr(html, ['online advising']))
      doc.data.online_academic_planning = true;

    //personal development
    if (aContainsBOr(html, ['counseling',  'student development', 'personal development']))
      doc.data.personal_development = true;




    //small business center
    if (aContainsBOr(html, ['small business center']))
      doc.data.small_business_center = true;



    //mentoring
    if (aContainsBOr(html, ['peer mentor']))
      doc.data.mentoring.peer_mentor = true;
    if (aContainsBOr(html, ['minority male mentor']))
      doc.data.mentoring.minority_male_mentor = true;
    if (aContainsBOr(html, ['academic mentor']))
      doc.data.mentoring.academic_mentor = true;
    if (aContainsBOr(html, ['personal mentor']))
      doc.data.mentoring.personal_mentor = true;
    if (aContainsBOr(html, ['faculty mentor']))
      doc.data.mentoring.faculty_mentor = true;
    if (aContainsBOr(html, ['minority mentor']))
      doc.data.mentoring.minority_mentor = true;


    //advising
    if (aContainsBOr(html, ['one-on-one advising']))
      doc.data.advising.one_on_one_advising = true;
    if (aContainsBOr(html, ['faculty advising']))
      doc.data.advising.faculty_advising = true;
    if (aContainsBOr(html, ['staff advising']))
      doc.data.advising.staff_advising = true;
    if (aContainsBOr(html, ['advising center']))
      doc.data.advising.advising_center = true;
    if (aContainsBOr(html, ['academic advising']))
      doc.data.advising.academic_advising = true;
    if (aContainsBOr(html, ['career advising']))
      doc.data.advising.career_advising = true;
    if (aContainsBOr(html, ['advising']))
      doc.data.advising.advising = true;



    //freshman year
    if (aContainsBOr(html, ['summer bridge', 'new student orientation', 'freshmen orientation',  'freshman orientation']))
      doc.data.freshman_year = true;



    //remedial courses
    if (aContainsBOr(html, ['Developmental Courses', 'developmental classes', 'developmental instruction', 'remedial classes',  'remedial instruction',  'Remedial Courses']))
      doc.data.remedial_courses.developmental_courses = true;
    if (aContainsBOr(html, ['freshmen seminar',  'freshman seminar']))
      doc.data.remedial_courses.freshman_seminar = true;
    if (aContainsBOr(html, ['supplemental instruction',  'supplemental learning instruction', 'supplemental courses']))
      doc.data.remedial_courses.supplemental_courses = true;
    if (aContainsBOr(html, ['summer classes']))
      doc.data.remedial_courses.summer_classes = true;
    if (aContainsBOr(html, ['test placing',  'placement test']))
      doc.data.remedial_courses.placement_tests = true;




    //other
    if (aContainsBOr(html, ['veteran services']))
      doc.data.other.veteran_services = true;
    if (aContainsBOr(html, ['work study']))
      doc.data.other.work_study = true;
    if (aContainsBOr(html, ['high school program']))
      doc.data.other.high_school_program = true;
    if (aContainsBOr(html, ['lti complian']))
      doc.data.other.lti_compliance = true;


    console.log(doc);
    doc.save(function(err) {
      //keep going
    });

  });

  var aContainsBOr = function(block, array) {
    var valid;
    array.forEach(function(string) {
      var re = new RegExp(string, "i");
      if (re.test(block))
        valid = true;
    });
    return valid;
  };

  var aContainsBAnd = function(block, array) {
    var valid = true;
    array.forEach(function(string) {
      var re = new RegExp(string, "i");
      if (!re.test(block))
        valid = false;
    });
    return valid;
  };

  crawler.on("complete",function() {
    console.log("Finished, on to the next");
    queue();
  });

  crawler.start();
  doc.update({crawled: true}, function(err) {
    if (err) console.log(err);
  });

}
var regex = new RegExp("^(www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

var queue = function() {
  SurveySchoolCrawled.find({$and: [{opeid: {'$ne':"OPEID"}}, {crawled:{$exists: false}}]}, function(err, docs) {
    if (err) console.log(err);
    else {
      for (var i = 0; i<docs.length; i++) {
        var doc = docs[i];
        if (doc.website) {
          func(doc.website, doc);
          break;
        }
      }
    }
  });
};

queue();





// func("www.davidsonccc.edu", new SurveySchoolCrawled());














