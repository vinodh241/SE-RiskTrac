const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../message/message-constant.js');

module.exports = class CommonDBManager {
    constructor() {
    }

    start() {

    }

    /**
     * This function will update refreshed token details into database
     * @param {*} userId 
     * @param {*} userName 
     * @param {*} refreshedToken 
     * @param {*} oldToken  
     */
    async updateUserLoginForRefreshToken(userId, userName, refreshedToken, oldToken) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
         var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };
        
        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('OldToken',           MSSQL.NVarChar,         oldToken);
            request.input('Token',              MSSQL.NVarChar,         refreshedToken);
            request.input('UserID',             MSSQL.UniqueIdentifier, userId);
            request.input('UserName',           MSSQL.NVarChar,         userName);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : userId              = ' + userId);
            
            return request.execute('UM.UpdateUserLogin').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Output parameters value of UpdateUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : OutMessage  = ' + result.output.OutMessage);
                
                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Input parameters value for UpdateUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : oldToken            = ' + oldToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : refreshedToken      = ' + refreshedToken);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : userId              = ' + userId);

                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg          = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                dbResponseObj.procedureSuccess  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
                dbResponseObj.procedureMessage  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {

            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : updateUserLoginForRefreshToken : Execution end. : Error details : '+error);
            
            dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.procedureSuccess  = CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE;
            dbResponseObj.procedureMessage  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            dbResponseObj.errorMsg          = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

 
     /**
     * This function will get user-login and users details from database
     * @param {*} userName 
     * @param {*} userName
     * @returns 
     */
     async getInfoForUserLogin(userId, userName) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',       MSSQL.NVarChar,         userName);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : userName    = ' + userName);

            return request.execute('UM.GetInfoforUserLogin').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Output parameters value of UM.GetInfoforUserLogin procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : userName    = ' + userName);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Input parameters value for UM.GetInfoforUserLogin procedure.');
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : userName    = ' + userName);
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoForUserLogin : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

     /**
     * This function will get info for authorized function from database
     * @param {*} userName 
     *  @param {*} userName
     * @returns 
     */
     async getInfoFunctionAuthorized(userId, userName) {
        logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status              : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset           : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg            : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess    : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage    : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserName',       MSSQL.NVarChar,         userName);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);

            return request.execute('UM.GetInfoforAuthorizedfunction').then(function (result) {
                
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Output parameters value of UM.GetInfoforAuthorizedfunction procedure.');
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);
                logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                return dbResponseObj;
            });
        } catch (error) {
		    logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Input parameters value for UM.GetInfoforAuthorizedfunction procedure.');
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : userName    = ' + userName);
            logger.log('error', 'User Id : '+ userId +' : CommonDBManager : getInfoFunctionAuthorized : Execution end. : Error details : '+ error);
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            return dbResponseObj;
        }
    }

    stop(){
    }
}