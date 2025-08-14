const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');

module.exports = class InAppNotificationDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch user alert information from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @returns 
     */
    async getUserAlerts(userIdFromToken,userNameFromToken) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationDb : getUserAlerts : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserGUID',    MSSQL.UniqueIdentifier, userIdFromToken);
            request.input('UserName',    MSSQL.NVarChar, userNameFromToken);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts     :  No Input parameters value for ORM.GetUserAlertsForNotification procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts     :  UserName     = ' + userNameFromToken);
            // logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts  :  UserGUID     = ' + data.userGUID);          

            return request.execute('ORM.GetUserAlertsForNotification').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts : Output parameters value of ORM.GetUserAlertsForNotification procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts    : No Input parameters value for ORM.GetUserAlertsForNotification procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts    : UserName      = ' + userNameFromToken);
                // logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  UserGUID     = ' + data.userGUID); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts    : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts    : No Input parameters value for ORM.GetUserAlertsForNotification procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts    : UserName      = ' + userNameFromToken);
            // logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  UserGUID     = ' + data.userGUID); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : getUserAlerts    : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update user alert data
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @returns 
     */
    async updateUserAlerts(userIdFromToken,userNameFromToken,data) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationDb : updateUserAlerts : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserAlertID',    MSSQL.Int, data.userAlertID);
            request.input('IsRead',         MSSQL.Bit, data.isRead);
            request.input('UserName',       MSSQL.NVarChar, userNameFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  No Input parameters value for ORM.UpdateUserAlerts procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  UserName         = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  UserAlertID      = ' + data.userAlertID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  IsRead           = ' + data.isRead);
            return request.execute('ORM.UpdateUserAlerts').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : Output parameters value of ORM.UpdateUserAlerts procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : No Input parameters value for ORM.UpdateUserAlerts procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : UserName          = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  UserAlertID      = ' + data.userAlertID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  IsRead           = ' + data.isRead);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : No Input parameters value for ORM.UpdateUserAlerts procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : UserName          = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  UserAlertID      = ' + data.userAlertID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts :  IsRead           = ' + data.isRead);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : updateUserAlerts : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add user alert data to database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @returns 
     */
    async setUserAlerts(userIdFromToken,userNameFromToken,data) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationDb : setUserAlerts : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('InAppContent',       MSSQL.NVarChar, data.inAppContent);
            request.input('RecepientUserID',    MSSQL.NVarChar, data.recepientUserID);
            request.input('SubModuleID',        MSSQL.NVarChar, data.subModuleID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts :  No Input parameters value for ORM.AddUserAlerts procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts :  UserName            = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts :  InAppContent        = ' + data.inAppContent);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts :  subModuleID         = ' + data.subModuleID);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts :  RecepientUserID     = ' + data.recepientUserID);

            return request.execute('ORM.AddUserAlerts').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : Output parameters value of ORM.AddUserAlerts procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : No Input parameters value for ORM.AddUserAlerts procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : UserName             = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : InAppContent        = ' + data.inAppContent);
                // logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : RecepientUserID     = ' + data.recepientUserID);    
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : No Input parameters value for ORM.AddUserAlerts procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : UserName             = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts :  InAppContent        = ' + data.inAppContent);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts :  RecepientUserID     = ' + data.recepientUserID);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : setUserAlerts : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update user alert data
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @returns 
     */
     async deleteUserAlerts(userIdFromToken,userNameFromToken,data) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : InAppNotificationDb : deleteUserAlerts : Execution started.');
        /**
         *   dbResponseObj.status values
         *   1 - Successful operation
         *   0 - Error while connecting database
         *   2 - Error while executing procedure
         */
        var dbResponseObj = {
            status           : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
            recordset        : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            errorMsg         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
            procedureSuccess : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
            procedureMessage : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL
        };

        try {
            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('UserAlertID',    MSSQL.Int, data.userAlertID);           
            request.input('UserName',       MSSQL.NVarChar, userNameFromToken);
            request.output('Success',       MSSQL.Bit);
            request.output('OutMessage',    MSSQL.VarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts :  No Input parameters value for ORM.DeleteUserAlerts procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts :  UserName         = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts :  UserAlertID      = ' + data.userAlertID);
           
            return request.execute('ORM.DeleteUserAlerts').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : Output parameters value of ORM.DeleteUserAlerts procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : No Input parameters value for ORM.DeleteUserAlerts procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : UserName          = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts :  UserAlertID      = ' + data.userAlertID);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : No Input parameters value for ORM.DeleteUserAlerts procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : UserName          = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts :  UserAlertID      = ' + data.userAlertID);           
            logger.log('error', 'User Id : ' + userIdFromToken + ' : InAppNotificationDb : deleteUserAlerts : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}