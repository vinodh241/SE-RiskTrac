const APP_VALIATOR              = require('../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ          = require('../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ         = require('../../../utility/constants/constant.js');
const SCHEDULE_ASSESSMENT_DB    = require('../../../data-access/schedule-assessment-db.js');
const EMAIL_TEMPLATE            = require('../../../utility/email-templates-rcsa.js');
const APP_CONFIG_FILE_OBJ       = require('../../../config/app-config.js');
const BINARY_DATA               = require('../../../utility/binary-data.js');
const { logger }                = require('../../../utility/log-manager/log-manager.js');
const SCHEDULE_DB               = require('../../../data-access/schedule-db.js');
const INAPP_NOTIFICATION_DB     = require('../../../data-access/inApp-notification-db.js');

var appValidatorObject                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleAssessmentDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleAssessmentBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailTemplateObj                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var binarydataObject                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleDbObject                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ScheduleAssessmentBl{
    constructor() {
        appValidatorObject         = new APP_VALIATOR();
        ScheduleAssessmentDbObject = new SCHEDULE_ASSESSMENT_DB();
        emailTemplateObj           = new EMAIL_TEMPLATE();
        binarydataObject           = new BINARY_DATA();
        ScheduleDbObject           = new SCHEDULE_DB();
        inAppNotificationDbObject  = new INAPP_NOTIFICATION_DB();
    }

    start() {
    }

    /**
     * This function will fetch details of all Self Assessment By Schedule Assessment ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getSelfAssessmentSummaryByScheduleAssessmentID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.scheduleAssessmentID=request.body.scheduleAssessmentID||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution started.');

            const result = await ScheduleAssessmentDbObject.getSelfAssessmentSummaryByScheduleAssessmentID(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            var templateResult='';
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()!="empty"){
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="inprogress")
                    templateResult= await emailTemplateObj.prepareTemplates(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],"SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE");
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="completed")
                    templateResult= await emailTemplateObj.prepareTemplates(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],"SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE");
    
                    const bindsEmail={};

                    var toIDs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OtherUsersEmailID;
                    toIDs=Array.from(new Set(toIDs.split(','))).toString();
                    bindsEmail.toIDs= toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    bindsEmail.emailSubject=templateResult.Subject;
                    bindsEmail.emailContent=templateResult.Body;
                    bindsEmail.userId = userIdFromToken;
                    bindsEmail.userName = userNameFromToken; 
                    bindsEmail.createdBy = userIdFromToken || "";

                    const emailAddResult=await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of all Self Assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getDataForSelfAssessmentScreen(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution started.');

            const result = await ScheduleAssessmentDbObject.getDataForSelfAssessmentScreen(binds);

            logger.log('info', 'getDataForSelfAssessmentScreen : DBresponseResult : ' + JSON.stringify(result));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            var templateResult='';
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()!="empty"){
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="inprogress"){
                    const mapDynamicData = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    mapDynamicData["ScheduleAssessmentCode_1"]          = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                    mapDynamicData["ScheduleAssessmentDescription"]     = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
                    mapDynamicData["RISKTRAC_WEB_URL"]                  = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    templateResult= await emailTemplateObj.prepareTemplates(mapDynamicData,"SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE");
                }
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="completed")
                    templateResult= await emailTemplateObj.prepareTemplates(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],"SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE");
    
                    const bindsEmail={};

                    var toIDs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
                    // var toCCs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                    toIDs=Array.from(new Set(toIDs.split(','))).toString();
                    // toCCs=Array.from(new Set(toCCs.split(','))).toString();
                    bindsEmail.toIDs= toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    // bindsEmail.toCCs= toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    bindsEmail.emailSubject=templateResult.Subject;
                    bindsEmail.emailContent=templateResult.Body;
                    bindsEmail.userId = userIdFromToken;
                    bindsEmail.userName = userNameFromToken; 
                    bindsEmail.createdBy = userIdFromToken || "";

                    logger.log('info', 'getDataForSelfAssessmentScreen : bindsEmail : ' + JSON.stringify(bindsEmail));
                    const emailAddResult=await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            //Merging all recordset and return as single recordset
            
            let resultResponse={
                ScheduleAssessmentCard:[],
                SelfAssessmentSummary:[],
                ScheduleAssessment:[]
            }

            resultResponse.ScheduleAssessmentCard=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.SelfAssessmentSummary=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.ScheduleAssessment=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];

            var resultArr=[];
            resultArr.push(resultResponse);

            result.recordset=JSON.parse(JSON.stringify(resultArr));

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA+"|getDataForSelfAssessmentScreen", result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getDataForSelfAssessmentScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Manage Self Assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getDataForManageSelfAssessmentScreen(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var messageData             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        

        try {
            const binds             = {};
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            binds.id                = request.body.id||0;
            binds.createdBy         = userIdFromToken || "";
            binds.userId            = userIdFromToken;
            binds.userName          = userNameFromToken; 
            binds.refreshedToken    = refreshedToken;
            let navUrl              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution started.');

            const result = await ScheduleAssessmentDbObject.getDataForManageSelfAssessmentScreen(binds);
            logger.log('info', 'getDataForManageSelfAssessmentScreen : complete-rcsa-respnse :' + JSON.stringify(result));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            var templateResult='';
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()!="empty"){
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="inprogress") {
                    const mappingData1 = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];                  
                    mappingData1["ScheduleAssessmentCode_2"]     = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                    mappingData1["ScheduleAssessmentID"]         = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    mappingData1 = 'RCSA Assessment initiated: ' +  result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                    navUrl = 'self-assessments';
                    templateResult= await emailTemplateObj.prepareTemplates(mappingData1,"SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE"); 
                }
                    
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="completed"){
                    const mappingData = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    mappingData["ScheduleAssessmentCode_1"]     = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                    mappingData["ScheduleAssessmentID"]         = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    mappingData["RISKTRAC_WEB_URL"]             = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    templateResult= await emailTemplateObj.prepareTemplates(mappingData,"SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE");
                    messageData = 'RCSA Assessment has been completed: ' +  result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode; 
                    navUrl = 'schedule-assessments';
                }
    
                const bindsEmail = {};                    
                var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
                toIDs       = Array.from(new Set(toIDs.split(','))).toString();
                toCCs       = Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject     = templateResult.Subject;
                bindsEmail.emailContent     = templateResult.Body;
                bindsEmail.userId           = userIdFromToken;
                bindsEmail.userName         = userNameFromToken; 
                bindsEmail.createdBy        = userIdFromToken || "";

                logger.log('info', 'getDataForManageSelfAssessmentScreen : bindsEmail :' + JSON.stringify(bindsEmail));

                const emailAddResult=await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);

                var RGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
                var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
                var PUGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOURTEEN][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersGUID;

                let inAppUserList   = RGUID + ","+ RMGUID + "," + PUGUID;
                inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

                // mappingData["navUrl"]  = mappingData["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/' + mappingData["ScheduleAssessmentID"]    
                let inappDetails = {
                    inAppContent     : messageData + "link:" + navUrl,  
                    recepientUserID  : inAppUserList,
                    subModuleID      : 2
                }

                let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             

                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : setRCSAResponse : '  + JSON.stringify(setRCSAResponse || null));

            }

            const RCSA_MASTER_DB_RESPONSE = await ScheduleDbObject.getRCSAMasterData(userIdFromToken, userNameFromToken);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : RCSA_MASTER_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            
            const PREV_DB_RESPONSE = await ScheduleAssessmentDbObject.getPreviousInherentRiskData(binds);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : PREV_DB_RESPONSE ' + JSON.stringify(PREV_DB_RESPONSE || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == PREV_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == PREV_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : PREV_DB_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // //Merging all recordset and return as single recordset            
            let resultResponse = {
                ControlType:[],
                ControlInPace:[],
                ControlNatureScore:[],
                ControlAutomationScore:[],
                ControlFrequencyScore:[],
                ActionPlanStatus:[],
                ActionResponsiblePerson:[],
                ControlVerificationClosure:[],
                ResidualRiskResponse:[],
                ResidualRiskResponsiblePerson:[],
                ControlTestingResult:[],
                ActionTrailSummary:[],
                SelfAssessmentInfo:[],
                Evidence:[],
                MasterResidualRiskResponse:[],
                MasterRiskResponsiblePerson:[],
                MasterActionResponsiblePerson:[],
                MasterActionPlanStatus:[],
                MasterControlVerificationClosure:[],
                MasterReviewers:[],
                MasterUsersList:[],
                MasterControlTestingResult:[],
                prevQuarter : []                
            }            

            resultResponse.ControlType                      = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.ControlInPace                    = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.ControlNatureScore               = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            resultResponse.ControlAutomationScore           = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            resultResponse.ControlFrequencyScore            = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            resultResponse.ActionPlanStatus                 = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
            resultResponse.ActionResponsiblePerson          = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
            resultResponse.ControlVerificationClosure       = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
            resultResponse.ResidualRiskResponse             = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT];
            resultResponse.ResidualRiskResponsiblePerson    = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE];
            resultResponse.ControlTestingResult             = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TEN];
            resultResponse.ActionTrailSummary               = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ELEVEN];
            resultResponse.SelfAssessmentInfo               = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWELVE];
            resultResponse.Evidence                         = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIFTEEN];
            resultResponse.MasterResidualRiskResponse       = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.MasterRiskResponsiblePerson      = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.MasterActionResponsiblePerson    = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            resultResponse.MasterActionPlanStatus           = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            resultResponse.MasterControlVerificationClosure = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            resultResponse.MasterReviewers                  = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
            resultResponse.MasterControlTestingResult       = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
            resultResponse.MasterUsersList                  = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];
            resultResponse.prevQuarter                      = PREV_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            var resultArr=[];            
            resultArr.push(resultResponse);
            result.recordset =JSON.parse(JSON.stringify(resultArr));

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution end. : Data fetched successfully. resultArr : ' + JSON.stringify(result || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA+"|getDataForManageSelfAssessmentScreen", result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getDataForManageSelfAssessmentScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch Self Assessment By Schedule Assessment ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getSelfAssessmentDetailsByScheduleInherentID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.scheduleAssessmentID=request.body.scheduleAssessmentID||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution started.');

            const result = await ScheduleAssessmentDbObject.getSelfAssessmentDetailsByScheduleInherentID(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            var templateResult='';
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()!="empty"){
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="inprogress")
                    templateResult= await emailTemplateObj.prepareTemplates(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],"SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE");
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="completed")
                    templateResult= await emailTemplateObj.prepareTemplates(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],"SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE");
    
                    const bindsEmail={};

                    var toIDs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OtherUsersEmailID;
                    toIDs=Array.from(new Set(toIDs.split(','))).toString();
                    bindsEmail.toIDs= toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    bindsEmail.emailSubject=templateResult.Subject;
                    bindsEmail.emailContent=templateResult.Body;
                    bindsEmail.userId = userIdFromToken;
                    bindsEmail.userName = userNameFromToken; 
                    bindsEmail.createdBy = userIdFromToken || "";

                    const emailAddResult=await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of all Schedule Assessment Cards from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllScheduleAssessmentCards(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution started.');

            const result = await ScheduleAssessmentDbObject.getAllScheduleAssessmentCards(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getAllScheduleAssessmentCards : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Schedule Assessment by ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduleAssessmentByID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution started.');

            const result = await ScheduleAssessmentDbObject.getScheduleAssessmentByID(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            var templateResult='';
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()!="empty"){
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="inprogress")
                    templateResult= await emailTemplateObj.prepareTemplates(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],"SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE");
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="completed")
                    templateResult= await emailTemplateObj.prepareTemplates(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO],"SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE");
    
                    const bindsEmail={};

                    var toIDs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OtherUsersEmailID;
                    toIDs=Array.from(new Set(toIDs.split(','))).toString();
                    bindsEmail.toIDs= toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    bindsEmail.emailSubject=templateResult.Subject;
                    bindsEmail.emailContent=templateResult.Body;
                    bindsEmail.userId = userIdFromToken;
                    bindsEmail.userName = userNameFromToken; 
                    bindsEmail.createdBy = userIdFromToken || "";

                    const emailAddResult=await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getScheduleAssessmentByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of all Self Assessment By Status from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getSelfAssessmentSummaryByStatus(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.scheduleInherentRiskStatusID=request.body.scheduleInherentRiskStatusID||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution started.');

            const result = await ScheduleAssessmentDbObject.getSelfAssessmentSummaryByStatus(binds);

            let resultResponse={
                SelfAssessmentSummary:[]
            }

            resultResponse.SelfAssessmentSummary=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            var resultArr=[];
            resultArr.push(resultResponse);

            result.recordset=JSON.parse(JSON.stringify(resultArr));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA+"|getSelfAssessmentSummaryByStatus", result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getSelfAssessmentSummaryByStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update approved schedule inherent risk reviewer details to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateApprovedScheduleInherentRiskReviewerDetails(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.reviewerComment = request.body.reviewerComment||"";
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution started.');

            const result = await ScheduleAssessmentDbObject.updateApprovedScheduleInherentRiskReviewerDetails(binds);
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : ' + JSON.stringify(result || null));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            const templateObject = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            templateObject["ScheduleAssessmentCode_1"]      = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
            templateObject["ScheduleAssessmentDescription"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
            templateObject["ScheduleAssessmentID"]          = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            templateObject["UnitName"]                      = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName;
            templateObject["RISKTRAC_WEB_URL"]              = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            const templateResult= await emailTemplateObj.prepareTemplates(templateObject,"SELF_ASSESSMENT_APPROVED_EMAIL_TEMPLATE");

            const bindsEmail={};

            var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
            var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
            toIDs       = Array.from(new Set(toIDs.split(','))).toString();
            toCCs       = Array.from(new Set(toCCs.split(','))).toString();
            bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.emailSubject     = templateResult.Subject;
            bindsEmail.emailContent     = templateResult.Body;
            bindsEmail.userId           = userIdFromToken;
            bindsEmail.userName         = userNameFromToken; 
            bindsEmail.createdBy        = userIdFromToken || "";

            var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID; 
            var PUGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersGUID; 

            const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            let inAppUserList   = PUGUID + ","+ RMGUID;
            inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

            // templateObject["navUrl"]     = templateObject["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/'  + templateObject["ScheduleAssessmentID"] 
            let inappDetails = {
                inAppContent     : 'RCSA Assessment has been Approved for your Department: ' +  templateObject["UnitName"]  +": " + templateObject["ScheduleAssessmentCode_1"] + "link:" + 'self-assessments' , //templateObject["navUrl"] , 
                recepientUserID  : inAppUserList,
                subModuleID      : 2
            }

            let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateApprovedScheduleInherentRiskReviewerDetails : inappDetails    : '  + JSON.stringify(inappDetails || null));
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateApprovedScheduleInherentRiskReviewerDetails : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateApprovedScheduleInherentRiskReviewerDetails : setRCSAResponse : '  + JSON.stringify(setRCSAResponse || null));



            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update rejected schedule inherent risk reviewer details to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateRejectedScheduleInherentRiskReviewerDetails(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.reviewerComment = request.body.reviewerComment||"";
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.reviewerComment) || appValidatorObject.isStringNull(request.body.reviewerComment) || appValidatorObject.isStringEmpty(request.body.reviewerComment)){
                validationMessage.push('Reviewer Comment');
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution started.');



            const result = await ScheduleAssessmentDbObject.updateRejectedScheduleInherentRiskReviewerDetails(binds);
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : result :: '  + JSON.stringify(result || null));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            const mappedData                            = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            mappedData["ScheduleAssessmentCode_1"]      = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
            mappedData["ScheduleAssessmentID"]          = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            mappedData["ScheduleAssessmentDescription"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
            mappedData["UnitName"]                      = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName;
            mappedData["InherentRiskID"]                = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleInherentRiskID;
            mappedData["RISKTRAC_WEB_URL"]              = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
             //ScheduleInherentRiskID
            const templateResult= await emailTemplateObj.prepareTemplates(mappedData,"SELF_ASSESSMENT_REJECTED_EMAIL_TEMPLATE");

            const bindsEmail = {};
            var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
            var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
            toIDs       = Array.from(new Set(toIDs.split(','))).toString();
            toCCs       = Array.from(new Set(toCCs.split(','))).toString();
            bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.emailSubject     = templateResult.Subject;
            bindsEmail.emailContent     = templateResult.Body;
            bindsEmail.userId           = userIdFromToken;
            bindsEmail.userName         = userNameFromToken; 
            bindsEmail.createdBy        = userIdFromToken || "";

            const emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
            var PUGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersGUID;
            var RMGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
            // mappedData["navUrl"]                        = mappedData["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/' + mappedData["ScheduleAssessmentID"] 
            let inAppUserList   = PUGUID + ","+ RMGUID;
            inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

            let inappDetails = {
                inAppContent    : 'RCSA Assessment has been Rejected for your Department: '+mappedData["UnitName"]  +": " + mappedData["ScheduleAssessmentCode_1"] + "link:" + 'self-assessments' ,  //mappedData["navUrl"] ,                
                recepientUserID : inAppUserList,
                subModuleID     : 2
            }
          
            let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateRejectedScheduleInherentRiskReviewerDetails : inappDetails    : '  + JSON.stringify(inappDetails || null));
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateRejectedScheduleInherentRiskReviewerDetails : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateRejectedScheduleInherentRiskReviewerDetails : setRCSAResponse : '  + JSON.stringify(setRCSAResponse || null));

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will manage schedule assessment details to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async manageScheduleAssessmentDetails(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.controlDescription = request.body.controlDescription||'';
            binds.controlAssessmentAndResidualRiskJSONData = JSON.stringify(request.body.controlAssessmentAndResidualRiskJSONData)||'';
            binds.controlTestingResultComment = request.body.controlTestingResultComment||'';
            binds.controlTestingJSONData = JSON.stringify(request.body.controlTestingJSONData)||'';
            binds.identifiedAction = request.body.identifiedAction||'';
            binds.actionPlanComments = request.body.actionPlanComments||'';
            binds.scheduleActionPlanJSONData = JSON.stringify(request.body.scheduleActionPlanJSONData)||'';
            binds.selfComment = request.body.selfComment||'';
            binds.isSubmit = request.body.isSubmit||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.scheduleAssessmentID=request.body.scheduleAssessmentID;
            let respMessage = null

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution started.');

            const result = await ScheduleAssessmentDbObject.manageScheduleAssessmentDetails(binds);

            logger.log('info', 'result-resubmit-scenario : ' + JSON.stringify(result));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            const resultRecordSet= result.recordset;

            if(binds.isSubmit) {
                // respMessage = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA
                const dynamicObject = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                dynamicObject["ScheduleAssessmentCode_1"]       = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                dynamicObject["ScheduleAssessmentDescription"]  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
                dynamicObject["UnitName"]                       = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName;
                dynamicObject["RISKTRAC_WEB_URL"]               = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];  
                dynamicObject["ScheduleAssessmentID"]           = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;       
                
                const templateResult= await emailTemplateObj.prepareTemplates(dynamicObject,"SELF_ASSESSMENT_RESUBMIT_EMAIL_TEMPLATE");

                const bindsEmail={};

                var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
                toIDs       = Array.from(new Set(toIDs.split(','))).toString();
                toCCs       = Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject     = templateResult.Subject;
                bindsEmail.emailContent     = templateResult.Body;
                bindsEmail.userId           = userIdFromToken;
                bindsEmail.userName         = userNameFromToken; 
                bindsEmail.createdBy        = userIdFromToken || "";

                const emailAddResult        = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
                var RGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
                var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
                let inAppUserList   = RGUID + ","+ RMGUID;
                inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

                // dynamicObject["navUrl"]                        = dynamicObject["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/' + dynamicObject["ScheduleAssessmentID"]   
                let inappDetails = {
                    inAppContent     : 'RCSA Assessment has been Re-Submitted for Review: ' + dynamicObject["UnitName"]+": "+  dynamicObject["ScheduleAssessmentCode_1"] + " link:" +  'self-assessments' , //dynamicObject["navUrl"] , 
                    recepientUserID  : inAppUserList,
                    subModuleID      : 2
                }
               
                let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             

                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : manageScheduleAssessmentDetails : inappDetails    : '  + JSON.stringify(inappDetails || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : manageScheduleAssessmentDetails : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : manageScheduleAssessmentDetails : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
    
            }
            
            result.recordset = resultRecordSet;
            
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, binds.isSubmit ? MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : manageScheduleAssessmentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch schedule inherent risk action trail from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduleInherentRiskActionTrail(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleInherentRiskActiontrail : Execution started.');

            const result = await ScheduleAssessmentDbObject.getScheduleInherentRiskActionTrail(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getScheduleInherentRiskActionTrail : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch action responsible person from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getActionResponsiblePerson(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution started.');

            const result = await ScheduleAssessmentDbObject.getActionResponsiblePerson(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getActionResponsiblePerson : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch residual risk response from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getResidualRiskResponse(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponse : Execution started.');

            const result = await ScheduleAssessmentDbObject.getResidualRiskResponse(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getResidualRiskResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch control type from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getControlType(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getControlType : Execution started.');

            const result = await ScheduleAssessmentDbObject.getControlType(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getControlType : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getControlType : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getControlType : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getControlType : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getControlType : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getControlType : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch residual risk responsible person from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getResidualRiskResponsiblePerson(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution started.');

            const result = await ScheduleAssessmentDbObject.getResidualRiskResponsiblePerson(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : getResidualRiskResponsiblePerson : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will submit self assessment by schedule assessment to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async submitSelfAssessmentsByScheduleAssessment(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let messageData             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;            
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution started.');

            const result = await ScheduleAssessmentDbObject.submitSelfAssessmentsByScheduleAssessment(binds);

            logger.log('info', 'submitSelfAssessmentsByScheduleAssessment : result-unit-names : ' + JSON.stringify(result));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            if (result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length) {
                const SAMasterData = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                SAMasterData["ScheduleAssessmentCode_1"]        = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode;
                SAMasterData["ScheduleAssessmentDescription"]   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription;
                SAMasterData["InherentRiskID"]                  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleInherentRiskID;
                SAMasterData["UnitName"]                        = formatUnitNames(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName);
                SAMasterData["RCSAUnitName"]                    = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAUnitName;
                SAMasterData["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                SAMasterData["ScheduleAssessmentID"]            = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;       
                
                let templateResult = {};
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote == "Submit") {
                    templateResult  = await emailTemplateObj.prepareTemplates(SAMasterData,"SELF_ASSESSMENT_SUBMIT_EMAIL_TEMPLATE");
                    messageData     = 'RCSA Assessment has been Submitted for Review: ' + SAMasterData["ScheduleAssessmentCode_1"] + ", Unit : " +  SAMasterData["RCSAUnitName"];
                }else {
                    templateResult  = await emailTemplateObj.prepareTemplates(SAMasterData,"SELF_ASSESSMENT_RESUBMIT_EMAIL_TEMPLATE");
                    messageData     = 'RCSA Assessment has been Re-Submitted for Review: ' + SAMasterData["ScheduleAssessmentCode_1"] + ", Unit : " +  SAMasterData["RCSAUnitName"];  
                }
                // const templateResult = await emailTemplateObj.prepareTemplates(SAMasterData,"SELF_ASSESSMENT_SUBMIT_EMAIL_TEMPLATE");
    
                const bindsEmail={};
    
                var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
                toIDs       = Array.from(new Set(toIDs.split(','))).toString();
                toCCs       = Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject     = templateResult.Subject;
                bindsEmail.emailContent     = templateResult.Body;
                bindsEmail.userId           = userIdFromToken;
                bindsEmail.userName         = userNameFromToken; 
                bindsEmail.createdBy        = userIdFromToken || "";
    
                logger.log('info', 'bindsEmail : ' + JSON.stringify(bindsEmail));
    
                let emailAddResult = await ScheduleAssessmentDbObject.addEmailAlerts(bindsEmail);
                var RGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
                var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
                var PUGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersGUID;
                let inAppUserList   = RGUID + ","+ RMGUID + "," + PUGUID;
                inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

                // SAMasterData["navUrl"]                        = SAMasterData["RISKTRAC_WEB_URL"] + 'orm/self-assessments/self-assessments-details/637'+ SAMasterData["ScheduleAssessmentID"]  
                let inappDetails = {
                    inAppContent: messageData +  "link:" + 'self-assessments' ,  //SAMasterData["navUrl"] , 
                    recepientUserID  : inAppUserList,
                    subModuleID      : 2
                }
    
                let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             
    
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : setRCSAResponse : '  + JSON.stringify(setRCSAResponse || null));
            }        
           
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.SUBMIT_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : submitSelfAssessmentsByScheduleAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * To upload rcsa evidence 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async uploadRCSAEvidence(request, response) {
        try {
            response.setTimeout(1200000);

            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var remarks             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var id             = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            var destinationPath     = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_DESTINATION_PATH;
            var data = {               
                fileName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileContent : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                fileType    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL 
            };

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            remarks             = request.body.remarks;  
            id                  = request.body.id;

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution started.');

            if (request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED &&
                request.files !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL &&
                Object.keys(request.files).length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO)
            {   
                
                const ALLOWED_FILE_EXTENSION_TYPES  = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_EXTENSIONS_LIST;
                const ALLOWED_FILE_MIME_TYPES       = APP_CONFIG_FILE_OBJ.FILE_UPLOAD.EVIDENCE_FILE_MIME_TYPES
                
                await binarydataObject.uploadFilesInBinaryFormat(request, destinationPath, ALLOWED_FILE_EXTENSION_TYPES,ALLOWED_FILE_MIME_TYPES, userIdFromToken, function(fileUploadResponseObject){
                    if(fileUploadResponseObject.status == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){
                  
                        data.fileName       = fileUploadResponseObject.fileName;                        
                        data.fileContent    = fileUploadResponseObject.fileDataContent;
                        data.fileType       = fileUploadResponseObject.fileExtension;

                        ScheduleAssessmentDbObject.uploadRCSAEvidence(id, userIdFromToken, userNameFromToken, data,remarks, async function(ADD_RCSA_EVIDENCE){
                            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == ADD_RCSA_EVIDENCE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == ADD_RCSA_EVIDENCE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Upload RAT response is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_RCSA_EVIDENCE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Error details : ' + ADD_RCSA_EVIDENCE.errorMsg);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                            }
                            if (ADD_RCSA_EVIDENCE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && ADD_RCSA_EVIDENCE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Error details : ' + ADD_RCSA_EVIDENCE.procedureMessage);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FILE_EXIST));
                            }

                            /**
                             * Formating resultset provided by DB : START.
                             */
                            const FORMAT_DATA_RESULT =  await formatEvidencelist(userIdFromToken,ADD_RCSA_EVIDENCE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);
                            /**
                             * Formating resultset provided by DB : END.
                             */

                            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_DATA_RESULT || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_DATA_RESULT) {
                                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : FORMAT_DATA_RESULT is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
                            }
                                
                            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : RCSA evidence uploaded successfully.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_SUCCESSFUL,FORMAT_DATA_RESULT));
                        });
                    }
                    else {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Error on dumping file into server. : Error detail : '+fileUploadResponseObject.errorMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
                    }
                });
            } 
            else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : No file to upload.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_FILE_TO_UPLOAD));
            }
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : uploadRCSAEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPLOAD_FAIL));
        }
    }

     /**
     * To download RCSA evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async downloadRCSAEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            evidenceID          = request.body.evidenceID;           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID){
                logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

           const DOWNLOAD__RESPONSE = await ScheduleAssessmentDbObject.downloadRCSAEvidence(userIdFromToken, userNameFromToken, evidenceID);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DOWNLOAD__RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DOWNLOAD__RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : DOWNLOAD__RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
            if (DOWNLOAD__RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DOWNLOAD__RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Error details : ' + DOWNLOAD__RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }
    
            //Formating DB response 
            const RCSA_DOWNLOAD_RESPONSE = await formatDownloadResponse(userIdFromToken,DOWNLOAD__RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_DOWNLOAD_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_DOWNLOAD_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : GET_RCSA_FORMAT_DATA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : RCSA evidence Downloaded successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA, RCSA_DOWNLOAD_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : downloadRCSAEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DOWNLOAD_DATA_UNSUCCESSFUL));
        }
    } 
    
    /**
     * To delete RCSA evidence
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteRCSAEvidence(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;            
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let evidenceID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            evidenceID                = request.body.evidenceID;           

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution started.');

            
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID){
                logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == evidenceID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == evidenceID || appValidatorObject.isStringEmpty(evidenceID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : evidenceID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EVIDENCE_ID_NULL_EMPTY));
            }
            /**
             * Validating input parameters : END
             */

            const DELETE_RESPONSE = await ScheduleAssessmentDbObject.deleteRCSAEvidence(userIdFromToken, userNameFromToken, evidenceID);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DELETE_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DELETE_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : DELETE_RESPONSE of RCSA is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (DELETE_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DELETE_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Error details : ' + DELETE_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : RCSA evidence deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, CONSTANT_FILE_OBJ.APP_CONSTANT.NULL));

        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentBl : deleteRCSAEvidence : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    stop() {
    }

}



