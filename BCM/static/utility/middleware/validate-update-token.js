const APP_ROUTE_METHODS = require('../../config/route-methods.json');
const COMMOM_DB         = require('../data-base-utility/common-db.js');
const UTILITY_APP       = require('../utility.js');
const CONSTANT_FILE_OBJ = require('../constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../message/message-constant.js');

var commonDBObject      = new COMMOM_DB();
var utilityAppObject    = new UTILITY_APP();


module.exports = async function validateUpdateToken(request, response, next){
    try {
        logger.log('info', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution started.');

        var token               = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var refreshedToken      = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken     = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        var validateTokenResponseObj = {
            status          : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            message         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            refreshedToken  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        var userIdFromTokenObj = {
            error   : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            userId  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        var userNameFromTokenObj = {
            error       : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            userName    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        // check request body should not be undefined
        if(typeof request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Request body has not found');

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_REQUEST
                }
            });
        }

        let requestToken =  (request.body.token === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || request.body.token === "null" || request.body.token===CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED || request.body.token==="undefined") ? request.headers.authorization : request.body.token;

        if(requestToken === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL || requestToken === CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Token is null or undefined in request body');

            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TOKEN_EXPIRED
                }
            }); 
        }

        token = requestToken;
        
        logger.log('info', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Token from request : '+token);

        var routeObject         = await getCurrentRouteObject(request.originalUrl);
        var functionName        = routeObject.functionName;
        var validateFunction    = routeObject.validateFunction;

        validateTokenResponseObj = utilityAppObject.validateToken(token);

        // checking validation token method result and according to that making response on error case
        if (validateTokenResponseObj.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO) {
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in token');
            // Case : Error in token
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json({
                success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
                message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                token   : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
                error   : {
                    errorCode       : CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED,
                    errorMessage    : MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.TOKEN_EXPIRED
                }
            });
        }

        // We will send refreshedToken in response on successful condition
        refreshedToken = validateTokenResponseObj.refreshedToken;

        /**
         * Fetching user id from refreshed token. : Start
         */
        userIdFromTokenObj = utilityAppObject.getUserIdFromToken(refreshedToken);
        
        if (userIdFromTokenObj.error) {
            // Case : Unable to fetch user id from token
            logger.log('error', 'ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Unable to fetch user id from token.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(utilityAppObject.invalidTokenResposeString());
        }

        userIdFromToken = userIdFromTokenObj.userId;
        /**
         * Fetching user id from refreshed token. : End
         */

        /**
         * Fetching user name from refreshed token. : Start
         */
        userNameFromTokenObj = utilityAppObject.getUserNameFromToken(refreshedToken);

        if (userNameFromTokenObj.error){
            // Case : Unable to fetch user name from token
            logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Unable to fetch user name from token.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(utilityAppObject.invalidTokenResposeString());
        }
        
        userNameFromToken = userNameFromTokenObj.userName;
        /**
         * Fetching user name from refreshed token. : End
         */

        /**
         * updating user login table with refresh token
         */
        const GET_INFO_USER_LOGIN = await commonDBObject.getInfoForUserLogin(userIdFromToken, userNameFromToken);
        if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_USER_LOGIN || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_USER_LOGIN){
            logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware: getInfoForUserLogin : Execution end. : GET_INFO_USER_LOGIN is undefined or null.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
        }
        if (GET_INFO_USER_LOGIN.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware: getInfoForUserLogin : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
        }
        if (GET_INFO_USER_LOGIN.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_USER_LOGIN.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
            logger.log('error', 'User Id : '+userIdFromToken +' : ValidateUpdateTokenMiddleware: getInfoForUserLogin: Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
        }
        
        let usersLoginData  = GET_INFO_USER_LOGIN.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
        let roleId          = usersLoginData.filter(ele => ele.UserGUID == userIdFromToken).map(ele => ele.RoleID);

        logger.log('info', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : userIdFromToken = ' + userIdFromToken);
        logger.log('info', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : roleId          = ' + roleId);

        if(userIdFromToken != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && userIdFromToken != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED && roleId != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && roleId != CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED){

            const COMMON_DB_RESPONSE = await commonDBObject.updateUserLoginForRefreshToken(userIdFromToken, userNameFromToken,refreshedToken,token);

            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED != COMMON_DB_RESPONSE){
                if (COMMON_DB_RESPONSE.procedureMessage === CONSTANT_FILE_OBJ.APP_CONSTANT.INVALID_SESSION) {

                    // Case : Unable to update user login for refresh token
                    logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in db update for refresh token : '+COMMON_DB_RESPONSE.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));

                } else if (COMMON_DB_RESPONSE.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && COMMON_DB_RESPONSE.procedureMessage != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && COMMON_DB_RESPONSE.procedureSuccess != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && COMMON_DB_RESPONSE.procedureSuccess != CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE){
                    logger.log('info', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Refresh token updated successfully.');

                    /**
                    * Validating function for the logged in user : START
                    */
                    if(validateFunction != CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                        const GET_INFO_FOR_AUTHORIZED = await commonDBObject.getInfoFunctionAuthorized(userIdFromToken, userNameFromToken);            
                        
                        if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == GET_INFO_FOR_AUTHORIZED || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == GET_INFO_FOR_AUTHORIZED){
                            logger.log('error', 'User Id : '+  userIdFromToken +' : ValidateUpdateTokenMiddleware  : getInfoFunctionAuthorized : Execution end. : GET_INFO_FOR_AUTHORIZED is undefined or null.');
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
                        }
                        if (GET_INFO_FOR_AUTHORIZED.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                            logger.log('error', 'User Id : '+  userIdFromToken +' : ValidateUpdateTokenMiddleware : getInfoFunctionAuthorized : Execution end. : Error details :' + DB_RESPONSE.errorMsg);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
                        }
                        if (GET_INFO_FOR_AUTHORIZED.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && GET_INFO_FOR_AUTHORIZED.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                            logger.log('error', 'User Id : '+  userIdFromToken +' : ValidateUpdateTokenMiddleware : getInfoFunctionAuthorized : Execution end. : Error details : ' + DB_RESPONSE.procedureMessage);
                            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
                        }
                    

                        let usersData     = GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? 
                                            GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE].filter(ele => ele.UserGUID == userIdFromToken) : [];
                                
                        let DefaultRoleID = usersData && usersData.length ? usersData.map(ele =>ele.DefaultRoleID) : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                        logger.log('info', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : DefaultRoleID   = ' + DefaultRoleID);

                        //Check if User is not a Super Admin
                        if(DefaultRoleID != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE ){
                            
                            const IS_FUNCTION_AUTHORIZED = await getFunctionAuthorized(userIdFromToken,GET_INFO_FOR_AUTHORIZED,functionName);
                            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == IS_FUNCTION_AUTHORIZED || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == IS_FUNCTION_AUTHORIZED){
                                logger.log('error', 'User Id : '+  userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : IS_FUNCTION_AUTHORIZED is undefined or null.');
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
                            }
                            if(IS_FUNCTION_AUTHORIZED == CONSTANT_FILE_OBJ.APP_CONSTANT.UNAUTHORIZED_ACCESS){
                                logger.log('error', 'User Id : '+  userIdFromToken +' : ValidateUpdateTokenMiddleware  : validateUpdateToken : Execution end. : User is not authorized for the function.'+ functionName);
                                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken,CONSTANT_FILE_OBJ.APP_CONSTANT.NULL, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNAUTHORIZED_ACCESS));
                            }

                            logger.log('info', 'User ID : ' +  userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : User is authoruzed for the funtion'+ functionName);
                        }

                        logger.log('info',  'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution End.');  
                    } else {
                        logger.log('info', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : validateFunction = ' +validateFunction);
                    }  
                    /**
                     * Validating function for the logged in user : END
                     */

                    request.body.userIdFromToken    = userIdFromToken;
                    request.body.userNameFromToken  = userNameFromToken;
                    request.body.refreshedToken     = refreshedToken;
    
                    next();
                }else {
                    logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in Procedure execution while db update for refresh token : '+COMMON_DB_RESPONSE.procedureMessage);
                    return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
                }
            } else {
                logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error in db update for refresh token.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
            } 
        } else {
            logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Error Detail : userIdFromToken or roleId is null or undefined.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
        }
    } catch (error) {
        logger.log('error', 'User Id : '+ userIdFromToken +' : ValidateUpdateTokenMiddleware : validateUpdateToken : Execution end. : Got unhandled error : Error Detail : '+ error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
    }
};

async function getCurrentRouteObject(requestUri){
    logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : Execution started.');
    var uriComponents   = requestUri.split(CONSTANT_FILE_OBJ.APP_CONSTANT.FORWARD_SLASH);
    const URI_LENGTH    = uriComponents.length;
    const END_POINT     = uriComponents[URI_LENGTH - CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];

    logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : END_POINT : ' + END_POINT);
    
    var isEndPointFound = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
    var routeObj;

    for(obj of APP_ROUTE_METHODS["ROUTE_METHODS"]){
        if(END_POINT in obj){
            routeObj = {"functionName": obj[END_POINT], "validateFunction": obj["validateFunction"]};
            isEndPointFound = CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE;
            logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : End point found in route-methods.json file.');
            break;
        } 
    }
    
    if(isEndPointFound){
        logger.log('info', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : Execution end. : routeObj : ' + JSON.stringify(routeObj));
        return routeObj;
    } else {
        logger.log('error', 'ValidateUpdateTokenMiddleware : getCurrentRouteObject : Execution end. : unable to find End point in route-methods.json file : End Point value is : ' + END_POINT);
        return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    }
}


function unsuccessfulResponse(refreshedToken,errorCode, errorMessage){
    return {
        success : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
        message : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        result  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
        token   : refreshedToken,
        error   : {
            errorCode    : errorCode,
            errorMessage : errorMessage
        }
    }
}


/**
 * This function will check whether user is authorized or not.
 */
async function getFunctionAuthorized(userIdFromToken, GET_INFO_FOR_AUTHORIZED,functionName){
    let moduleUser          = [];
    let modules             = [];
    let roles               = [];
    let appFunctionData     = [];
    let appModuleData       = [];
    let roleAppFunctions    = [];
    let moduleGUID          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let roleId              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let appFuntionID        = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    let appModuleID         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
    
    //Results provided by DB for GET_INFO_FOR_AUTHORIZED
    // 0. UserLogins 
    // 1. Users 
    // 2. Modules 
    // 3. ModuleUserRoles 
    // 4. Roles 
    // 5. AppFunctions
    // 6. AppModules
    // 7. RoleAppFunctions

    try {
        logger.log('info', 'User ID : '+ userIdFromToken + ' : ValidateUpdateTokenMiddleware : getFunctionAuthorized : Execution started.');
        // logger.log('info', 'User ID : '+ userIdFromToken + ' : ValidateUpdateTokenMiddleware : getFunctionAuthorized : ' + JSON.stringify(GET_INFO_FOR_AUTHORIZED));
        
        if(GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL){
            //checking for module authorization for logged-in user
            moduleUser = GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE].filter(ele => ele.UserGUID == userIdFromToken);
            if(moduleUser != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && moduleUser.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                moduleGUID  = moduleUser.map(ele => ele.ModuleGUID);
                roleId      = moduleUser.map(ele => ele.RoleID);

                modules     = GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? 
                              GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO].filter(ele => moduleGUID.includes(ele.ModuleGUID)) : [];

                //checking for role authorization for logged-in user          
                roles       = GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ? 
                              GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR].filter(ele => roleId.includes(ele.RoleID)) : [] ;
            
                if(modules != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && modules.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO &&
                    roles != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && roles.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO ){                       
                        /*
                        * Checking for function authorization for logged-in user based on roles and module assigned : START
                        */
                        appFunctionData = GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?
                                          GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE].filter(ele => ele.AppFunctionName == functionName) : []; 
                       
                        if(appFunctionData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && appFunctionData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){

                            appFuntionID    = appFunctionData.map(ele => ele.AppFunctionID);
                            appModuleID     = appFunctionData.map(ele => ele.AppModuleID);
                            appModuleData   = GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?
                                              GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX].filter(ele =>  appModuleID.includes(ele.AppModuleID)) : [];
                        
                            if(appModuleData != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && appModuleData.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){ 

                                roleAppFunctions = GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN] != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL ?
                                                   GET_INFO_FOR_AUTHORIZED.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN].filter(ele =>  appFuntionID.includes(ele.AppFunctionID)  && roleId.includes(ele.RoleID)) : [];
                              
                            }     
                                
                        }
                        /*
                        * Checking for function authorization for logged-in user based on roles and module assigned : END
                        */                       
                }        
            }
        }
        logger.log('info', 'User ID : '+ userIdFromToken + ' : ValidateUpdateTokenMiddleware : getFunctionAuthorized : Execution end.');

        if(roleAppFunctions != CONSTANT_FILE_OBJ.APP_CONSTANT.NULL && roleAppFunctions.length > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
            logger.log('info', 'User ID : ' +  userIdFromToken +' : ValidateUpdateTokenMiddleware : getFunctionAuthorized : User is authoruzed for the funtion.');
            return CONSTANT_FILE_OBJ.APP_CONSTANT.AUTHORIZED_ACCESS;
        }else{
            logger.log('info', 'User ID : ' +  userIdFromToken +' : ValidateUpdateTokenMiddleware : getFunctionAuthorized : User is not authoruzed for the funtion.');
            return CONSTANT_FILE_OBJ.APP_CONSTANT.UNAUTHORIZED_ACCESS;
        }

    } catch (error) {
        logger.log('error', 'User ID :'+userIdFromToken + ' : ValidateUpdateTokenMiddleware : getFunctionAuthorized : Execution end. : Got unhandled error. : Error details : ' + error);
        return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,CONSTANT_FILE_OBJ.APP_CONSTANT.TOKEN_EXPIRED, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.INVALID_SESSION));
    }
}