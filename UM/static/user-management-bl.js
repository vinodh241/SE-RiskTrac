const AXIOS                 = require('axios');
const VALIDATOR_OBJECT      = require('validator');
const APP_CONFIG            = require('../../config/app-config.js');
const APP_VALIATOR          = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const USER_MANAGEMENT_DB    = require('../../data-access/user-management-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var userManagementDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var userManagementBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;


class UserManagementBl {
    constructor() {
        appValidatorObject      = new APP_VALIATOR();
        userManagementDbObject  = new USER_MANAGEMENT_DB();
    }

    start() {

    }

    /**
     * Get existing users details from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getUsers(request, response) { 
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getUserDbResponse   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getUsersData        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            console.log("Account GUID for Get Users : ", request.body.accountGUIDFromToken);
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken    = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution started.');

            getUserDbResponse = await userManagementDbObject.getUsers(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : UserManagementBl : GET_USERS : ' + JSON.stringify(getUserDbResponse));

            let rolesDetails       = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            let usersDetails       = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            let userModulesDetails = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            let unitsDetails       = getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];

            getUsersData = await getResult(rolesDetails, usersDetails, userModulesDetails, unitsDetails);
    
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution end. : getUserDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            // No Record found in database.
            if(getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, getUserDbResponse.recordset));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution end. : Get Users List data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, getUsersData));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUsers : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }
    
    /**
     * Delete user data from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async deleteUser(request, response) {
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userMaster          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            userMaster          = request.body.userMaster;
            accountGUIDFromToken = request.body.accountGUIDFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution started.');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == userMaster || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == userMaster){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            const getUserDbResponse = await userManagementDbObject.deleteUser(userIdFromToken,userNameFromToken,userMaster, accountGUIDFromToken);

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution end. : getUserDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution end. : User Deleted successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA, getUserDbResponse.recordset));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : deleteUser : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.DELETE_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * Get Assigned users Info from database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getAssignedUserInfo(request, response) {
        try {

            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
           
            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution started.');

            const getUserDbResponse = await userManagementDbObject.getAssignedUserInfo(userIdFromToken, userNameFromToken, accountGUIDFromToken);

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution end. : getUserDbResponse is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.TWO) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
            // No Record found in database.
            if(getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && getUserDbResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, getUserDbResponse.recordset));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution end. : Get Users List data successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, getUserDbResponse.recordset));

        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getAssignedUserInfo : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }

    }

    /**
     * Add Assign users Info to database
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async addAssignUser(request, response) {
        try {
            var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userMaster              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let adUserName              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUID             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userGUID                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let isUserManager           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let getUserDbResponse       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNames               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userEmailID             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userMobileNo            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let usersList               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let assignedModules         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let assignedGroupsUnits     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let emailID                 = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let mobileNum               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountGUIDFromToken    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;          
            userMaster          = request.body.userMaster;
            accountGUIDFromToken = request.body.accountGUIDFromToken;
                   
            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution started.');
            logger.log('info', ' : UserManagementBl : addAssignUser : userMaster : ' + JSON.stringify(userMaster));

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == userMaster || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == userMaster){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Invalid Request, missing mandatory parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            adUserName      = userMaster.adUserName;
            accountGUID     = accountGUIDFromToken;
            userGUID        = userMaster.userGUID;
            isUserManager   = userMaster.isUserManager;
            emailID         = userMaster.emailID;
            mobileNum       = userMaster.mobileNumber;
            /**
             * Validating input parameters : START
             */
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == adUserName || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == adUserName || appValidatorObject.isStringEmpty(adUserName.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : adUserName is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_NAME_NULL_EMPTY));
            }
            if(!VALIDATOR_OBJECT.isEmail(adUserName)){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : adUserName is not valid.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_NAME_INVALID));                
            }
            if(!VALIDATOR_OBJECT.isEmail(emailID)){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : emailid is not valid.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_INVALID));                
            }
            if((!VALIDATOR_OBJECT.isMobilePhone(mobileNum))||(mobileNum.length != CONSTANT_FILE_OBJ.APP_CONSTANT.TEN)){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Mobile number is not valid.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MOBILE_NUMBER_INVALID));                
            }
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == accountGUID || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == accountGUID || appValidatorObject.isStringEmpty(accountGUID.trim())){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : accountGUID is undefined or null or empty.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_GUID_NULL_EMPTY));                
            }
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == isUserManager || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == isUserManager){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : isUserManager is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.IS_USER_MANAGER_NULL_EMPTY));                
            }          
            /**
             * Validating input parameters : END
             */
            
             /**
             * Fetching user list from data base to check user existence : END
             */
            const GET_USER_DATA_RESPONSE = await userManagementDbObject.getUsers(userIdFromToken, userNameFromToken, accountGUIDFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : GET_USERS_BEFORE_ADD_NEW_USER : ' + JSON.stringify(GET_USER_DATA_RESPONSE));

            if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_USER_DATA_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_USER_DATA_RESPONSE ||
                GET_USER_DATA_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE || GET_USER_DATA_RESPONSE.procedureSuccess != CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE
            ){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : GET_USER_DATA_RESPONSE of getuserlist is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
            }

            // Checking case : - Add assign user, - Edit assign user
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == userGUID){ // add assign user - case
                    usersList       = GET_USER_DATA_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                    userNames       = usersList.map(ele => ele.UserName);
                    userEmailID     = usersList.map(ele => ele.EmailID);
                    userMobileNo    = usersList.map(ele => ele.MobileNumber);

                    // Checking user name existence with DB.
                    if(userNames.includes(adUserName)){ // User name is already existing
                        logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : User already exists.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_ALREADY_EXISTS));
                    } else {
                         // Checking email id existence with DB.
                        if(userEmailID.includes(emailID)){ // emailid is already existing
                            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : emailid already exists.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_ALREADY_EXISTS));
                        } 
                         // Checking mobile number existence with DB.
                        if(userMobileNo.includes(mobileNum)){ // mobile number is already existing
                            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : mobile number already exists.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MOBILE_NUMBER_ALREADY_EXISTS));
                        }
                        // Checking : Is user is user manager.
                        if(isUserManager == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){   // Case : User is User Manager
                            getUserDbResponse = await userManagementDbObject.assignUserManager(userIdFromToken, userNameFromToken, userMaster);            
                        }
                        else {  // Case : User is not User Manager
                            assignedModules         = [];
                            assignedGroupsUnits     = [];
                            assignedModules     = userMaster.assignedModules;
                            assignedGroupsUnits = userMaster.assignedGroupsUnits;

                            /**
                             * Validating input parameters : START
                             */
                            if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedModules || 
                                CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedModules || 
                                assignedModules.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO  ||
                                appValidatorObject.isStringEmpty(assignedModules.trim())
                            ){
                                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Modules details is undefined or null or empty.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MODULES_MISSING));
                            }

                            if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedGroupsUnits || 
                                CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedGroupsUnits || 
                                assignedGroupsUnits.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ||
                                appValidatorObject.isStringEmpty(assignedGroupsUnits.trim()) 
                            ){
                                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Group unit details is undefined or null or empty.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GROUPS_UNITS_MISSING));
                            }
                            /**
                             * Validating input parameters : END
                             */
                            logger.log('error', 'User Id : ' + userIdFromToken + ' : UserManagementBl : addAssignUser : ADD_USER_PAYLOAD : ' + JSON.stringify(userMaster));
                            getUserDbResponse = await userManagementDbObject.addAssignUser(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken);  
                        }

                        if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse){
                            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : getUserDbResponse is undefined or null.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                        }
                        if (getUserDbResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                        }
                        if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                        }
                        logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Data added successfully.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, getUserDbResponse.recordset));

                    }
                
                /**
                 * Fetching user list from data base to check user existence : END
                 */
            } else {    // edit assign user - case

                usersList       = GET_USER_DATA_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                userEmailID     = usersList.filter(ele => ele.UserGUID != userGUID).map(ele => ele.EmailID);
                userMobileNo    = usersList.filter(ele => ele.UserGUID != userGUID).map(ele => ele.MobileNumber);

                if(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == userGUID || appValidatorObject.isStringEmpty(userGUID.trim())){
                    logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : userGUID is undefined or null or empty.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_GUID_NULL_EMPTY));                
                } else {
                    if(userEmailID.includes(emailID)){ // emailid is already existing
                        logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : emailid already exists.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_ALREADY_EXISTS));
                    } 
                     // Checking mobile number existence with DB.
                    if(userMobileNo.includes(mobileNum)){ // mobile number is already existing
                        logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : mobile number already exists.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MOBILE_NUMBER_ALREADY_EXISTS));
                    }

                    // Checking : Is user is user manager.
                    if(isUserManager == CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE){   // Case : User is User Manager
                        getUserDbResponse = await userManagementDbObject.assignUserManager(userIdFromToken, userNameFromToken, userMaster);            
                    }
                    else {  // Case : User is not User Manager
                        assignedModules         = [];
                        assignedGroupsUnits     = [];
                        assignedModules     = userMaster.assignedModules;
                        assignedGroupsUnits = userMaster.assignedGroupsUnits;

                        /**
                         * Validating input parameters : START
                         */                        
                        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedModules || 
                            CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedModules || 
                            assignedModules.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ||
                            appValidatorObject.isStringEmpty(assignedModules.trim()) 
                        ){
                            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Modules details is undefined or null or empty.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.MODULES_MISSING));
                        }

                        if( CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == assignedGroupsUnits || 
                            CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == assignedGroupsUnits || 
                            assignedGroupsUnits.length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ||
                            appValidatorObject.isStringEmpty(assignedGroupsUnits.trim()) 
                        ){
                            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Group unit details is undefined or null or empty.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GROUPS_UNITS_MISSING));
                        }
                        /**
                         * Validating input parameters : END
                         */

                        getUserDbResponse = await userManagementDbObject.addAssignUser(userIdFromToken, userNameFromToken, userMaster, accountGUIDFromToken); 
                        assignedModules         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                        assignedGroupsUnits     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
                    }

                    if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == getUserDbResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == getUserDbResponse){
                        logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : getUserDbResponse is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }
                    if (getUserDbResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Error details :' + getUserDbResponse.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }
                    if (getUserDbResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && getUserDbResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Error details : ' + getUserDbResponse.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
                    }
                    logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Data added successfully.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADDED_DATA, getUserDbResponse.recordset));
                }
            }
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : addAssignUser : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ADD_DATA_UNSUCCESSFUL));
        }
    }

    /**
     * This function will fetch deatils from AD server by UserID or User's email.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
    async getUserDetailsFromAD(request, response){
        try {
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userMaster          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userId              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let emailId             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var requestBody         = request.body;

            userMaster          = request.body.userMaster;
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;

            logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution started.');

            if(userMaster === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || userMaster === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution end. : Invalid request, missing mandatory parameters.');

                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }

            /**
             * Validating input parameters : START
             */
            userId  = userMaster.userId;
            emailId = userMaster.emailId;
            
            /** User id & Email id both should not be undefined or null or empty.  */
            if(
                (appValidatorObject.isStringUndefined(userId) || appValidatorObject.isStringNull(userId) || appValidatorObject.isStringEmpty(userId.trim()))
                && (appValidatorObject.isStringUndefined(emailId) || appValidatorObject.isStringNull(emailId) || appValidatorObject.isStringEmpty(emailId.trim()))
            ){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution end. : User Id and Email Id both are undefined or null or empty, Atleast provide value one of parameter.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_ID_AND_EMAIL_ID_NULL_EMPTY));
            }

            /** Validation eamil id value */
            if(
                (!appValidatorObject.isStringUndefined(emailId) && !appValidatorObject.isStringNull(emailId) && !appValidatorObject.isStringEmpty(emailId.trim()))
                && (!VALIDATOR_OBJECT.isEmail(emailId))
            ){
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution end. : Email ID value is not a valid email id.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.EMAIL_ID_INVALID));
            }
            /**
             * Validating input parameters : END
             */

            // Sending API request to User Management module of Auth application to get details of user from AD server by UserId or User's EmailId.
            const API_RESPONSE_OBJ = await sendRequestToAuthAPIApplication(requestBody, '/auth-management/user-management/get-user-details-from-ad');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ONE === API_RESPONSE_OBJ.success){
                logger.log('info', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution end. : User details fetched successfully from AD server.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, API_RESPONSE_OBJ.result));
                
            } else if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO === API_RESPONSE_OBJ.success){
                let errorMessageFromAuthApplication = API_RESPONSE_OBJ.error.errorMessage;
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution end. : Error from Auth application module, for more details check Auth application module API log. : Error details : ' + errorMessageFromAuthApplication);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, errorMessageFromAuthApplication));
            } else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution end. : Error details : Error from Auth application module, for more details check Auth application module API log.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : UserManagementBl : getUserDetailsFromAD : Execution end. : Got unhandled error. : Error Detail : '+ error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    
    
    stop() {
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

function successfulResponse(refreshedToken, successMessage, result){
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
 * Sending resultsets of roles and users along with modules and units based on UserGUID
 * @param {*} rolesDetails 
 * @param {*} usersDetails 
 * @param {*} userModulesDetails 
 * @param {*} unitsDetails 
 * @returns 
 */
async function getResult(rolesDetails, usersDetails, userModulesDetails, unitsDetails){
    let userModule = [];
    let unitsData  = [];
    let usersData  = [];

    //filter users where user role is not superadmin 
    usersData = usersDetails.filter(ele => (ele.DefaultRoleID != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE));

    usersData.forEach(element => {

        userModule =  userModulesDetails.filter(ele => ele.UserGUID == element.UserGUID);
        unitsData  =  unitsDetails.filter(ele => ele.UserGUID == element.UserGUID);

         element['Modules'] =  userModule && userModule.length ?  userModule  : [];
         element['Units']   =  unitsData && unitsData.length   ?  unitsData   : [];

   });
   userModule = [];
   unitsData  = [];

    return {
        Roles   : rolesDetails,
        Users   : usersData
    }
}

/**
 * Send API request to Auth application user management module
 * @param {*} requestBody 
 * @param {*} endPoint 
 * @returns 
 */
async function sendRequestToAuthAPIApplication(requestBody, endPoint) {
    try {
        logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution started.');
        logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint);
        // logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL with requestBody value = ' + JSON.stringify(requestBody));
        
        const AUTH_SERVICE_BASE_URL = APP_CONFIG.AUTH_SERVICE_URL;
        const HEADERS               = { 'Content-Type': 'application/json'};
        
        return AXIOS.post(AUTH_SERVICE_BASE_URL + endPoint, {reqPayload: requestBody}, {headers: HEADERS})
        .then((response) => {
            logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution end. : Response Received for API URL : ' + endPoint);
            // logger.log('info', 'UserManagementBl : sendRequestToAuthAPIApplication : Response Received for API URL with response value = ' + JSON.stringify(response.data));
            return response.data;
        })
        .catch((error) => {
            logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
            logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution end. : Error occured while processing request for API URL : ' + endPoint + ' : Error details : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        })
    } catch (error) {
        logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
        logger.log('error', 'UserManagementBl : sendRequestToAuthAPIApplication : Execution end. : Got unhandled error. : Error details : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will be used to return single instance of class.
 */
function getUserManagementBLClassInstance() {
    if (userManagementBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        userManagementBlClassInstance = new UserManagementBl();
    }
    return userManagementBlClassInstance;
}

exports.getUserManagementBLClassInstance = getUserManagementBLClassInstance;