function validateAndReturnData(response, result, userId, refreshedToken, methodName ){

}


function unsuccessfulResponse(refreshedToken, errorMessage){
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : errorMessage
        }
    }
}

function successfulResponse(refreshedToken, successMessage, result){
    //Change the response format for specified API's
    if(successMessage.split("|").length>1){
        result.recordset=result.recordset[0];
        successMessage=successMessage.split("|")[0];
    }

    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : refreshedToken,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        }
    }
}

/**
 * This is function will format DB response of upload rcsa .
 */
async function formatEvidencelist(userIdFromToken,dbRecordSet){ 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : formatEvidencelist : Execution started.'); 

        let evidences = []; 

        // forming uploadedrcsa evidence data for UI.  
        evidences.push({
            "EvidenceID"        : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].EvidenceID,
            "OriginalFileName"  : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OriginalFileName,
            "Remark"            : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].Remark
        });

        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : formatEvidencelist : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : formatEvidencelist : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format DB response of download rcsa evidence .
 */
async function formatDownloadResponse(userIdFromToken,dbRecordSet){ 
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : formatDownloadResponse : Execution started.'); 

        let evidences = []; 
        // forming uploadedrcsa evidence data for UI.  
        evidences.push({
            "OriginalFileName"  : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OriginalFileName,
            "FileType"          : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileType,
            "FileContent"       : dbRecordSet[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].FileContent
        });

        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : formatDownloadResponse : Execution end.');

        // Forming final data to send UI.
        return {
            "fileData"  : evidences
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentBl : formatDownloadResponse : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This function will format the unit names string to a unique string containing unique unit name
 */
function formatUnitNames(commaSeparatedString) {
    try {
        logger.log('info', 'formatUnitNames : Execution Started...');
        const valuesArray = commaSeparatedString.split(',');
        const uniqueValueSet = [...new Set(valuesArray)];
        const stringFromSet = Array.from(uniqueValueSet).join(', ');

        logger.log('info', 'formatUnitNames : stringFromSet : ' + stringFromSet);
        return stringFromSet;
    } catch (error) {
        logger.log('info', 'formatUnitNames : Execution end : Got unhandled error : Error detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to return single instance of class.
 */
 function getScheduleAssessmentBLClassInstance() {
    if (ScheduleAssessmentBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        ScheduleAssessmentBlClassInstance = new ScheduleAssessmentBl();
    }
    return ScheduleAssessmentBlClassInstance;
}

exports.getScheduleAssessmentBLClassInstance = getScheduleAssessmentBLClassInstance;