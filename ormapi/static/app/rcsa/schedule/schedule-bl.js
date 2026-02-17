const APP_VALIATOR          = require('../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../../utility/constants/constant.js');
const SCHEDULE_DB           = require('../../../data-access/schedule-db.js');
const EMAIL_TEMPLATE        = require('../../../utility/email-templates-rcsa.js');
const APP_CONFIG_FILE_OBJ   = require('../../../config/app-config.js');
const INAPP_NOTIFICATION_DB = require('../../../data-access/inApp-notification-db.js');
const UtilityApp            = require('../../../utility/utility.js');

var appValidatorObject        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var ScheduleBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var emailTemplateObj          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var inAppNotificationDbObject = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class ScheduleBl{
    constructor() {
        appValidatorObject          = new APP_VALIATOR();
        ScheduleDbObject            = new SCHEDULE_DB();
        emailTemplateObj            = new EMAIL_TEMPLATE();
        inAppNotificationDbObject   = new INAPP_NOTIFICATION_DB();
        utilityAppObject            = new UtilityApp();
    }

    start() {

    }

    /**
     * This function will fetch details of Schedule Period from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getSchedulePeriod(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSchedulePeriod : Execution started.');

            const result = await ScheduleDbObject.getSchedulePeriod(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSchedulePeriod : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSchedulePeriod : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSchedulePeriod : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSchedulePeriod : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSchedulePeriod : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getSchedulePeriod : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Schedule Assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getDataForScheduleAssessmentScreen(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let setRCSAResponse         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let messageData             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let RGUID                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let RPUGUID                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds             = {};
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            binds.scheduleYear      = request.body.scheduleYear || 0;
            binds.createdBy         = userIdFromToken || "";
            binds.userId            = userIdFromToken;
            binds.userName          = userNameFromToken; 
            binds.refreshedToken    = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : Execution started.');

            const result = await ScheduleDbObject.getDataForScheduleAssessmentScreen(binds);

            logger.log('info', 'getDataForScheduleAssessmentScreen : result-inprogress-button : ' + JSON.stringify(result));
            
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            let arrValExists = result.recordset.some(a => typeof a == 'object' && a.length>0);

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && !arrValExists){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }
            
            var templateResult;
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()!="empty"){
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="inprogress"){
                    const changeMasterData                              =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    changeMasterData["ScheduleAssessmentCode_1"]        =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    changeMasterData["ScheduleAssessmentDescription"]   =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    changeMasterData["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    templateResult  = await emailTemplateObj.prepareTemplates(changeMasterData,"SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE");
                    messageData     = 'RCSA Assessment has been moved to In-progress : ' + changeMasterData["ScheduleAssessmentCode_1"];                    
                    RGUID           =  result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID
                    RPUGUID         =  result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUserGUID
                }
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="completed"){
                    const changeMasterData_1                              =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];                    
                    changeMasterData_1["ScheduleAssessmentCode_1"]        =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    changeMasterData_1["ScheduleAssessmentDescription"]   =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    changeMasterData_1["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    RGUID           = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID
                    RPUGUID         = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUserGUID
                    templateResult  = await emailTemplateObj.prepareTemplates(changeMasterData_1,"SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE");
                    messageData     = 'RCSA Assessment has been completed : ' + changeMasterData_1["ScheduleAssessmentCode_1"];
                }
                    const bindsEmail = {};
                    var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID;
                    toIDs       = Array.from(new Set(toIDs.split(','))).toString();
                    bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    bindsEmail.emailSubject     = templateResult.Subject;
                    bindsEmail.emailContent     = templateResult.Body;
                    bindsEmail.userId           = userIdFromToken;
                    bindsEmail.userName         = userNameFromToken; 
                    bindsEmail.createdBy        = userIdFromToken || "";

                    logger.log('info', 'getDataForScheduleAssessmentScreen : bindsEmail : ' + JSON.stringify(bindsEmail));

                    const emailAddResult = await ScheduleDbObject.addEmailAlerts(bindsEmail);
                    let inAppUserList   = RGUID + ","+ RPUGUID;
                    inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')
    
                    let inappDetails = {
                        inAppContent: messageData + "link:" + 'schedule-assessments', 
                        recepientUserID  : inAppUserList,
                        subModuleID      : 2
                    }
                    
                    setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);
                    logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
                    logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : emailAddResult : '  + JSON.stringify(emailAddResult || null));
                    logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));

            }            
            //Merging all recordset and return as single recordset            
            let resultResponse = {
                AssessmentYears         : [],
                AssessmentCard          : [],
                GetAssessmentSummary    : [],
                SchedulePermission      : [],
                InProgressAssessment    : []
            }

            resultResponse.AssessmentYears          = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.AssessmentCard           = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.GetAssessmentSummary     = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            resultResponse.SchedulePermission       = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            resultResponse.InProgressAssessment     = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];

            var resultArr = [];
            resultArr.push(resultResponse);
            result.recordset=JSON.parse(JSON.stringify(resultArr));

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForScheduleAssessmentScreen : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA+"|getDataForScheduleAssessmentScreen", result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getDataForScheduleAssessmentScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Schedule Assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getDataForManageScheduleAssessmentScreen(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.scheduleYear = request.body.scheduleYear || 0;
            binds.scheduleAssessmentID = request.body.scheduleAssessmentID || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForManageScheduleAssessmentScreen : Execution started.');

            const result = await ScheduleDbObject.getDataForManageScheduleAssessmentScreen(binds);

            //Merging all recordset and return as single recordset
            
            let resultResponse={
                SchedeuleAssessmentPeriod:[],
                Reviewer:[],
                ScheduleAssessmentInfo:[]
            }

            resultResponse.SchedeuleAssessmentPeriod=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.Reviewer=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.ScheduleAssessmentInfo=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];

            var resultArr=[];
            resultArr.push(resultResponse);

            result.recordset=JSON.parse(JSON.stringify(resultArr));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForManageScheduleAssessmentScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForManageScheduleAssessmentScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForManageScheduleAssessmentScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForManageScheduleAssessmentScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getDataForManageScheduleAssessmentScreen : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA+"|getDataForManageScheduleAssessmentScreen", result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getDataForManageScheduleAssessmentScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Reviewer from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllActiveReviewer(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveReviewer : Execution started.');

            const result = await ScheduleDbObject.getAllActiveReviewer(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveReviewer : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveReviewer : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveReviewer : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveReviewer : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveReviewer : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getAllActiveReviewer : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch details of Reviewer By ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getReviewerByID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getReviewerByID : Execution started.');

            const result = await ScheduleDbObject.getReviewerByID(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getReviewerByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getReviewerByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getReviewerByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getReviewerByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getReviewerByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getReviewerByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }


    /**
     * This function will add the schedule assessment to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addScheduleAssessment(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id || 0;
            binds.schedulePeriod=request.body.schedulePeriod||"";
            binds.scheduleAssessmentDescription=request.body.scheduleAssessmentDescription||"";
            binds.proposedStartDate=request.body.proposedStartDate||"";
            binds.proposedCompletionDate=request.body.proposedCompletionDate||"";
            binds.primaryReviewerID=request.body.primaryReviewerID||0;
            binds.secondaryReviewerID=request.body.secondaryReviewerID||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.reminderDate = request.body.reminderDate
            binds.refreshedToken = refreshedToken;

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.schedulePeriod) || appValidatorObject.isStringNull(request.body.schedulePeriod) || appValidatorObject.isStringEmpty(request.body.schedulePeriod)){
                validationMessage.push('Schedule Period');
            }

            if(appValidatorObject.isStringUndefined(request.body.scheduleAssessmentDescription) || appValidatorObject.isStringNull(request.body.scheduleAssessmentDescription) || appValidatorObject.isStringEmpty(request.body.scheduleAssessmentDescription)){
                validationMessage.push('Schedule Assessment Description');
            }

            if(appValidatorObject.isStringUndefined(request.body.proposedStartDate) || appValidatorObject.isStringNull(request.body.proposedStartDate) || appValidatorObject.isStringEmpty(request.body.proposedStartDate)){
                validationMessage.push('Proposed Start Date');
            }

            if(appValidatorObject.isStringUndefined(request.body.proposedCompletionDate) || appValidatorObject.isStringNull(request.body.proposedCompletionDate) || appValidatorObject.isStringEmpty(request.body.proposedCompletionDate)){
                validationMessage.push('Proposed Completion Date');
            }

            if(request.body.primaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.primaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Primary Review ID');
            }

            if(request.body.secondaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.secondaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Secondary Review ID');
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : Execution started.');

            const result = await ScheduleDbObject.addScheduleAssessment(binds);

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : result : ' + JSON.stringify(result));

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }
            
            // masterData is the templateObj that is passed along with template to dynamically pair with values with email template.
            const masterData = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            masterData["ScheduleAssessmentCode"]        = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["ScheduleAssessmentID"]          = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["ScheduleAssessmentCode_1"]      = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["ScheduleAssessmentDescription"] = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["RISKTRAC_WEB_URL"]              = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            
            const templateResult= await emailTemplateObj.prepareTemplates(masterData,"SCHEDULE_ASSESSMENT_NEW_EMAIL_TEMPLATE");

            const bindsEmail={};

            var toIDs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;            
            var toCCs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
            logger.log('info', 'toIDs :: ScheduleBl : addScheduleAssessment : ' + JSON.stringify(toIDs));  
            logger.log('info', 'toCCs :: ScheduleBl : addScheduleAssessment : ' + JSON.stringify(toCCs));
            toIDs   = Array.from(new Set(toIDs.split(','))).toString();
            toCCs   = Array.from(new Set(toCCs.split(','))).toString();
            bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
            bindsEmail.emailSubject     = templateResult.Subject;
            bindsEmail.emailContent     = templateResult.Body;
            bindsEmail.userId           = userIdFromToken;
            bindsEmail.userName         = userNameFromToken; 
            bindsEmail.createdBy        = userIdFromToken || "";
            // bindsEmail.masterData = 
            var RGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
            var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;


            logger.log('info', 'User Id : '+ binds.userId +' : bindsEmail: ' + JSON.stringify(bindsEmail));

            const emailAddResult = await ScheduleDbObject.addEmailAlerts(bindsEmail);
            let inAppUserList   = RGUID + ","+ RMGUID;
            inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')

            // masterData["navUrl"] = masterData["RISKTRAC_WEB_URL"] + 'orm/schedule-assessments'     //self-assessments-details/' + masterData["ScheduleAssessmentID"]  
            let inappDetails = {
                inAppContent: 'RCSA Assessment Initiated: ' +   masterData["ScheduleAssessmentCode_1"] + "link:" + 'schedule-assessments', //masterData["navUrl"] , 
                recepientUserID  : inAppUserList,
                subModuleID      : 2
            }

            let setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));

            result.recordset=[];
            
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : Execution end. : Data added successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : addScheduleAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

     /**
     * This function will update the schedule assessment to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async updateScheduleAssessment(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id || 0;
            binds.schedulePeriod=request.body.schedulePeriod||"";
            binds.scheduleAssessmentDescription=request.body.scheduleAssessmentDescription||"";
            binds.proposedStartDate=request.body.proposedStartDate||"";
            binds.proposedCompletionDate=request.body.proposedCompletionDate||"";
            binds.primaryReviewerID=request.body.primaryReviewerID||0;
            binds.secondaryReviewerID=request.body.secondaryReviewerID||0;
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;
            binds.reminderDate = request.body.reminderDate;

            //Validating the necessary request values
            var validationMessage=[];

            if(appValidatorObject.isStringUndefined(request.body.schedulePeriod) || appValidatorObject.isStringNull(request.body.schedulePeriod) || appValidatorObject.isStringEmpty(request.body.schedulePeriod)){
                validationMessage.push('Schedule Period');
            }

            if(appValidatorObject.isStringUndefined(request.body.scheduleAssessmentDescription) || appValidatorObject.isStringNull(request.body.scheduleAssessmentDescription) || appValidatorObject.isStringEmpty(request.body.scheduleAssessmentDescription)){
                validationMessage.push('Schedule Assessment Description');
            }

            if(appValidatorObject.isStringUndefined(request.body.proposedStartDate) || appValidatorObject.isStringNull(request.body.proposedStartDate) || appValidatorObject.isStringEmpty(request.body.proposedStartDate)){
                validationMessage.push('Proposed Start Date');
            }

            if(appValidatorObject.isStringUndefined(request.body.proposedCompletionDate) || appValidatorObject.isStringNull(request.body.proposedCompletionDate) || appValidatorObject.isStringEmpty(request.body.proposedCompletionDate)){
                validationMessage.push('Proposed Completion Date');
            }

            if(request.body.primaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.primaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Primary Review ID');
            }

            if(request.body.secondaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.secondaryReviewerID==CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                validationMessage.push('Secondary Review ID');
            }
            
            if(validationMessage.length>0){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : '+ validationMessage.join(', ') +' parameter(s) is missing');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, validationMessage.join(', ') + " parameter(s) missing."));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : Execution started.');

            const result = await ScheduleDbObject.updateScheduleAssessment(binds);

            logger.log('info', 'updateScheduleAssessment : result-recordset-finding : ' + JSON.stringify(result));
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="update")
            {
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : result-update : ' + JSON.stringify(result));
                const RCSAMasterData                              = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                RCSAMasterData["ScheduleAssessmentCode_1"]        =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData["ScheduleAssessmentID"]            =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData["ScheduleAssessmentDescription"]   =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                const templateResult= await emailTemplateObj.prepareTemplates(RCSAMasterData,"SCHEDULE_ASSESSMENT_UPDATE_EMAIL_TEMPLATE");

                const bindsEmail={};
    
                var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
                toIDs       = Array.from(new Set(toIDs.split(','))).toString();
                toCCs       = Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject     = templateResult.Subject;
                bindsEmail.emailContent     = templateResult.Body;
                bindsEmail.userId           = userIdFromToken;
                bindsEmail.userName         = userNameFromToken; 
                bindsEmail.createdBy        = userIdFromToken || "";

                var RGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
                var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
                let inAppUserList   = RGUID + ","+ RMGUID;
                inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')
    
                // RCSAMasterData["navUrl"]  = RCSAMasterData["RISKTRAC_WEB_URL"] + 'orm/schedule-assessments'     //self-assessments-details/' + RCSAMasterData["ScheduleAssessmentID"]   
                let inappDetails = {
                    inAppContent: 'RCSA Assessment details has been updated: ' +   RCSAMasterData["ScheduleAssessmentCode_1"] + "link:" + 'schedule-assessments',//RCSAMasterData["navUrl"] , 
                    recepientUserID  : inAppUserList,
                    subModuleID      : 2
                }

                let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             
                const emailAddResult  = await ScheduleDbObject.addEmailAlerts(bindsEmail);

                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
    
            }
            
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="update old reviewer")
            {
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : result-update-old-reviewer : ' + JSON.stringify(result));
                const RCSAMasterData_1                              = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                RCSAMasterData_1["ScheduleAssessmentID"]            = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData_1["ScheduleAssessmentCode_1"]        = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData_1["ScheduleAssessmentDescription"]   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData_1["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                const templateResult= await emailTemplateObj.prepareTemplates(RCSAMasterData_1,"SCHEDULE_ASSESSMENT_OLD_REVIEWER_UPDATE_EMAIL_TEMPLATE");

                const bindsEmail={};
    
                var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
                toIDs       = Array.from(new Set(toIDs.split(','))).toString();
                logger.log('info', 'old reviewer toID list : ' + JSON.stringify(toIDs));
                toCCs       = Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject     = templateResult.Subject;
                bindsEmail.emailContent     = templateResult.Body;
                bindsEmail.userId           = userIdFromToken;
                bindsEmail.userName         = userNameFromToken; 
                bindsEmail.createdBy        = userIdFromToken || "";
    
                const emailAddResult=await ScheduleDbObject.addEmailAlerts(bindsEmail);
                var RGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
                var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;
                var OLDReviewersGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OLDReviewersGUID;
                
                let inAppUserList   = OLDReviewersGUID;
                inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')
                   
                // RCSAMasterData_1["navUrl"] = RCSAMasterData_1["RISKTRAC_WEB_URL"] + 'orm/schedule-assessments'     //self-assessments-details/' + RCSAMasterData_1["ScheduleAssessmentID"]   
                let inappDetails = {
                    inAppContent: 'RCSA Assessment details has been updated: ' +   RCSAMasterData_1["ScheduleAssessmentCode_1"] + "link:" + 'schedule-assessments',//RCSAMasterData_1["navUrl"] , 
                    recepientUserID  : inAppUserList,
                    subModuleID      : 2
                }

                let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             
                
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
    
            }
            
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="update new reviewer")
            {
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : result-update-new-reviewer : ' + JSON.stringify(result));
                const RCSAMasterData_2                              = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                RCSAMasterData_2["ScheduleAssessmentCode_1"]        =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData_2["ScheduleAssessmentID"]            =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData_2["ScheduleAssessmentDescription"]   =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                RCSAMasterData_2["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                const templateResult= await emailTemplateObj.prepareTemplates(RCSAMasterData_2,"SCHEDULE_ASSESSMENT_REVIEWER_UPDATE_EMAIL_TEMPLATE");

                const bindsEmail={};
                logger.log('info', 'result_recordset: ' + JSON.stringify(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO]));
                var toIDs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                var toCCs   = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID
                toIDs       = Array.from(new Set(toIDs.split(','))).toString();
                logger.log('info', 'new reviewer toID list : ' + JSON.stringify(toIDs));
                toCCs       = Array.from(new Set(toCCs.split(','))).toString();
                bindsEmail.toIDs            = toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.toCCs            = toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                bindsEmail.emailSubject     = templateResult.Subject;
                bindsEmail.emailContent     = templateResult.Body;
                bindsEmail.userId           = userIdFromToken;
                bindsEmail.userName         = userNameFromToken; 
                bindsEmail.createdBy        = userIdFromToken || "";
    
                const emailAddResult = await ScheduleDbObject.addEmailAlerts(bindsEmail);

                var RGUID  = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersGUID;
                var RMGUID = result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID;

                let inAppUserList   = RGUID + ","+ RMGUID;
                inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')
    
                // RCSAMasterData_2["navUrl"]  = RCSAMasterData_2["RISKTRAC_WEB_URL"] + 'orm/schedule-assessments'     //self-assessments-details/'  + RCSAMasterData_2["ScheduleAssessmentID"] 
                let inappDetails = {
                    inAppContent: 'RCSA Assessment details has been updated: ' +   RCSAMasterData_2["ScheduleAssessmentCode_1"] + "link:" + 'schedule-assessments',  //RCSAMasterData_2["navUrl"] , 
                    recepientUserID  : inAppUserList,
                    subModuleID      : 2
                }

                let setRCSAResponse   = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);             
                
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : emailAddResult  : '  + JSON.stringify(emailAddResult || null));
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : addScheduleAssessment : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));
    
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessment : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : updateScheduleAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will update the schedule assessment status to database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async updateScheduleAssessmentStatus(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id || 0;
            binds.isActive = request.body.isActive || 0;
            binds.lastUpdatedBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessmentStatus : Execution started.');

            const result = await ScheduleDbObject.updateScheduleAssessmentStatus(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessmentStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessmentStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessmentStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : updateScheduleAssessmentStatus : Execution end. : Data updated successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : updateScheduleAssessmentStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UPDATED_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch all active Schedule from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllActiveSchedule(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.scheduleYear = request.body.scheduleYear || 0;
            binds.id = request.body.id || 0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveSchedule : Execution started.');

            const result = await ScheduleDbObject.getAllActiveSchedule(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveSchedule : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveSchedule : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveSchedule : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveSchedule : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveSchedule : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getAllActiveSchedule : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch all Schedule from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllSchedule(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.scheduleYear = request.body.scheduleYear || 0;
            binds.id = request.body.id || 0;
            binds.isActive=request.body.isActive||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllSchedule : Execution started.');

            const result = await ScheduleDbObject.getAllSchedule(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllSchedule : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllSchedule : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllSchedule : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllSchedule : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllSchedule : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getAllSchedule : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch Schedule by ID from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduleByID(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.scheduleYear = request.body.scheduleYear || 0;
            binds.id = request.body.id || 0;
            binds.isActive=request.body.isActive||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleByID : Execution started.');

            const result = await ScheduleDbObject.getScheduleByID(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleByID : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleByID : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleByID : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleByID : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleByID : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getScheduleByID : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch schedule assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduleAssessmentYears(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleAssessmentYears : Execution started.');

            const result = await ScheduleDbObject.getScheduleAssessmentYears(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleAssessmentYears : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleAssessmentYears : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleAssessmentYears : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleAssessmentYears : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduleAssessmentYears : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getScheduleAssessmentYears : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch snapshot for inprogress schedule assessment from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getSnapshotForInProgressScheduleAssessment(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessment : Execution started.');

            const result = await ScheduleDbObject.getSnapshotForInProgressScheduleAssessment(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessment : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessment : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessment : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessment : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            var templateResult='';
            if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()!="empty"){
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="inprogress"){
                    const updateMasterData      =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    updateMasterData["ScheduleAssessmentCode_1"]        =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    updateMasterData["ScheduleAssessmentDescription"]   =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    updateMasterData["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    templateResult= await emailTemplateObj.prepareTemplates(updateMasterData,"SCHEDULE_ASSESSMENT_INPROGRESS_EMAIL_TEMPLATE");
                }
                    
                if(result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SpecialNote.toLowerCase()=="completed"){
                    const updateMasterData_1      =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    updateMasterData_1["ScheduleAssessmentCode_1"]        =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    updateMasterData_1["ScheduleAssessmentDescription"]   =   result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                    updateMasterData_1["RISKTRAC_WEB_URL"]                = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
                    templateResult= await emailTemplateObj.prepareTemplates(updateMasterData_1,"SELF_ASSESSMENT_COMPLETED_EMAIL_TEMPLATE");
                }
                    
    
                    const bindsEmail={};

                    var toIDs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPowerUsersEmailID+","+result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].OtherUsersEmailID;
                    var toCCs=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
                    toIDs=Array.from(new Set(toIDs.split(','))).toString();
                    toCCs=Array.from(new Set(toCCs.split(','))).toString();
                    bindsEmail.toIDs= toIDs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    bindsEmail.toCCs= toCCs.replace(/,,/g, ",").replace(/^,|,$/g, "");
                    bindsEmail.emailSubject=templateResult.Subject;
                    bindsEmail.emailContent=templateResult.Body;
                    bindsEmail.userId = userIdFromToken;
                    bindsEmail.userName = userNameFromToken; 
                    bindsEmail.createdBy = userIdFromToken || "";

                    const emailAddResult=await ScheduleDbObject.addEmailAlerts(bindsEmail);
            }

             //Framing JSON format fro result
             let resultResponse={
                AssessmentCard:[]
            }

            resultResponse.AssessmentCard=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            var resultArr=[];
            resultArr.push(resultResponse);

            result.recordset=JSON.parse(JSON.stringify(resultArr));

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessment : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA+"|getSnapshotForInProgressScheduleAssessment", result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getSnapshotForInProgressScheduleAssessment : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch snapshot for inprogress schedule assessment details from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getSnapshotForInProgressScheduleAssessmentDetails(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.groupID = request.body.groupID||0;
            binds.info = request.body.info||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessmentDetails : Execution started.');

            const result = await ScheduleDbObject.getSnapshotForInProgressScheduleAssessmentDetails(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getSnapshotForInProgressScheduleAssessmentDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch in progress schedule assessment for dashboard from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getInProgressScheduleAssessmentForDashboard(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getInProgressScheduleAssessmentForDashboard : Execution started.');

            const result = await ScheduleDbObject.getInProgressScheduleAssessmentForDashboard(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getInProgressScheduleAssessmentForDashboard : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getInProgressScheduleAssessmentForDashboard : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getInProgressScheduleAssessmentForDashboard : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getInProgressScheduleAssessmentForDashboard : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getInProgressScheduleAssessmentForDashboard : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getInProgressScheduleAssessmentForDashboard : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch scheduled action plan snapshot from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduledActionPlanSnapshot(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshot : Execution started.');

            const result = await ScheduleDbObject.getScheduledActionPlanSnapshot(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshot : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshot : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshot : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshot : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshot : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getScheduledActionPlanSnapshot : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch scheduled action plan snapshot details from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getScheduledActionPlanSnapshotDetails(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.groupID = request.body.groupID||0;
            binds.info = request.body.info||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshotDetails : Execution started.');

            const result = await ScheduleDbObject.getScheduledActionPlanSnapshotDetails(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshotDetails : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshotDetails : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshotDetails : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshotDetails : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getScheduledActionPlanSnapshotDetails : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getScheduledActionPlanSnapshotDetails : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch completed schedule assessment for dashboard from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getCompletedScheduleAssessmentForDashboard(request, response){
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

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getCompletedScheduleAssessmentForDashboard : Execution started.');

            const result = await ScheduleDbObject.getCompletedScheduleAssessmentForDashboard(binds);
            
            //Get the record set
            binds.jsonData=JSON.stringify(result.recordset[1]);

            //Get the Computed Average Ratings For Completed Schedule Assessment
            const computedAvgRating=await ScheduleDbObject.getComputedAvgRatingsForCompletedScheduleAssessment(binds);
            
            //Assign the record set in arr1
            const arr1 = result.recordset[1];

            //Assign the computedAvgRating in arr2
            const arr2=computedAvgRating.recordset[0];

            //Merging arr1 and arr2
            const mergeArrays = (arr1 = [], arr2 = []) => {
                let res = [];
                res = arr1.map(obj => {
                   const index = arr2.findIndex(el => el["ID"] == obj["Rowno"]);
                   const { AvgOverallInherentRiskRating } = index !== -1 ? arr2[index] : {};
                   const { AvgOverallControlTotalRating } = index !== -1 ? arr2[index] : {};
                   const { AvgResidualRating } = index !== -1 ? arr2[index] : {};
                   return {
                      ...obj,
                      AvgOverallInherentRiskRating,
                      AvgOverallControlTotalRating,
                      AvgResidualRating
                   };
                });
                return res;
             };

             const mergeResult=mergeArrays(arr1,arr2);
             //Assign the merge result in recordset
             result.recordset[1]=mergeResult;

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getCompletedScheduleAssessmentForDashboard : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getCompletedScheduleAssessmentForDashboard : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getCompletedScheduleAssessmentForDashboard : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getCompletedScheduleAssessmentForDashboard : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getCompletedScheduleAssessmentForDashboard : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getCompletedScheduleAssessmentForDashboard : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch all active action plan status from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllActiveActionPlanStatus(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.isActive = request.body.isActive||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveActionPlanStatus : Execution started.');

            const result = await ScheduleDbObject.getAllActiveActionPlanStatus(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveActionPlanStatus : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveActionPlanStatus : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveActionPlanStatus : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveActionPlanStatus : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveActionPlanStatus : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getAllActiveActionPlanStatus : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch all active control testing result  from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllActiveControlTestingResult(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.isActive = request.body.isActive||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlTestingResult : Execution started.');

            const result = await ScheduleDbObject.getAllActiveControlTestingResult(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlTestingResult : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlTestingResult : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlTestingResult : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlTestingResult : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlTestingResult : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getAllActiveControlTestingResult : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch all active control verification closure  from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAllActiveControlVerificationClosure(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.id = request.body.id||0;
            binds.isActive = request.body.isActive||0;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlVerificationClosure : Execution started.');

            const result = await ScheduleDbObject.getAllActiveControlVerificationClosure(binds);
            
            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlVerificationClosure : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlVerificationClosure : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlVerificationClosure : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlVerificationClosure : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            result.recordset=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            
            logger.log('info', 'User Id : '+ binds.userId +' : ScheduleBl : getAllActiveControlVerificationClosure : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result)); 
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : getAllActiveControlVerificationClosure : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch all active control verification closure  from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRCSAMasterData(request, response) {
        try {
            var refreshedToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            let RCSA_MASTER_DATA_RESPONSE = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;                  
            refreshedToken                = request.body.refreshedToken;
            userIdFromToken               = request.body.userIdFromToken;
            userNameFromToken             = request.body.userNameFromToken;
            // userIdFromToken               =   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
            // userNameFromToken             =   'naganandan.p@secureyes.net'
    
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution started.');
    
            const RCSA_MASTER_DB_RESPONSE = await ScheduleDbObject.getRCSAMasterData(userIdFromToken, userNameFromToken);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE || null));
            
    
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : Error details :' + RCSA_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : Error details : ' + RCSA_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND));
            }     
            
            RCSA_MASTER_DATA_RESPONSE = await formatGetRCSAMasterData(userIdFromToken, RCSA_MASTER_DB_RESPONSE);

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_MASTER_DATA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_MASTER_DATA_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : RCSA_MASTER_DATA_RESPONSE is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
    
                
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : Get RiskAppetite Dashboard List successfully.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : RCSA_MASTER_DATA_RESPONSE ' + JSON.stringify(RCSA_MASTER_DATA_RESPONSE || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, RCSA_MASTER_DATA_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRCSAMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch all active control verification closure  from database server
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addRCSAMasterData(request, response) {
        try {        
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;                 
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    = request.body.data;
            // userIdFromToken               =   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
            // userNameFromToken             =   'naganandan.p@secureyes.net'

            var data = {
                actionResponsiblePerson         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                actionPlanStatus                : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                residualRiskResponsiblePerson   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                controlVerificationClosure      : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                residualRiskResponse            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,  
                controltestingresult            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,  
                reviewers                       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            };

            data.actionResponsiblePerson        = request.body.actionResponsiblePerson;
            data.actionPlanStatus               = request.body.actionPlanStatus;
            data.residualRiskResponsiblePerson  = request.body.residualRiskResponsiblePerson;
            data.controlVerificationClosure     = request.body.controlVerificationClosure; 
            data.residualRiskResponse           = request.body.residualRiskResponse;   
            data.controltestingresult           = request.body.controltestingresult;   
            data.reviewers                      = request.body.reviewers;         
    
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : Execution started.');
    
            const RCSA_MASTER_DB_RESPONSE = await ScheduleDbObject.addRCSAMasterData(userIdFromToken, userNameFromToken,data);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE || null));
  
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : Execution end. : Error details :' + RCSA_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : Execution end. : Error details : ' + RCSA_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND));
            }            
       
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : Execution end. : Get RiskAppetite Dashboard List successfully.');
            RCSA_MASTER_DB_RESPONSE.recordset =[];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE.recordset || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, RCSA_MASTER_DB_RESPONSE.recordset));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addRCSAMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getReminderEmailData(request, response) {
        try {
            var refreshedToken            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            let RCSA_Email_Data           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            let Email_Reminder_Data       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;           
            refreshedToken                = request.body.refreshedToken;
            var data                      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            userIdFromToken               = request.body.userIdFromToken;
            userNameFromToken             = request.body.userNameFromToken;
            data                          = request.body.data;
    
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution started.');
    
            let RCSA_MASTER_DB_RESPONSE = await ScheduleDbObject.getReminderEmailData(userIdFromToken, userNameFromToken,data);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE || null));
            
    
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution end. : Error details :' + RCSA_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution end. : Error details : ' + RCSA_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND));
            }     

            RCSA_Email_Data = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].filter(obj=> obj.ScheduleAssessmentID == data.ScheduleAssessmentID)
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : RCSA_Email_Data ' + JSON.stringify(RCSA_Email_Data || null));

            const masterData = RCSA_Email_Data[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            logger.log('info', ' ScheduleBl : getReminderEmailData : masterData : ' + JSON.stringify(masterData));
            masterData["ScheduleAssessmentCode"]        = RCSA_Email_Data[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["ScheduleAssessmentCode_1"]      = RCSA_Email_Data[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentCode || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            masterData["ScheduleAssessmentDescription"] = RCSA_Email_Data[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ScheduleAssessmentDescription || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            masterData["SchedulePeriod"]                = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].SchedulePeriod || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            masterData["ProposedStartDate"]             = utilityAppObject.formatDate(userIdFromToken,RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ProposedStartDate )
            masterData["ProposedCompletionDate"]        = utilityAppObject.formatDate(userIdFromToken,RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ProposedCompletionDate) 
            masterData["RCSAPendingUnitName"]           = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPendingUnitName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            masterData["RISKTRAC_WEB_URL"]              = APP_CONFIG_FILE_OBJ.RISKTRAC_WEB_URL[APP_CONFIG_FILE_OBJ.APP_SERVER.ENVIRONMENT_NAME];
            logger.log('info', ' ScheduleBl : getReminderEmailData : masterData : ' + JSON.stringify(masterData));

            try {
                if (RCSA_Email_Data.length) {
                    const templateResult = await emailTemplateObj.prepareTemplates(masterData,"SEND_EMAIL_MANUALLY_RCSA_EMAIL_TEMPLATE");
                    logger.log('info', ' ScheduleBl : getReminderEmailData : templateResult : ' + JSON.stringify(templateResult));
                    const bindsEmail  = {};
                    var ccIDReviewers = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].ReviewersEmailID;
                    var ccIDRMUsers   = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersEmailID;
                    ccIDReviewers     = ccIDReviewers ? Array.from(new Set(ccIDReviewers.split(','))).toString() : null;
                    ccIDRMUsers       = ccIDRMUsers ? Array.from(new Set(ccIDRMUsers.split(','))).toString() : null;
                    bindsEmail.toCCs  = (ccIDReviewers + "," + ccIDRMUsers).replace(/,,/g, ",").replace(/^,|,$/g, "");
                    var toIDs         = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPendingUnitUsers;
                    bindsEmail.toIDs  = toIDs !== null ? Array.from(new Set(toIDs.split(','))).toString().replace(/,,/g, ",").replace(/^,|,$/g, "") : null;              
                    bindsEmail.emailSubject = templateResult.Subject;
                    bindsEmail.emailContent = templateResult.Body;
                    bindsEmail.userId       = userIdFromToken;
                    bindsEmail.userName     = userNameFromToken; 
                    bindsEmail.createdBy    = userIdFromToken || "";
    
                    logger.log('info', ' ScheduleBl : getReminderEmailData : bindsEmail : ' + JSON.stringify(bindsEmail));
                    const emailAddResult = await ScheduleDbObject.addEmailAlerts(bindsEmail);
                    var RMGUID      = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RMUsersGUID
                    var RCSAPGUIID  = RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RCSAPendingUnitUserGUID

                    let inAppUserList   = RCSAPGUIID + ","+ RMGUID;
                    inAppUserList       = inAppUserList.split(',').filter(item => item && item != 'undefined' && item != 'null').filter(Boolean).join(',')
        

                    let inappDetails = {
                        inAppContent: ' RCSA ('+ masterData["ScheduleAssessmentCode"] +') Pending for Submission' + "link:" + 'schedule-assessments', 
                        recepientUserID  : inAppUserList,
                        subModuleID      : 2
                    }
                    
                    let setRCSAResponse = await inAppNotificationDbObject.setUserAlerts(userIdFromToken, userNameFromToken, inappDetails);
                    logger.log('info', ' ScheduleBl : addScheduleAssessment : inappDetails    : '  + JSON.stringify(inappDetails || null));
                    logger.log('error', 'ScheduleBl : getDataForScheduleAssessmentScreen : emailAddResult : '  + JSON.stringify(emailAddResult || null));
                    logger.log('error', ' ScheduleBl : getDataForScheduleAssessmentScreen : setRCSAResponse : ' + JSON.stringify(setRCSAResponse || null));



                } 
            }   catch(error){
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution end. : Got unhandled error. : Error Detail : ' + error);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
            }       
            RCSA_MASTER_DB_RESPONSE =[];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution end. : Get RiskAppetite Dashboard List successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_SUCCESSFUL, RCSA_MASTER_DB_RESPONSE));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getReminderEmailData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addBulkInherentRisk(request, response) {   
        try {        
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
            var data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            // var BULK_UPLOAD_PAYLOAD = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
            var BULK_UPLOAD_INFO     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;              
            refreshedToken          = request.body.refreshedToken;
            userIdFromToken         = request.body.userIdFromToken;
            userNameFromToken       = request.body.userNameFromToken;
            data                    =  request.body.InherentRiskData;
            // data                    = request.body.data;          
            // userIdFromToken               =   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
            // userNameFromToken             =   'naganandan.p@secureyes.net'
        
            var binds = {
                bulkInherentRiskData         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
            };
            binds.bulkInherentRiskData        = request.body.InherentRiskData; 
            binds.CreatedBy                   = request.body.userNameFromToken;
            binds.fileName                    = request.body.fileName;
       
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : Execution started.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : binds ' + JSON.stringify(binds || null));

            BULK_UPLOAD_INFO = await ScheduleDbObject.getInfoBulkInherentRisk(userIdFromToken, userNameFromToken); 
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : BULK_UPLOAD_INFO ' + JSON.stringify(BULK_UPLOAD_INFO || null));
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : data ' + JSON.stringify(data || null));


            const BULK_UPLOAD_PAYLOAD = await formatPayloadBulkData (userIdFromToken, data, BULK_UPLOAD_INFO);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : BULK_UPLOAD_PAYLOAD ' + JSON.stringify(BULK_UPLOAD_PAYLOAD || null));
            binds.bulkInherentRiskData  = BULK_UPLOAD_PAYLOAD.validData;
            let validCount      = BULK_UPLOAD_PAYLOAD.validData.length;
            let inValidCount    = BULK_UPLOAD_PAYLOAD.inValidData.length;
            let outputMessage = 'Number of Records successfully added : ' + validCount + ", Number of records failed to add : " + inValidCount

            const RCSA_MASTER_DB_RESPONSE = await ScheduleDbObject.addBulkInherentRisk(userIdFromToken, userNameFromToken,binds);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE || null));
  
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RCSA_MASTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RCSA_MASTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : Execution end. : Error details :' + RCSA_MASTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : Execution end. : Error details : ' + RCSA_MASTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if (RCSA_MASTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RCSA_MASTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && RCSA_MASTER_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, "No. of records failed to add : " + inValidCount));
            }            
       
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : Execution end. : Get RiskAppetite Dashboard List successfully.');
            RCSA_MASTER_DB_RESPONSE.recordset =[];
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : RCSA_MASTER_DB_RESPONSE ' + JSON.stringify(RCSA_MASTER_DB_RESPONSE.recordset || null));
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken,outputMessage , BULK_UPLOAD_PAYLOAD));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * 
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getRiskRegisterData(request, response) {  
        let refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        let data                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;  
        refreshedToken          = request.body.refreshedToken;
        userIdFromToken         = request.body.userIdFromToken;
        userNameFromToken       = request.body.userNameFromToken;
        data                    = request.body.data;          
         
        try {        
            
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRiskRegisterData : Execution started.');

            const RISK_REGISTER_DB_RESPONSE = await ScheduleDbObject.getRiskRegisterData(userIdFromToken, userNameFromToken, data);        
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRiskRegisterData : RISK_REGISTER_DB_RESPONSE ' + JSON.stringify(RISK_REGISTER_DB_RESPONSE || null));
  
            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == RISK_REGISTER_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == RISK_REGISTER_DB_RESPONSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRiskRegisterData : Execution end. :  RiskAppetite list db response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (RISK_REGISTER_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRiskRegisterData : Execution end. : Error details :' + RISK_REGISTER_DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }
            if (RISK_REGISTER_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && RISK_REGISTER_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRiskRegisterData : Execution end. : Error details : ' + RISK_REGISTER_DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }    
            
            const FORMAT_RISK_REGISTER_DATA = await formatRiskRegisterData(userIdFromToken, RISK_REGISTER_DB_RESPONSE);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleBl : addBulkInherentRisk : FORMAT_RISK_REGISTER_DATA ' + JSON.stringify(FORMAT_RISK_REGISTER_DATA || null));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == FORMAT_RISK_REGISTER_DATA || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == FORMAT_RISK_REGISTER_DATA) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRiskRegisterData : Execution end. :  FORMAT_RISK_REGISTER_DATA response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, FORMAT_RISK_REGISTER_DATA));
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleBl : getRiskRegisterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    stop() {
    }

}

async function formatPayloadBulkData(userIdFromToken, payloadData, bulkInfoData) {
    try {
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData: Execution started.');        
        let parsedData   = JSON.parse(payloadData);
        let inherentRisk = [];
        let validData    = [];
        let inValidData  = [];
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData:  :: payloadData: '  + JSON.stringify(payloadData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData:  :: bulkInfoData: ' + JSON.stringify(bulkInfoData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData:  :: parsedData : '  + JSON.stringify(parsedData || null));

        parsedData.forEach(obj=>{         
            inherentRisk.push({
                "unitname"                  : obj['Auditable Unit*'],
                "category"                  : obj['Risk Category*'],
                "risk"                      : obj['Risk*'],                    
                "inherentlikelihoodrating"  : obj['Inherent Likelihood Rating*'],
                "processname"               : obj['Process'],
                "inherentimpactrating"      : obj['Inherent Impact Rating*'],  
                "group"                     : obj['Group *']                  
            });
        })
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData:  :: inherentRisk: ' + JSON.stringify(inherentRisk || null));
        
        const cleanedData = inherentRisk.map((item) => {
            for (const key in item) {
              if (typeof item[key] === "string") {
                item[key] = item[key].trim();
              }
            }
            return item;
        });
          
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData:  :: cleanedData: ' + JSON.stringify(cleanedData || null)); 
        
        cleanedData.forEach(obj => {
            const unit              = bulkInfoData.recordset[0].find(itr => obj.unitname == itr.Name);
            const group             = bulkInfoData.recordset[1].find(itr => obj.group == itr.Name);
            const process           = bulkInfoData.recordset[2].find(itr => obj.processname == itr.Name);
            const category          = bulkInfoData.recordset[3].find(itr => obj.category == itr.Category);
            const likelihoodRating  = bulkInfoData.recordset[4].find(itr => obj.inherentlikelihoodrating == itr.Rating);
            const impactRating      = bulkInfoData.recordset[5].find(itr => obj.inherentimpactrating == itr.Rating);

             //If process is there then need to check whether it is valid or not. If process is null then we can skip the process from validation
            if ( (obj.processname != null && unit && group && category && likelihoodRating && impactRating && process) ||     
                 (obj.processname == null && unit && group && category && likelihoodRating && impactRating) ) {
                validData.push({
                    "unitname"                  : obj.unitname,
                    "processname"               : obj.processname,
                    "category"                  : obj.category,
                    "inherentlikelihoodrating"  : obj.inherentlikelihoodrating,
                    "inherentimpactrating"      : obj.inherentimpactrating,
                    "risk"                      : obj.risk
                });
            }  else {
                let failureReasons = [];        
                if (!unit) failureReasons.push("Unit");
                if (!group) failureReasons.push("Group");
                if (!process) failureReasons.push("Process");
                if (!category) failureReasons.push("Category");
                if (!likelihoodRating) failureReasons.push("Inherent Likelihood Rating");
                if (!impactRating) failureReasons.push("Inherent Impact Rating");
        
                inValidData.push({
                    "unitname"                  : obj.unitname,
                    "processname"               : obj.processname,
                    "category"                  : obj.category,
                    "group"                     : obj.group,
                    "inherentlikelihoodrating"  : obj.inherentlikelihoodrating,
                    "risk"                      : obj.risk,
                    "inherentimpactrating"      : obj.inherentimpactrating,
                    "Failure reason"            : "Fields mismatched - " + failureReasons.join(", ")
                });
            }
        });
        
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData:  :: validData: '   + JSON.stringify(validData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData:  :: inValidData: ' + JSON.stringify(inValidData || null));
        logger.log('info', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData: Execution end.');
        return  {
            "validData"     : validData,
            "inValidData"   : inValidData,
        };
    } catch (error) {
        logger.log('error', 'User Id: ' + userIdFromToken + ' : ScheduleBl: formatPayloadBulkData: Execution end. : Got an unhandled error. : Error Detail: ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


function validateAndReturnData(response, result, userId, refreshedToken, methodName ){

}

async function formatGetRCSAMasterData(userIdFromToken,RCSAData) {
    try {
        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleBl : formatGetRCSAMasterData : Execution started. :: RCSAData : '+ JSON.stringify(RCSAData || null));
        let residualRiskResponse        = []; 
        let riskResponsiblePerson       = [];
        let actionResponsiblePerson     = [];
        let actionPlanStatus            = [];
        let controlVerificationClosure  = [];
        let reviewers                   = [];
        let usersList                   = [];
        let controlTestingResult        = [];
        let PUActionResponsiblePerson   = [];
        let reviewersusersList          = [];
        let reviewersLinkedList         = [];

        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])){
                residualRiskResponse.push({
                    "ResidualRiskResponseID"    : obj.ResidualRiskResponseID,
                    "RiskResponse"              : obj.RiskResponse,
                    "IsActive"                  : obj.IsActive,
                    "IsDeleted"                 : obj.IsDeleted,  
                    "UserGUID"                  : obj.UserGUID,                  
                });
            }
        }       

        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE])){
                riskResponsiblePerson.push({
                    "ResidualRiskResponsiblePersonID"   : obj.ResidualRiskResponsiblePersonID,
                    "ResponsiblePerson"                 : obj.ResponsiblePerson,
                    "IsActive"                          : obj.IsActive,
                    "IsDeleted"                         : obj.IsDeleted,
                    "UserGUID"                          : obj.UserGUID,
                    "FullName"                          : obj.FullName
                });
            }
        }
    
        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO])){
                actionResponsiblePerson.push({
                    "ActionResponsiblePersonID" : obj.ActionResponsiblePersonID,
                    "Description"               : obj.Description,
                    "IsActive"                  : obj.IsActive,
                    "IsDeleted"                 : obj.IsDeleted, 
                    "UserGUID"                  : obj.UserGUID,
                    "FullName"                  : obj.FullName             
                });
            }
        }

        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE])){
                actionPlanStatus.push({
                    "ActionPlanStatus"    : obj.ActionPlanStatus,
                    "ActionPlanStatusID"  : obj.ActionPlanStatusID,
                    "IsActive"            : obj.IsActive,
                    "IsDeleted"           : obj.IsDeleted,            
                });
            }
        }

        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR])){
                controlVerificationClosure.push({
                    "ControlVerificationClosureID"      : obj.ControlVerificationClosureID,
                    "ControlVerificationClosure"        : obj.ControlVerificationClosure,
                    "IsActive"                          : obj.IsActive,
                    "IsDeleted"                         : obj.IsDeleted,                
                });
            }
        }

        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE])){
                reviewers.push({
                    "ReviewerID"        : obj.ReviewerID,
                    "Description"       : obj.Description,
                    "IsActive"          : obj.IsActive,
                    "IsDeleted"         : obj.IsDeleted,  
                    "UserGUID"          : obj.UserGUID,
                    "FullName"          : obj.FullName                  
                });
            }
        }
        
        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX])){
                controlTestingResult.push({
                    "ControlTestingResultID"    : obj.ControlTestingResultID,
                    "ControlTestingResult"      : obj.ControlTestingResult,
                    "IsActive"                  : obj.IsActive,
                    "IsDeleted"                 : obj.IsDeleted, 
                });
            }
        }
        
        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN])){
                PUActionResponsiblePerson.push({
                    "UserGUID"  : obj.UserGUID,
                    "FullName"  : obj.FullName,
                    "UnitName"  : obj.UnitName,
                    "UnitID"    : obj.UnitID,
                    "UserName"  : obj.UserName,
                });
            }
        }
        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.EIGHT])){
                reviewersusersList.push({
                    "UserGUID"  : obj.UserGUID,
                    "FullName"  : obj.FullName,
                    "UnitName"  : obj.UnitName,
                    "UnitID"    : obj.UnitID,
                    "UserName"  : obj.UserName,
                });
            }
        }

        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE])){
                reviewersLinkedList.push({
                    "PrimaryReviewerGUID"    : obj.PrimaryReviewerGUID,
                    "SecondaryReviewerGUID"  : obj.SecondaryReviewerGUID,
                    "IsLinkedToAssessment"   : obj.IsLinkedToAssessment,
                    "ScheduleAssessmentID"   : obj.ScheduleAssessmentID,
                    "ScheduleAssessmentCode" : obj.ScheduleAssessmentCode
                });
            }
        }
        // if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
        //     for(const obj of Object.values(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.NINE])){
        //         reviewersusersList.push({
        //             "UserGUID"  : obj.UserGUID,
        //             "FullName"  : obj.FullName,
        //             "RoleID"    : obj.RoleID,
        //             "FullName"  : obj.FullName,
        //         });
        //     }
        // }

          reviewers.forEach(reviewer => {
            let linkedItems = reviewersLinkedList.filter(linked =>
              linked.PrimaryReviewerGUID === reviewer.UserGUID || linked.SecondaryReviewerGUID === reviewer.UserGUID
            );
            
            reviewer.isLinked = linkedItems.length > 0;
            
            if (reviewer.isLinked) {
              reviewer.ScheduleAssessmentCodes = linkedItems.map(item => item.ScheduleAssessmentCode).join(", ");
            }
          });


        let respData = {
            "residualRiskResponse"          : residualRiskResponse,
            "riskResponsiblePerson"         : riskResponsiblePerson,
            "actionResponsiblePerson"       : actionResponsiblePerson,
            "actionPlanStatus"              : actionPlanStatus,
            "controlVerificationClosure"    : controlVerificationClosure,
            "reviewers"                     : reviewers,            
            // "usersList"                     : usersList,
            "controlTestingResult"          : controlTestingResult,
            "PUActionResponsiblePerson"     : PUActionResponsiblePerson,
            "reviewersusersList"            : reviewersusersList,
            "reviewersLinkedList"           : reviewersLinkedList
        }

        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleBl : formatGetRCSAMasterData : Execution end. :: respData : '+ JSON.stringify(respData || null));
        // Forming final data to send UI.
        return respData;
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : formatGetRCSAMasterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
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


async function formatRiskRegisterData(userIdFromToken, RCSAData) {
    try {
        let riskRegisterData    = []; 
        let statusData          = [];
        let groupData           = [];
        let unitData            = [] ;

        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            riskRegisterData    = RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        }       
        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            statusData   = RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE]
        }
        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            groupData    = RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO]
        }
        if(RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL)        {
            unitData    = RCSAData.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE]
        }

        return {
            riskRegisterData,
            statusData,
            groupData,
            unitData
        };
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ScheduleBl : formatRiskRegisterData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
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
 * This is function will be used to return single instance of class.
 */
 function getScheduleBLClassInstance() {
    if (ScheduleBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        ScheduleBlClassInstance = new ScheduleBl();
    }
    return ScheduleBlClassInstance;
}

exports.getScheduleBLClassInstance = getScheduleBLClassInstance;