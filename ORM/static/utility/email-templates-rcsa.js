const emailConfig                                   = require('../config/email-config.js');
const REVIEW_OBJ                                    = require('../config/email-template/review-rejection-template.js');
const ASSESSMENT_OBJ                                = require('../config/email-template/schedule-assessment-template.js');
const SCROING_OBJ                                   = require('../config/email-template/self-scroing-template.js');
const SCHEDULE_ASSESSMENT_NEW_OBJ                   = require('../config/email-template/schedule-assessment-new-template.js');
const SCHEDULE_ASSESSMENT_UPDATE_OBJ                = require('../config/email-template/schedule-assessment-update-template.js');
const SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_OBJ   = require('../config/email-template/schedule-assessment-old-reviewer-template.js');
const SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_OBJ       = require('../config/email-template/schedule-assessment-reviewer-update-template.js');
const SELF_ASSESSMENT_SUBMIT_OBJ                    = require('../config/email-template/self-assessment-submit-template.js');
const SELF_ASSESSMENT_RESUBMIT_OBJ                  = require('../config/email-template/self-assessment-resubmit-template.js');
const SELF_ASSESSMENT_APPROVED_OBJ                  = require('../config/email-template/self-assessment-approved-template.js');
const SELF_ASSESSMENT_REJECTED_OBJ                  = require('../config/email-template/self-assessment-rejected-template.js');
const SELF_ASSESSMENT_COMPLETED_OBJ                 = require('../config/email-template/self-assessment-completed-template.js');
const SCHEDULE_ASSESSMENT_INPROGRESS_OBJ            = require('../config/email-template/schedule-assessment-in-progress-template.js');
const SEND_EMAILMANUALLY_OBJ                        = require('../config/email-template/send-email-manually-rcsa.js');
const CONSTANT_FILE_OBJ                             = require('../utility/constants/constant.js');


