const JWT                   = require('jsonwebtoken');
const AXIOS                 = require('axios');
const UTILITY_APP           = require('../../utility/utility.js');
const AUTH_DB               = require('../../data-access/auth-db.js');
const APP_CONFIG            = require('../../config/app-config.js');
const CONSTANT_FILE_OBJ     = require('../../utility/constants/constant.js');
const MESSAGE_FILE_OBJ      = require('../../utility/message/message-constant.js');


var authDbObject        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var utilityAppObject    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var authBlClassInstance = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class AuthBl {
    
    constructor() {
        authDbObject        = new AUTH_DB();
        utilityAppObject    = new UTILITY_APP();
    }

    start() {

    }

    /**
     * This function will send request to Auth application module to get public key, 
     * if success from Auth module then the success respond with public key to UI
     * else send failure from Auth module response to UI
     * @param {*} request 
     * @param {*} response 
     */
    async getPublicKey(request, response){
        logger.log('info', 'AuthBl : getPublicKey : Execution started.');

        try {
            var requestBody = request.body;

            const API_RESPONSE_OBJ = await sendRequestToAuthAPIApplication(requestBody, '/auth-management/auth/get-Key');

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ  && CONSTANT_FILE_OBJ.APP_CONSTANT.ONE === API_RESPONSE_OBJ.success){
                logger.log('info', 'AuthBl : getPublicKey : Get public key successfully');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                    message : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY,
                    result  : API_RESPONSE_OBJ.result,
                    error: {
                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                    }
               });

            } else {
                logger.log('error', 'AuthBl : getPublicKey : Execution end. : Error details : Error from Auth application module, for more details check Auth application module API log.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    error   : {
                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY_FAIL
                    }
                });
            }
        } catch (error) {
            logger.log('error', 'AuthBl : getPublicKey : Execution end. : Got unhandled error. : Error details : '+error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_KEY_FAIL
                }
           });
        }
    }

    /**
     * This function will send request to Auth application module to authenticate user credential
     * if user authenticated then User management application module will check authorization of user,
     * create to token and update into data base. If all are success then then send response as login success
     * else send response as login unsuccessful.
     * @param {*} request 
     * @param {*} response 
     */
    async updateUserLogin(request, response) {
        logger.log('info', 'AuthBl : updateUserLogin : Execution started.');

        try {
            var userId                  = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userName                = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var secretKey               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var token                   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var requestBody             = request.body;
            let updateUserDBResponse    = [];
            let accountGUID             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            let accountName             = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

            logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : UPDATE_USER_LOGIN_REQUEST_BODY: ' + JSON.stringify(requestBody))

            const API_RESPONSE_OBJ = await sendRequestToAuthAPIApplication(requestBody, '/auth-management/auth/login');
            logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : API_RESPONSE_OBJ FOR AUTH API: ' + JSON.stringify(API_RESPONSE_OBJ))
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ONE === API_RESPONSE_OBJ.success){
                userName = API_RESPONSE_OBJ.result.userName;
                accountName = API_RESPONSE_OBJ.result.accountName;
                accountGUID = API_RESPONSE_OBJ.result.accountGUID;

                /**
                 * Fetching User Id from data base by user name : START
                 */
                const USER_ID_BY_USER_NAME_DB_RESPONSE = await authDbObject.getUserIdByUserName(userName, accountGUID);
                logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : USER_ID_BY_USER_NAME_DB_RESPONSE : ' + JSON.stringify(USER_ID_BY_USER_NAME_DB_RESPONSE));
                if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == USER_ID_BY_USER_NAME_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == USER_ID_BY_USER_NAME_DB_RESPONSE)
                {
                    logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : USER_ID_BY_USER_NAME_DB_RESPONSE is null or undefined');
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        error   : {
                            errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                        }
                    });
                }
                if(USER_ID_BY_USER_NAME_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_ID_BY_USER_NAME_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && USER_ID_BY_USER_NAME_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].length != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
                    userId = USER_ID_BY_USER_NAME_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].UserGUID;
                    // accountGUID = USER_ID_BY_USER_NAME_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE][CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].AccountGUID
                    // logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : AccountGUID and UserID : ' + userId + " " + Account);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Get ID of User successfully');
                    /**
                     * Create JWT token : Start
                     */
                    secretKey = utilityAppObject.getAppSecretKey();
                    try {
                        token = JWT.sign(
                            {
                                userId              : userId,
                                userName            : userName,
                                iat                 : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS),
                                exp                 : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS) + (CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS * APP_CONFIG.JWT_TOKEN.TOKEN_EXPIRY_TIME_IN_MINUTES),
                                accountName         : accountName
                            },
                            secretKey,
                            {
                                algorithm : 'HS256'
                            }
                        );
                        logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Token get generated successfully : Token value is : ' + token);
                    } catch (error) {
                        logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Error in creating JWT token : Execution end. : Error details : ' + error);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    /**
                     * Create JWT token : END
                     */

                    /**
                     * updating user login deatils and token againts userGUID into data base : START
                     */

                    let tokenBody = {
                        userId      : userId,
                        userName    : userName,
                        iat         : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS),
                        exp         : Math.floor(Date.now() / CONSTANT_FILE_OBJ.APP_CONSTANT.ONE_SECONDE_IN_MILLISECONDS) + (CONSTANT_FILE_OBJ.APP_CONSTANT.SIXTY_SECONDS * APP_CONFIG.JWT_TOKEN.TOKEN_EXPIRY_TIME_IN_MINUTES),
                        accountName : accountName
                    }

                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : TOKEN_BODY : ' + JSON.stringify(tokenBody));
                    
                    //Adding User Login info to the user login table
                    // updateUserDBResponse = await authDbObject.updateUserLogin(userId, userName, token, accountGUID);
                    // logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : UPDATE_USER before getInfoForUserLogin : ' + JSON.stringify(updateUserDBResponse));

                    // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == updateUserDBResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == updateUserDBResponse) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : updateUserDBResponse is undefined or null.');
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details :' + updateUserDBResponse.errorMsg);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && updateUserDBResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details : ' + updateUserDBResponse.procedureMessage);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }

                    // Fetching User login Info from DB
                    const GET_INFO_USER_LOGIN = await authDbObject.getInfoForUserLogin(userId, userName, accountGUID);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : GET_INFO_USER_LOGIN : ' + JSON.stringify(GET_INFO_USER_LOGIN));

                    if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_USER_LOGIN || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_USER_LOGIN){
                        logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogout : Execution end. : GET_INFO_USER_LOGIN is undefined or null.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }
                    if (GET_INFO_USER_LOGIN.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogout : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }
                    if (GET_INFO_USER_LOGIN.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_USER_LOGIN.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogout : Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    }

                    // /**
                    //  * First time adding a new user to user login table - START
                    //  */
                    // updateUserDBResponse = await authDbObject.updateUserLogin(userId, userName, token);
                    // logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : updateUserDBResponse : ' + JSON.stringify(updateUserDBResponse));

                    // if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == updateUserDBResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == updateUserDBResponse) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : updateUserDBResponse is undefined or null.');
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details :' + updateUserDBResponse.errorMsg);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // if (updateUserDBResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && updateUserDBResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                    //     logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error details : ' + updateUserDBResponse.procedureMessage);
                    //     return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                    // }
                    // /**
                    //  * First time adding a user in user login table - END
                    //  */
                    
                    let usersLoginData  = GET_INFO_USER_LOGIN.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    let roleId          = usersLoginData.filter(ele => ele.UserGUID == userId).map(ele => ele.RoleID);
                    if(userId != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || roleId != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || roleId != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){

                        updateUserDBResponse = await authDbObject.updateUserLogin(userId, userName,token, accountGUID);
                        logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin :  UPDATE_USER after getInfoForUserLogin : ' + JSON.stringify(updateUserDBResponse));

                        if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == updateUserDBResponse || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == updateUserDBResponse){
                            logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogin : Execution end. : updateUserDBResponse is undefined or null.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                        }
                        if (updateUserDBResponse.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                            logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogin : Execution end. : Error details :' + updateUserDBResponse.errorMsg);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                        }
                        if (updateUserDBResponse.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && updateUserDBResponse.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                            logger.log('error', 'User Id : '+ userId +' : AuthBl : updateUserLogin : Execution end. : Error details : ' + updateUserDBResponse.procedureMessage);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS));
                        }        
                    }
                    /**
                    * updating user login deatils and token againts user into data base : END
                    */

                    /**
                     * Fecthing user subscription details from data base : START
                     */
                    const USER_SUBSCRIPTION_DB_RESPONSE = await authDbObject.getUserSubscription(userId, userName, accountGUID);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : USER_SUBSCRIPTION_DB_RESPONSE : ' + JSON.stringify(USER_SUBSCRIPTION_DB_RESPONSE));

                    if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == USER_SUBSCRIPTION_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == USER_SUBSCRIPTION_DB_RESPONSE){
                        logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : USER_SUBSCRIPTION_DB_RESPONSE is null or undefined');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    if(USER_SUBSCRIPTION_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                        logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + USER_SUBSCRIPTION_DB_RESPONSE.errorMsg);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    if(USER_SUBSCRIPTION_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && USER_SUBSCRIPTION_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                        logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + USER_SUBSCRIPTION_DB_RESPONSE.procedureMessage);
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                    /**
                    * Fetching user subscription details from data base : END
                    */

                    /**
                     * Fetching user's authorized function list from data base : START
                     */
                     const AUTHORIZED_FUNCTIONS_DB_RESPONSE = await authDbObject.getAllAuthorizedFunctions(userId, userName, accountGUID);
                    logger.log('info', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : AUTHORIZED_FUNCTIONS_DB_RESPONSE : ' + JSON.stringify(AUTHORIZED_FUNCTIONS_DB_RESPONSE));

                     if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == AUTHORIZED_FUNCTIONS_DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == AUTHORIZED_FUNCTIONS_DB_RESPONSE){
                         logger.log('error', 'User Id : ' + userId + ' : AuthBl : updateUserLogin : AUTHORIZED_FUNCTIONS_DB_RESPONSE is null or undefined');
                         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                             success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                             message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             error   : {
                                 errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                 errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                             }
                         });
                     }
                     if(AUTHORIZED_FUNCTIONS_DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                         logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + AUTHORIZED_FUNCTIONS_DB_RESPONSE.errorMsg);
                         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                             success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                             message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             error   : {
                                 errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                 errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                             }
                         });
                     }
                     if(AUTHORIZED_FUNCTIONS_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && AUTHORIZED_FUNCTIONS_DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                         logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end : ' + AUTHORIZED_FUNCTIONS_DB_RESPONSE.procedureMessage);
                         return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                             success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                             message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                             error   : {
                                 errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                 errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                             }
                         });
                     }
                    /**
                     * Fetching user's authorized function list from data base : END
                     */
                  
                    let userData            = updateUserDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    let rolesData           = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                    let modulesData         = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                    let accountsData        = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                    let moduleUserRoleData  = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
                    let userUnitData        = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
                    
                    // Fetching  user subscription details with filtered modules details based on roles of logged-in user
                    const GET_SUBSCRIPTION_DATA = await getSubscriptionData(userId, userData, rolesData, modulesData, accountsData, moduleUserRoleData,userUnitData);
                    
                    if(GET_SUBSCRIPTION_DATA !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                        let loginData               = updateUserDBResponse.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                        let roleData                = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                        let authorizedModuleData    = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
                        let userAccountData         = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
                        let userModuleRoleData      = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
                        let userUnitData            = GET_SUBSCRIPTION_DATA[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
                        let authorizedFunctionData  = AUTHORIZED_FUNCTIONS_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
                        let bcmStreeringCommittee   = USER_SUBSCRIPTION_DB_RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] || [];

                        const RECORDSET_DATA        = await formatRecordSetData(userId, loginData, roleData, authorizedModuleData, userAccountData, userModuleRoleData,userUnitData, authorizedFunctionData,bcmStreeringCommittee);
                        logger.log('info', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : RECORDSET_DATA : ' + JSON.stringify(RECORDSET_DATA));
                     
                        if(RECORDSET_DATA !== CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
                            logger.log('info', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Login successful. : Execution end. : Token : ' + token);
                            /**
                             * Sending susscessful response to UI
                             */
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ONE,
                                message : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_SUCCESS,
                                result  : RECORDSET_DATA,
                                token   : token,
                                error   : {
                                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
                                }
                            });
                        } else {
                            logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error on manipulating data of formatRecordSetData function.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                error   : {
                                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                                }
                            });

                        }
                    } else {
                        logger.log('error', 'User ID : ' + userId + ' : AuthBl : updateUserLogin : Execution end. : Error on manipulating data of getSubscriptionData function.');
                        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                            success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                            message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            error   : {
                                errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                                errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                            }
                        });
                    }
                } else {
                    logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : Execution end. : Error on fetching user ID from database, User is not existing in DB. : User = ' + userName);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        error   : {
                            errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                            errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.USER_NOT_EXISTING_IN_DB
                        }
                    });
                }
                /**
                 * Fetching User Id from data base by user name : END
                 */
            } else if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.NULL != API_RESPONSE_OBJ && CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO === API_RESPONSE_OBJ.success) {
                let errorMessageFromAuthApplication = API_RESPONSE_OBJ.error.errorMessage;
                let errorCode                       = API_RESPONSE_OBJ.error.errorCode;
                logger.log('error', 'AuthBl : updateUserLogin : Execution end. : Error from Auth application module, for more details check Auth application module API log.: Error details : ' + errorMessageFromAuthApplication);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    error   : {
                        errorCode       : errorCode,
                        errorMessage    : errorMessageFromAuthApplication
                    }
                });
            } else {
                logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : Execution end. : Error details : Error from Auth application module, for more details check Auth application module API log.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                    success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                    message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    error   : {
                        errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                        errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                    }
                });
            }
        } catch (error) {
            logger.log('error', 'User Name : '+ userName + ' : AuthBl : updateUserLogin : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGIN_UNSUCCESS
                }
            });
        }
    }
    
    /**
     * This function will delete the token for particular user form data base   
     * @param {*} request 
     * @param {*} response 
     */
    async updateUserLogout(request, response) {
        logger.log('info', 'AuthBl : updateUserLogout : Execution started.');

        try {
            var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var token               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            var accountGUIDFromToken = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
            
            // check request body should not be undefined
            if(typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED ) {
                logger.log('error', 'AuthBl : updateUserLogout : Execution end. : Request body has not found');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
        
            token               = request.body.token;        
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            accountGUIDFromToken = request.body.accountGUIDFromToken
        
            //check request refreshedToken should not be undefined or null
            if(refreshedToken === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || refreshedToken === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){          
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Token is null or undefined in request body');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            
            const DB_RESPONSE = await  authDbObject.updateUserLogout(userIdFromToken, userNameFromToken, token, accountGUIDFromToken);                
            
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DB_RESPONSE){
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : DB Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : User logout from database successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_SUCCESS, DB_RESPONSE.recordset));
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : AuthBl : updateUserLogout : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
        }
    }


    // API for fetching all the accounts for the dropdown.
    async getAllAccountsName(request, response) {
        logger.log('info', 'AuthBl : getAllAccountsName : Execution started.');

        try {

            const DB_RESPONSE = await authDbObject.getAllAccountsName();
            logger.log('info', ' : AuthBl : getAllAccountsName : ACCOUNTS_DB_RESPONSE : ' + JSON.stringify(DB_RESPONSE));

            if (CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == DB_RESPONSE || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == DB_RESPONSE) {
                logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : DB Response is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }
            if (DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && DB_RESPONSE.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
            }

            logger.log('info', ' : AuthBl : getAllAccountsName : Execution end. : Accounts fetched from database successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_SUCCESSFUL, DB_RESPONSE.recordset));
        } catch (error) {
            logger.log('error', ' : AuthBl : getAllAccountsName : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.LOGOUT_FAIL));
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
 * Send API request to Auth application auth module
 * @param {*} requestBody 
 * @param {*} endPoint 
 * @returns 
 */
async function sendRequestToAuthAPIApplication(requestBody, endPoint) {
    try {
        logger.log('info', 'AuthBl : sendRequestToAuthAPIApplication : Execution started.');
        logger.log('info', 'AuthBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint);
        logger.log('info', 'AuthBl : sendRequestToAuthAPIApplication : Sending request to API URL with requestBody value = ' + JSON.stringify(requestBody));
        
        const AUTH_SERVICE_BASE_URL = APP_CONFIG.AUTH_SERVICE_URL;
        const HEADERS               = { 'Content-Type': 'application/json'};
        
        return AXIOS.post(AUTH_SERVICE_BASE_URL + endPoint, {reqPayload: requestBody}, {headers: HEADERS})
        .then((response) => {
            logger.log('info', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Response Received for API URL : ' + endPoint);
            logger.log('info', 'AuthBl : sendRequestToAuthAPIApplication : Response Received for API URL with response value = ' + JSON.stringify(response.data));
            return response.data;
        })
        .catch((error) => {
            logger.log('error', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
            logger.log('error', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Error occured while processing request for API URL : ' + endPoint + ' : Error details : ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        });
    } catch (error) {
        logger.log('error', 'AuthBl : sendRequestToAuthAPIApplication : Sending request to API URL : ' + endPoint + ' : wtih input value : ' + JSON.stringify(requestBody));
        logger.log('error', 'AuthBl : sendRequestToAuthAPIApplication : Execution end. : Got unhandled error. : Error details : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


/**
 * This is function will be used to fetch modules details based on roles of logged-in user.
 */
async function getSubscriptionData(userId, userData, rolesData, modulesData, accountsData, moduleUserRoleData,userUnitData){
    try {
        logger.log('info', 'User ID : ' + userId + ' : AuthBl : getSubscriptionData : Execution started.');

        let userRole       = [];
        let moduleAccessed = [];
        let result         = [];

        userRole = rolesData.filter(ele => ele.RoleID == userData[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].RoleID);
       
        let roleName = userRole.map(element => element.Name);
      
        if( roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.SUPER_ADMIN){
            moduleAccessed = modulesData.filter(ele => ele.Abbreviation == CONSTANT_FILE_OBJ.APP_CONSTANT.ORM || ele.Abbreviation == CONSTANT_FILE_OBJ.APP_CONSTANT.UM);
        }else if(roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.USER_MANAGEMENT){
            moduleAccessed = modulesData.filter(ele => ele.Abbreviation == CONSTANT_FILE_OBJ.APP_CONSTANT.UM);
        }else if(roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.POWER_USER || roleName == CONSTANT_FILE_OBJ.APP_CONSTANT.STANDARD_USER){
            moduleAccessed = modulesData.filter(ele => ele.Abbreviation == CONSTANT_FILE_OBJ.APP_CONSTANT.ORM || ele.Abbreviation == CONSTANT_FILE_OBJ.APP_CONSTANT.BCM );
        }
     
        result.push(rolesData, moduleAccessed, accountsData, moduleUserRoleData,userUnitData);
      
        logger.log('info', 'User ID : ' + userId + ' : AuthBl : getSubscriptionData : Execution end.');

        return result;
    } catch (error) {
        logger.log('error', 'User ID : ' + userId + ' : AuthBl : getSubscriptionData : Execution end. : Got unhandled error. : Error details : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}

/**
 * This is function will format the data .
 */
async function formatRecordSetData(userId, loginData, roleData, authorizedModuleData, userAccountData, userModuleRoleData,userUnitData, authorizedFunctionData,bcmStreeringCommittee){
    try {
        logger.log('info', 'User Id : '+ userId +' : AuthBl : formatRecordSetData : Execution started.');

        let dataSet = {
            "loginData"                 : loginData,
            "roleData"                  : roleData,
            "authorizedModuleData"      : authorizedModuleData,
            "userAccountData"           : userAccountData,
            "userModuleRoleData"        : userModuleRoleData,
            "userUnitData"              : userUnitData,
            "authorizedFunctionData"    : authorizedFunctionData,
            "bcmStreeringCommittee"     : bcmStreeringCommittee
        };

        return dataSet;
    } catch (error) {
        logger.log('error', 'User Id : '+ userId +' : AuthBl : formatRecordSetData : Execution end. : Got unhandled error. : Error Detail : ' + error);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
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