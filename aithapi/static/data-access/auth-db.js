const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class AuthDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will get user data for single user from database
     * @param {*} userName 
     * @returns 
     */ 
    async getUserIdByUserName(userName) {
        logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Execution started.');
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

            request.input('ADUsername',     MSSQL.NVarChar, userName);
            request.input('UserName',       MSSQL.NVarChar, userName);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Input parameters value for UM.GetUsers procedure.');
            logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : ADUsername  = ' + userName);
            logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : userName    = ' + userName);

            return request.execute('UM.GetUsers').then(function (result) {
                
                logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Output parameters value of UM.GetUsers procedure.');
                logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Success      = ' + result.output.Success);
                logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : OutMessage   = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = result.recordsets;

                logger.log('info', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Input parameters value for UM.GetUsers procedure.');
                logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : ADUsername = ' + userName);
                logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : userName   = ' + userName);
                logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Execution end. : Error details : '+ error);

                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Input parameters value for UM.GetUsers procedure.');
            logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : ADUsername = ' + userName);
            logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : userName   = ' + userName);
            logger.log('error', 'User Name : '+ userName +' : AuthDb : getUserIdByUserName : Execution end. : Error details : '+ error);
            
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update user master table
     * @param {*} setTryCount 
     * @param {*} currentTime 
     * @param {*} userId 
     * @param {*} userName 
     */
    async updateUserMaster(setTryCount, currentTime, userId, userName) {
        logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Execution started.');
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

            request.input('UserGUID',       MSSQL.UniqueIdentifier,     userId);
            request.input('TryCount',       MSSQL.TinyInt,              setTryCount);
            request.input('LastLogin',      MSSQL.DateTime,             currentTime);
            request.input('UserName',       MSSQL.NVarChar,             userName);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.NVarChar);

            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Input parameters value for UM.UpdateUser procedure.');
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : UserGUID    = ' + userId);
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : TryCount    = ' + setTryCount);
            logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : LastLogin   = ' + currentTime);

            return request.execute('UM.UpdateUser').then(function (result) {

                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Output parameters value of UM.UpdateUser procedure.');
                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Success     = ' + result.output.Success);
                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : OutMessage  = ' + result.output.OutMessage);

                dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess  = result.output.Success;
                dbResponseObj.procedureMessage  = result.output.OutMessage;
                dbResponseObj.recordset         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

                logger.log('info', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Input parameters value for UM.UpdateUser procedure.');
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : UserGUID    = ' + userId);
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : TryCount    = ' + setTryCount);
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : LastLogin   = ' + currentTime);
                logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Execution end. : Error details : '+ error);
               
                dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Input parameters value for UM.UpdateUser procedure.');
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : UserGUID    = ' + userId);
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : TryCount    = ' + setTryCount);
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : LastLogin   = ' + currentTime);
            logger.log('error', 'User Id : '+ userId +' : AuthDb : updateUserMaster : Execution end. : Error details : '+error);
           
            dbResponseObj.status    = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg  = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
           
            return dbResponseObj;
        }
    }

    stop(){
    }
}