module.exports = class EmailTemplates {
  constructor() {
  }

  prepareTemplates(templateObj, templateKey) {
    logger.log('info', "Inside Email Templates Prepration Method")

    
   let tempEmailTemplate;
   let emailSubject   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
   let emailTemplate  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

      if(templateKey == 'REVIEW_REJECTION_EMAIL_TEMPLATE')
      {
        emailSubject  = REVIEW_OBJ.REVIEW_REJECTION[templateKey].Subject;
        emailTemplate = REVIEW_OBJ.REVIEW_REJECTION[templateKey].Body; 
      }

      if(templateKey == 'SELF_SCORING_EMAIL_TEMPLATE')
      {
        emailSubject  = SCROING_OBJ.SELF_SCROING[templateKey].Subject;
        emailTemplate = SCROING_OBJ.SELF_SCROING[templateKey].Body; 
      }

      if(templateKey == 'SCHEDULE_ASSESSMENT_EMAIL_TEMPLATE')
      {
        emailSubject  = ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Subject;
        emailTemplate = ASSESSMENT_OBJ.ASSESSMENT_TEMPLATES[templateKey].Body; 
      }

      if(templateKey == 'SCHEDULE_ASSESSMENT_NEW_EMAIL_TEMPLATE')
      {
        emailSubject  = SCHEDULE_ASSESSMENT_NEW_OBJ.SCHEDULE_ASSESSMENT_NEW[templateKey].Subject;
        emailTemplate = SCHEDULE_ASSESSMENT_NEW_OBJ.SCHEDULE_ASSESSMENT_NEW[templateKey].Body; 
      }

      if(templateKey == 'SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE')
      {
        emailSubject  = SCHEDULE_ASSESSMENT_INPROGRESS_OBJ.SCHEDULE_ASSESSMENT_INPROGRESS[templateKey].Subject;
        emailTemplate = SCHEDULE_ASSESSMENT_INPROGRESS_OBJ.SCHEDULE_ASSESSMENT_INPROGRESS[templateKey].Body; 
      }

      if(templateKey == 'SCHEDULE_ASSESSMENT_UPDATE_EMAIL_TEMPLATE')
      {
        emailSubject  = SCHEDULE_ASSESSMENT_UPDATE_OBJ.SCHEDULE_ASSESSMENT_UPDATE[templateKey].Subject;
        emailTemplate = SCHEDULE_ASSESSMENT_UPDATE_OBJ.SCHEDULE_ASSESSMENT_UPDATE[templateKey].Body; 
      }

      if(templateKey == 'SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_EMAIL_TEMPLATE')
      {
        emailSubject  = SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_REVIEWER_UPDATE[templateKey].Subject;
        emailTemplate = SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_REVIEWER_UPDATE[templateKey].Body; 
      }

      if(templateKey == 'SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_EMAIL_TEMPLATE')
      {
        emailSubject  = SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE[templateKey].Subject;
        emailTemplate = SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_OBJ.SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE[templateKey].Body; 
      }

      if(templateKey == 'SELF_ASSESSMENT_SUBMIT_EMAIL_TEMPLATE')
      {
        emailSubject  = SELF_ASSESSMENT_SUBMIT_OBJ.SELF_ASSESSMENT_SUBMIT[templateKey].Subject;
        emailTemplate = SELF_ASSESSMENT_SUBMIT_OBJ.SELF_ASSESSMENT_SUBMIT[templateKey].Body; 
      }

      if(templateKey == 'SELF_ASSESSMENT_RESUBMIT_EMAIL_TEMPLATE')
      {
        emailSubject  = SELF_ASSESSMENT_RESUBMIT_OBJ.SELF_ASSESSMENT_RESUBMIT[templateKey].Subject;
        emailTemplate = SELF_ASSESSMENT_RESUBMIT_OBJ.SELF_ASSESSMENT_RESUBMIT[templateKey].Body; 
      }

      if(templateKey == 'SELF_ASSESSMENT_APPROVED_EMAIL_TEMPLATE')
      {
        emailSubject  = SELF_ASSESSMENT_APPROVED_OBJ.SELF_ASSESSMENT_APPROVED[templateKey].Subject;
        emailTemplate = SELF_ASSESSMENT_APPROVED_OBJ.SELF_ASSESSMENT_APPROVED[templateKey].Body; 
      }

      if(templateKey == 'SELF_ASSESSMENT_REJECTED_EMAIL_TEMPLATE')
      {
        emailSubject  = SELF_ASSESSMENT_REJECTED_OBJ.SELF_ASSESSMENT_REJECTED[templateKey].Subject;
        emailTemplate = SELF_ASSESSMENT_REJECTED_OBJ.SELF_ASSESSMENT_REJECTED[templateKey].Body; 
      }

      if(templateKey == 'SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE')
      {
        emailSubject  = SELF_ASSESSMENT_COMPLETED_OBJ.SELF_ASSESSMENT_COMPLETED[templateKey].Subject;
        emailTemplate = SELF_ASSESSMENT_COMPLETED_OBJ.SELF_ASSESSMENT_COMPLETED[templateKey].Body; 
      }

      if(templateKey == 'SEND_EMAIL_MANUALLY_RCSA_EMAIL_TEMPLATE')
      {
        emailSubject  = SEND_EMAILMANUALLY_OBJ.SEND_EMAIL_MANUALLY_RCSA[templateKey].Subject;
        emailTemplate = SEND_EMAILMANUALLY_OBJ.SEND_EMAIL_MANUALLY_RCSA[templateKey].Body; 
      }
    
      tempEmailTemplate = emailTemplate;
      for (let key in templateObj) 
      {
        tempEmailTemplate = tempEmailTemplate.replace(`[[${key}]]`, templateObj[key]);
        emailSubject      = emailSubject.replace(`[[${key}]]`, templateObj[key]);     
      }

    return { Body: tempEmailTemplate, Subject: emailSubject };
  }
}
