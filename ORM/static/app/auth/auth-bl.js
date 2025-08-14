const PATH                  = require('path');
const FILE_SYSTEM           = require('fs');
const MOMENT                = require('moment');
const VALIDATOR_OBJ         = require('validator');
const ACTIVE_DIRECTORY      = require('activedirectory2').promiseWrapper;
const UTILITY_APP           = require('../../utility/utility.js');
const APP_CONFIG            = require('../../config/app-config.js');
const AD_CONFIG             = require('../../config/ad-config.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const APP_VALIATOR          = require('../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');
const AUTH_DB               = require('../../data-access/auth-db.js');
const VERSION               = process.env.npm_package_version;
const PUBLIC_KEY_FILE_PATH  = "/config/certs/public.pem";

var utilityAppObject    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var authBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var appValidatorObject  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var authDBObject        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class AuthBl {
    
    constructor() {
        utilityAppObject    = new UTILITY_APP();
        appValidatorObject  = new APP_VALIATOR();
        authDBObject        = new AUTH_DB();
    }

    start() {

    }

    /**
     * This function will get public key and other parameters values
     * and send back to calling API application module
     * @param {*} request 
     * @param {*} response 
     */
    async getPublicKey(request, response){
        logger.log('info', 'AuthBl : getPublicKey : Execution started.');

        let domainName                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let publicKey                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let absolutePathForPublicKey    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let currentServerTime           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let appSeparator                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        let sessionTimeOut              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            domainName                  = AD_CONFIG.AD_CONFIG.domainName;
            absolutePathForPublicKey    = PATH.join(process.cwd(), PUBLIC_KEY_FILE_PATH);
            publicKey                   = FILE_SYSTEM.readFileSync(absolutePathForPublicKey, "utf8");
            currentServerTime           = MOMENT();
            appSeparator                = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;
            sessionTimeOut              = APP_CONFIG.JWT_TOKEN.TOKEN_EXPIRY_TIME_IN_MINUTES;

            logger.log('info', 'AuthBl : getPublicKey : Get public key successfully');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                message : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY,
                result  : {
                    publicKey       : publicKey,
                    domainName      : domainName,
                    serverTime      : currentServerTime,
                    separator       : appSeparator,
                    version         : VERSION,
                    sessionTimeOut  : sessionTimeOut
                },
                error: {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                }
           });
        } catch (error) {
            logger.log('error', 'AuthBl : getPublicKey : Execution end. : Error details : '+error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY_FAIL));
        }
    }

    /**
     * This method will check user's credentials for login then it update to db in update user login table with user's data 
     * @param {*} request 
     * @param {*} response 
     */
    async updateUserLogin(request, response) {
        logger.log('info', 'AuthBl : updateUserLogin : Execution started.');
        try {
            let userName                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let token                       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let password                    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let activeDirectoryObj          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let authenticationMode          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let serverRequestTime           = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let serverPageTime              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let cipherUserNamePassword      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNamePasswordInClearText = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let separatorString             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let userNamePasswordStringArray = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
            
            // check request body should not be undefined
            if (typeof request.body.reqPayload === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED) {
                logger.log('error', 'AuthBl : updateUserLogin : Request body has not found : Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            
            // Validating userName parameter
            if (request.body.reqPayload.userData === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.reqPayload.userData === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || request.body.reqPayload.userData == "") {
                logger.log('error', 'AuthBl : updateUserLogin : Username parameter is null of empty : Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST));
            }
            
            /**
             * Decrypting user name and password by private key : Start
             */
            cipherUserNamePassword      = request.body.reqPayload.userData;                                                // Getting cipher stirng, Which have userName, password and serverPageTime in encrypted formet.
            userNamePasswordInClearText = utilityAppObject.decryptDataByPrivateKey(cipherUserNamePassword);

            /**
             * Decrypting user name and password by private key : END
             */
            
            /**
             * Separating user name, password and serverPagetime : START
             */
            separatorString             = APP_CONFIG.APP_SECURITY.ENCRYPTION_SEPARATOR;
            userNamePasswordStringArray = userNamePasswordInClearText.split(separatorString);
            userName                    = userNamePasswordStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            password                    = userNamePasswordStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            serverPageTime              = userNamePasswordStringArray[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            /**
             * Separating user name, password and serverPagetime : END
             */

            /**
             * Checking login page expiration : START
             */
            serverRequestTime       = MOMENT();
            let timeDifference      = serverRequestTime.diff(serverPageTime);
            let differenceInSeconds = Math.floor(timeDifference / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS);
            let pageExpireTime      = APP_CONFIG.APP_SECURITY.LOGIN_PAGE_EXPIRE_TIME_SECONDS;

            if (pageExpireTime < differenceInSeconds) {
                logger.log('error', 'AuthBl : updateUserLogin : Login page time expire.: Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.PAGE_EXPIRED,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PAGE_EXPIRED));
            }
            /**
             * Checking login page expiration : END
             */

            /**
             * Validating user name and password : START
             */
            if (appValidatorObject.isStringNull(userName)) {
                logger.log('error', 'AuthBl : updateUserLogin : User id is null : Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NAME_NULL_EMPTY));
            }
            if (appValidatorObject.isStringNull(password)) {
                logger.log('error', 'AuthBl : updateUserLogin : Password is null : Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_NULL_EMPTY));

            }
            
            userName = userName.trim();
            password = password.trim();
            
            if (VALIDATOR_OBJ.isEmpty(userName)) {
                logger.log('error', 'AuthBl : updateUserLogin : User Id is empty. : Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NAME_NULL_EMPTY));
            }
            if (VALIDATOR_OBJ.isEmpty(password)) {
                logger.log('error', 'AuthBl : updateUserLogin : Password is empty. : Execution end.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PASSWORD_NULL_EMPTY));
            }
            /**
             * Validating user name and password : END
             */

            authenticationMode = APP_CONFIG.APP_SERVER.APP_AUTHENTICATION_MODE; // Fetching authentication mode from configuration file (APP_CONFIG)

            /**
             * Below block's code is for AD authentication mode : START
             */
            if (authenticationMode === CONSTANT_FILE_OBJ.APP_CONSTANT.AD_AUTHENTICATION_MODE) {
                
                let userId                      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let tryCount                    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                let lastLogin                   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                let currentTime                 = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                let timeDifference              = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                let differenceInMin             = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;

                // Fetching userId, tryCount and lastLogin time
                const USER_MASTER_RESPONSE = await authDBObject.getUserIdByUserName(userName);

                if(USER_MASTER_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_MASTER_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && USER_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){

                    tryCount    = USER_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].TryCount;
                    lastLogin   = USER_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].LastLogin;
                    userId      = USER_MASTER_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID;
                    
                    currentTime     = new Date();
                    lastLogin       = lastLogin == CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? currentTime : lastLogin;
                    timeDifference  = Math.abs(currentTime - lastLogin);
                    differenceInMin = Math.floor(timeDifference / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_MINUTE_IN_MILLISECONDS);
                    // logger.log('info','currentTime'+currentTime);
                    // logger.log('info','lastLogin'+lastLogin);
                    // logger.log('info','timeDifference'+ timeDifference +'tryCount'+tryCount)
                    // logger.log('info','differenceInMin'+differenceInMin)
                    // logger.log('info','differenceInMin < APP_CONFIG.APP_SECURITY.USER_ACCOUNT_LOCK_TIME_IN_MIN'+ tryCount >= APP_CONFIG.APP_SECURITY.WRONG_LOGIN_ATTEMPT_NUMBER && differenceInMin < APP_CONFIG.APP_SECURITY.USER_ACCOUNT_LOCK_TIME_IN_MIN)

                    // if try count greater then 3 or equal to 3 and last login time is less then 30 min then lock user account
                    if(tryCount >= APP_CONFIG.APP_SECURITY.WRONG_LOGIN_ATTEMPT_NUMBER && differenceInMin < APP_CONFIG.APP_SECURITY.USER_ACCOUNT_LOCK_TIME_IN_MIN){
                        
                        logger.log('info', 'AuthBl : updateUserLogin : Execution end. : User account is locked for time period in minute : ' + APP_CONFIG.APP_SECURITY.USER_ACCOUNT_LOCK_TIME_IN_MIN);
                        
                        let errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_LOCK + APP_CONFIG.APP_SECURITY.USER_ACCOUNT_LOCK_TIME_IN_MIN + " minute.";
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,errorMsg));

                    } else {
                        /**
                         * AD authentication logic : Start
                         */
                        let ldapConfig = {
                            url         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            baseDN      : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            username    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            password    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                        };

                        let cipherAdPassword    = AD_CONFIG.AD_CONFIG.password;
                        let clearTextAdPassword = utilityAppObject.decryptDataByPrivateKey(cipherAdPassword);
                        
                        ldapConfig.url      = AD_CONFIG.AD_CONFIG.url;
                        ldapConfig.baseDN   = AD_CONFIG.AD_CONFIG.baseDN;
                        ldapConfig.username = AD_CONFIG.AD_CONFIG.username;
                        ldapConfig.password = clearTextAdPassword;

                        activeDirectoryObj = new ACTIVE_DIRECTORY(ldapConfig); // creating active directory object with our configuration
                        logger.log('info', 'AuthBl : updateUserLogin : AD connected successful.');

                        try{
                            const authentication = await activeDirectoryObj.authenticate(userName, password);

                            if (authentication) {
                                
                                // Case try_count <= 3 and the credential match then reset the try count to 0 and last login time and send success response
                                const setTryCountZero = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
                                const UPDATE_USER_MASTER = await authDBObject.updateUserMaster(setTryCountZero, currentTime, userId, userName);

                                if (UPDATE_USER_MASTER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {

                                    let data = {userName : userName};
                                    logger.log('info', 'User Name : ' + userName + ' : AuthBl : updateUserLogin : Execution end. : User authentication successful by AD server');
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_AUTHENTICATED,data));
                                }else {
                                    logger.log('error', 'AuthBl : updateUserLogin : Execution end. : Error on updating user master table for try count and last login time. : Error details : ' + UPDATE_USER_MASTER.procedureMessage);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                                }

                            }   
                        } catch (error) {
                            // Case: AD authentication Unsuccessful
                            logger.log('error', 'userName : ' + userName + ' : AuthBl : updateUserLogin : User authentication unsuccessful by AD server');
                        
                            const errorObj = JSON.stringify(error);
                            const ErrorCodeFlag = errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_CODE_WORNG_CRDENTIALS);
                        
                            logger.log('error', 'userName : ' + userName + ' : AuthBl : updateUserLogin : User authentication unsuccessful by AD server : errorObj : ' + errorObj);
                            logger.log('error', 'userName : ' + userName + ' : AuthBl : updateUserLogin : User authentication unsuccessful by AD server : ErrorCodeFlag : ' + ErrorCodeFlag);
                        
                            if (ErrorCodeFlag) {
                                // Case try count <= 3 and credentials are wrong then increase the try count by 1 and update the last login time and send login fail response.
                                
                                let login_attempt_msg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_CREDENTIALS;

                                let attempt_left = tryCount == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ? (APP_CONFIG.APP_SECURITY.WRONG_LOGIN_ATTEMPT_NUMBER - CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) : (APP_CONFIG.APP_SECURITY.WRONG_LOGIN_ATTEMPT_NUMBER - tryCount);

                                tryCount = tryCount + CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;

                                if (attempt_left > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                                    login_attempt_msg = login_attempt_msg + "\nAttempt left: " + attempt_left;
                                } else {
                                    login_attempt_msg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.ACCOUNT_LOCK + APP_CONFIG.APP_SECURITY.USER_ACCOUNT_LOCK_TIME_IN_MIN + " minute.";
                                }
                            
                                const UPDATE_USER_MASTER = await authDBObject.updateUserMaster(tryCount, currentTime, userId, userName);
                            
                                if (UPDATE_USER_MASTER.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && UPDATE_USER_MASTER.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE) {
                                    logger.log('error', 'AuthBl: updateUserLogin : Execution end. : Unable to authenticate from AD server due to wrong credentials : Error details AD server : ' + JSON.stringify(error));
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,login_attempt_msg));

                                } else {
                                    logger.log('error', 'AuthBl : updateUserLogin : Execution end. : Error on updating user master table for try count and last login time. : Error details : ' + UPDATE_USER_MASTER.procedureMessage);
                                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                                }
                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_USER_NOT_EXIST)) {
                                // CASE: - user not found
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : User account does not exist in AD server.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_NOT_EXIST));
                            
                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_USER_NOT_PERMITTED_TO_LOGIN)) {
                                // CASE: - not permitted to logon at this time
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : User not permitted to logon at this time.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_NOT_PERMITTED_TO_LOGIN));

                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_USER_NOT_PERMITTED_TO_LOGIN_WORKSTATION)) {
                                // CASE: - not permitted to login from this workstation
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : User not permitted to logon from this workstation.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_NOT_PERMITTED_TO_LOGIN_WORKSTATION));
                    
                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_USER_PASSWORD_EXPIRED)) {
                                // CASE: - password expired
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : User account password has expired in AD server.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_PASSWORD_EXPIRED));

                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_USER_ACCOUNT_DISABLED)) {
                                // CASE: - account disabled
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : User account currently disabled from AD server.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_ACCOUNT_DISABLED));

                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_USER_ACCOUNT_EXPIRED)) {
                                // CASE: - account expired
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : The user account has expired from AD server.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_ACCOUNT_EXPIRED));

                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_CODE_FORCE_PASSWORD_CHANGE)) {
                                // CASE: - user must reset password
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : The user password must be changed from AD server before logging on the first time.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_PASSWORD_RESET));
                            
                            } else if (errorObj.includes(CONSTANT_FILE_OBJ.APP_CONSTANT.AD_ERROR_USER_ACCOUNT_LOCKED)) {
                                // CASE: - account locked out
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : Account is currently locked out from AD server and may not be logged on to.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_USER_ACCOUNT_LOCKED));
                            
                            } else {
                                logger.log('error', 'AuthBl: updateUserLogin : Execution end. : Unable to authenticate from AD server due to AD server error.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.AD_SERVER_UNREACHABLE));

                            }
                            // activeDirectoryObj.authenticate(userName, password, function(error, auth) {
                            //     if (error) {
                            //         // Some error occuered while doing AD authentication.
                            //         logger.log('error', 'AuthBl : updateUserLogin  : Execution end. : Unable to authenticate from AD server due error : Error details from AD server : ' + JSON.stringify(error));
                            //         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_CREDENTIALS));
                            //     }
                            
                            //     if (auth) {
                            //         let data = {userName : userName};
                            //         // User authenticated from AD successfully
                            //         logger.log('info', 'User Name : ' + userName + ' : AuthBl : updateUserLogin : Execution end. : User authentication successful by AD server');
                            //         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_AUTHENTICATED,data));

                            //     } else {
                            //         // Unable to authenticated from AD due to wrong credentials.
                            //         logger.log('error', 'AuthBl : updateUserLogin  : Execution end. : Unable to authenticate from AD server due wrong credentials.');
                            //         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_CREDENTIALS));
                            //     }
                            // });
                            /**
                             * AD authentication logic : END
                             */
                        }
                    }
                }else{
                    logger.log('error', 'AuthBl : updateUserLogin : Execution end. : Error on fetching user ID from database, User is not existing in DB.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NOT_EXISTING_IN_DB));
            
                }
            }
            /**
             * Below block's code is for AD authentication mode : END
             */
            
            /**
             * Below block's code is for ADFS authentication mode : START
             */
            if (authenticationMode === CONSTANT_FILE_OBJ.APP_CONSTANT.ADFS_AUTHENTICATION_MODE) {
                logger.log('info', 'AuthBl : updateUserLogin : ADFS authentication mode is not suppoerted by application right now.');

                let errorMessage = "ADFS authentication mode is not suppoerted by application right now, Please change suppoerted authentication mode in APP_CONFIG.js and restart server.";
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,errorMessage));
            }
            /**
             * Below block's code is for ADFS authentication mode : END
             */
            
            /**
             * Below block's code is for Application authentication mode : START
             */
            if (authenticationMode === CONSTANT_FILE_OBJ.APP_CONSTANT.APP_AUTHENTICATION_MODE) {
                let appUserName     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                let appUserPassword = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
                appUserName         = APP_CONFIG.APP_SERVER.APP_ADMIN_USER_NAME;
                appUserPassword     = APP_CONFIG.APP_SERVER.APP_ADMIN_PASSWORD;
                
                if (userName != appUserName || password != appUserPassword) {
                    logger.log('error', 'AuthBl : updateUserLogin : Wrong credentials. : Execution end.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.WRONG_CREDENTIALS));
                } else {
                    logger.log('info', 'AuthBl : updateUserLogin : Execution end : Login successful.');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(token,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_SUCCESS,recordsetOfLoginProcedure));
                }
            }
            /**
             * Below block's code is for Application authentication mode : END
             */
        } catch (error) {
            logger.log('error', 'AuthBl : updateUserLogin : Got unhandled error : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
        }
    }

    stop() {

    }
}


function unsuccessfulResponse(errorCode,message) {
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        error   : {
            errorCode       : errorCode,
            errorMessage    : message
        }
    }
}

function successfulResponse(token, successMessage, result){
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
        message : successMessage,
        result  : result,
        token   : token,
        error   : {
            errorCode    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        }
    }
}



/**
 * This is function will be used to return single instance of class.
 */
function getAuthBlClassInstance( ) {
    if( authBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ) {
        authBlClassInstance = new AuthBl();
    }
    return authBlClassInstance;
}

exports.getAuthBlClassInstance = getAuthBlClassInstance;