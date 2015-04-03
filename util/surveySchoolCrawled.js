var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

SurveySchoolCrawled = mongoose.Schema({
  college_id:             String,
  facebook_id:            Number,
  google_place_id:        String,
  college_alt_id:         String,

  crawled:                Boolean,

  smarthinking:           [String],
  nettutor:               [String],
  tutordotcom:            [String],
  instaedu:               [String],

  website:                String,
  opeid:                  String,
  unitid:                 String, //permanent identification number
  community_college:      Boolean,
  less_than_four_year:    Boolean,


  data: {
    support_center: {
      tutoring_resources: {
        live_tutor:         Boolean,
        all_day_tutor:      Boolean,
        group_tutoring:     Boolean,
      },
      online_resources: {
        online_tutoring:          Boolean,
        online_mentoring:         Boolean,
        smarthinking:             Boolean,
        tutordotcom:              Boolean,
        nettutor:                 Boolean,
        brainfuse:                Boolean,
        askonline:                Boolean,
        online_learning_support:  Boolean,
        instaedu:                 Boolean,
        skype:                    Boolean,
        google_hangouts:          Boolean,
        blackboard_collaborate:   Boolean,
        etutoring_org:            Boolean,
        ctdlc_org:                Boolean,
        tutorvista:               Boolean,
        wyzant:                   Boolean
      },
      writing_center:             Boolean,
      learning_center:            Boolean,
      career_center:              Boolean,
      esl_support:                Boolean,
      peer_mentoring:             Boolean
    },
    retention_program: {
      retention_programs:         Boolean,
      civitas:                    Boolean,
      starfish:                   Boolean,
      early_alerts:               Boolean,
      retention_support:          Boolean,
      learning_support:           Boolean
    },
    student_groups: {
      learning_community:         Boolean,
      cultural_hub:               Boolean,
      religious_organization:     Boolean,
      student_organization:       Boolean
    },
    lms: {
      blackboard:                 Boolean,
      moodle:                     Boolean,
      sakai:                      Boolean,
      lms:                        Boolean
    },
    computer_lab:                 Boolean,
    academic_planning:            Boolean,
    online_academic_planning:     Boolean,
    personal_development:         Boolean,
    small_business_center:        Boolean,
    mentoring: {
      peer_mentor:                Boolean,
      minority_male_mentor:       Boolean,
      academic_mentor:            Boolean,
      personal_mentor:            Boolean,
      faculty_mentor:             Boolean,
      minority_mentor:            Boolean
    },
    advising: {
      one_on_one_advising:        Boolean,
      faculty_advising:           Boolean,
      staff_advising:             Boolean,
      advising_center:            Boolean,
      academic_advising:          Boolean,
      career_advising:            Boolean,
      advising:                   Boolean
    },
    freshman_year:                Boolean,
    remedial_courses: {
      developmental_courses:      Boolean,
      freshman_seminar:           Boolean,
      supplemental_courses:       Boolean,
      summer_classes:             Boolean,
      placement_tests:            Boolean
    },
    other: {
      veteran_services:           Boolean,
      work_study:                 Boolean,
      high_school_program:        Boolean,
      lti_compliance:             Boolean
    }
  }
});







var SurveySchoolCrawled = mongoose.model("SurveySchoolCrawled", SurveySchoolCrawled);
module.exports = SurveySchoolCrawled;