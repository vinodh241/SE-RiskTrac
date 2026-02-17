const MSSQL             = require('mssql');
const CONSTANT_FILE_OBJ = require('../utility/constants/constant.js');
const MESSAGE_FILE_OBJ  = require('../utility/message/message-constant.js');
const selfAssessmentApprovedTemplate = require('../config/email-template/self-assessment-approved-template.js');

module.exports = class ScheduleAssessmentDb {
    constructor() {
    }

    start() {
    }

    /**
     * This function will fetch self Assessment By Schedule Assessment ID details from database
     * @param { ScheduleAssessmentID, ScheduleInherentRiskID, IsActive, CreatedBy } binds
     * @returns 
     */
     async getSelfAssessmentSummaryByScheduleAssessmentID(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Execution started.');
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

            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.scheduleAssessmentID);
            request.input('ScheduleInherentRiskID',    MSSQL.Int, 0);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);
            
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : ScheduleAssessmentID    = ' + binds.scheduleAssessmentID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : ScheduleInherentRiskID    = 0');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSelfAssessmentSummary').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Output parameters value of ORM.GetSelfAssessmentSummary procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : ScheduleAssessmentID    = ' + binds.scheduleAssessmentID);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : ScheduleInherentRiskID    = 0');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : ScheduleAssessmentID    = ' + binds.scheduleAssessmentID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : ScheduleInherentRiskID    = 0');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : CreatedBy    = ' + binds.createdBy);
            
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByScheduleAssessmentID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch self Assessment details from database
     * @param { ScheduleAssessmentID, CreatedBy } binds
     * @returns 
     */
    async getDataForSelfAssessmentScreen(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Execution started.');
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

            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Input parameters value of ORM.GetDataForSelfAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetDataForSelfAssessmentScreen').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Output parameters value of ORM.GetDataForSelfAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Input parameters value of ORM.GetDataForSelfAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Input parameters value of ORM.GetDataForSelfAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForSelfAssessmentScreen : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }


    /**
     * This function will fetch manage self Assessment details from database
     * @param { ScheduleInherentRiskID, CreatedBy } binds
     * @returns 
     */
    async getDataForManageSelfAssessmentScreen(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Execution started.');
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

            request.input('ScheduleInherentRiskID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Input parameters value of ORM.GetDataForManageSelfAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetDataForManageSelfAssessmentScreen').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Output parameters value of ORM.GetDataForManageSelfAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Input parameters value of ORM.GetDataForManageSelfAssessmentScreen procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : ScheduleAssessmentID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Input parameters value of ORM.GetDataForManageSelfAssessmentScreen procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : ScheduleAssessmentID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getDataForManageSelfAssessmentScreen : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }


    /**
     * This function will fetch Self Assessment by Schedule Inherent ID details from database
     * @param { ScheduleAssessmentID, ScheduleInherentRiskID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getSelfAssessmentDetailsByScheduleInherentID(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Execution started.');
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

            request.input('ScheduleAssessmentID',    MSSQL.Int, 0);
            request.input('ScheduleInherentRiskID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : ScheduleAssessmentID    = 0');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSelfAssessmentSummary').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Output parameters value of ORM.GetSelfAssessmentSummary procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : ScheduleAssessmentID    = 0');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : ScheduleInherentRiskID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : ScheduleAssessmentID    = 0');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentDetailsByScheduleInherentID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Schedule Assessment Cards from database
     * @param { ScheduleAssessmentID, CreatedBy } binds
     * @returns 
     */
    async getAllScheduleAssessmentCards(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Execution started.');
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

            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Input parameters value of ORM.GetScheduleAssessmentCards procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetScheduleAssessmentCards').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Output parameters value of ORM.GetScheduleAssessmentCards procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Input parameters value of ORM.GetScheduleAssessmentCards procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : ScheduleAssessmentID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Input parameters value of ORM.GetScheduleAssessmentCards procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getAllScheduleAssessmentCards : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Schedule Assessment By ID from database
     * @param { ScheduleAssessmentID, ScheduleInherentRiskID ,IsActive, CreatedBy } binds
     * @returns 
     */
    async getScheduleAssessmentByID(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getAllScheduleAssessmentByID : Execution started.');
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

            request.input('ScheduleAssessmentID',    0);
            request.input('ScheduleInherentRiskID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Bit, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : ScheduleAssessmentID    = 0');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSelfAssessmentSummary').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Output parameters value of ORM.GetSelfAssessmentSummary procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : ScheduleAssessmentID    = 0');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : ScheduleInherentRiskID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Input parameters value of ORM.GetSelfAssessmentSummary procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : ScheduleAssessmentID    = 0');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleAssessmentByID : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Self Assessment Summary By Status from database
     * @param { ScheduleAssessmentID, ScheduleInherentRiskStatusID ,IsActive, CreatedBy } binds
     * @returns 
     */
    async getSelfAssessmentSummaryByStatus(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Execution started.');
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

            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('ScheduleInherentRiskStatusID',    MSSQL.Int, binds.scheduleInherentRiskStatusID);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Input parameters value of ORM.GetSelfAssessmentSummaryByStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : ScheduleInherentRiskID    = '+binds.scheduleInherentRiskStatusID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetSelfAssessmentSummaryByStatus').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Output parameters value of ORM.GetSelfAssessmentSummaryByStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Input parameters value of ORM.GetSelfAssessmentSummaryByStatus procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : ScheduleAssessmentID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : ScheduleInherentRiskID    = '+binds.scheduleInherentRiskStatusID);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Input parameters value of ORM.GetSelfAssessmentSummaryByStatus procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : ScheduleInherentRiskID    = '+binds.scheduleInherentRiskStatusID);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getSelfAssessmentSummaryByStatus : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will manage schedule assessment details to database server
     * @param { ScheduleInherentRiskID, ControlDescription, ControlAssessmentAndResidualRiskJSONData, ControlTestingResultComment, ControlTestingJSONData, IdentifiedAction, ActionPlanComments, SelfComment, ISSubmit,  CreatedBy } binds
     * @returns 
     */
    async manageScheduleAssessmentDetails(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Execution started.');
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

            var isSubmit=binds.isSubmit==true?1:0;

            // Fetching poolConnectionObject from global object of application
            var request = new MSSQL.Request(poolConnectionObject);

            request.input('ScheduleInherentRiskID',    MSSQL.Int, binds.id);
            request.input('ControlDescription',    MSSQL.NVarChar, binds.controlDescription);
            request.input('ControlAssessmentAndResidualRiskJSONData',    MSSQL.NVarChar, binds.controlAssessmentAndResidualRiskJSONData);
            request.input('ControlTestingResultComment',    MSSQL.NVarChar, binds.controlTestingResultComment);
            request.input('ControlTestingJSONData',    MSSQL.NVarChar, binds.controlTestingJSONData);
            request.input('IdentifiedAction',    MSSQL.NVarChar, binds.identifiedAction);
            request.input('ActionPlanComments',    MSSQL.NVarChar, binds.actionPlanComments);
            request.input('ScheduleActionPlanJSONData',    MSSQL.NVarChar, binds.scheduleActionPlanJSONData);
            request.input('SelfComment',    MSSQL.NVarChar, binds.selfComment);
            request.input('ISSubmit',    MSSQL.Bit, isSubmit);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Input parameters value of ORM.ManageScheduleAssessmentDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlDescription    = '+binds.controlDescription);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlAssessmentAndResidualRiskJSONData    = '+binds.controlAssessmentAndResidualRiskJSONData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlTestingResultComment    = '+binds.controlTestingResultComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlTestingJSONData    = '+binds.controlTestingJSONData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : IdentifiedAction    = '+binds.identifiedAction);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ActionPlanComments    = '+binds.actionPlanComments);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ScheduleActionPlanJSONData    = '+binds.scheduleActionPlanJSONData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : SelfComment    = '+binds.selfComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ISSubmit    = '+binds.isSubmit);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].ManageScheduleAssessmentDetails').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Output parameters value of ORM.ManageScheduleAssessmentDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Input parameters value of ORM.ManageScheduleAssessmentDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ScheduleAssessmentID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlDescription    = '+binds.controlDescription);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlAssessmentAndResidualRiskJSONData    = '+binds.controlAssessmentAndResidualRiskJSONData);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlTestingResultComment    = '+binds.controlTestingResultComment);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlTestingJSONData    = '+binds.controlTestingJSONData);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : IdentifiedAction    = '+binds.identifiedAction);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ActionPlanComments    = '+binds.actionPlanComments);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ScheduleActionPlanJSONData    = '+binds.scheduleActionPlanJSONData);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : SelfComment    = '+binds.selfComment);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ISSubmit    = '+binds.isSubmit);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Input parameters value of ORM.ManageScheduleAssessmentDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlDescription    = '+binds.controlDescription);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlAssessmentAndResidualRiskJSONData    = '+binds.controlAssessmentAndResidualRiskJSONData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlTestingResultComment    = '+binds.controlTestingResultComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ControlTestingJSONData    = '+binds.controlTestingJSONData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : IdentifiedAction    = '+binds.identifiedAction);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ActionPlanComments    = '+binds.actionPlanComments);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ScheduleActionPlanJSONData    = '+binds.scheduleActionPlanJSONData);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : SelfComment    = '+binds.selfComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : ISSubmit    = '+binds.isSubmit);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : manageScheduleAssessmentDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will get the email data from database server
     * @param { ID, TemplateName, CreatedBy } binds
     * @returns 
     */
    async getEmailTemplate(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getEmailTemplate : Execution started.');
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

            request.input('ID',    MSSQL.Int, binds.id);
            request.input('TemplateName',    MSSQL.NVarChar, binds.templateName);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Input parameters value of ORM.GetRCSAEmailData procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : ID    = '+binds.id);            
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : TemplateName    = '+binds.templateName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].[GetRCSAEmailData]').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Output parameters value of ORM.GetRCSAEmailData procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Input parameters value of ORM.GetRCSAEmailData procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : ID    = '+binds.id);            
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : TemplateName    = '+binds.templateName);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Input parameters value of ORM.GetRCSAEmailData procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : ID    = '+binds.id);            
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : TemplateName    = '+binds.templateName);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getEmailTemplate : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will add the email data to database server
     * @param { ToIDS, FromID, CCIDs, EmailSubject, EmailContent } binds
     * @returns 
     */
    async addEmailAlerts(binds) {
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : addEmailAlerts : Execution started.');
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

            request.input('ToIDs',        MSSQL.NVarChar, binds.toIDs);
            request.input('FromID',       MSSQL.NVarChar, "");
            request.input('CCIDs',        MSSQL.NVarChar, binds.toCCs);
            request.input('EmailSubject', MSSQL.NVarChar, binds.emailSubject);
            request.input('EmailContent', MSSQL.VarChar,  binds.emailContent);
            request.input('RetryCount',   MSSQL.Int,      CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO);
            request.input('RetryStatus',  MSSQL.NVarChar, CONSTANT_FILE_OBJ.APP_CONSTANT.OPEN);  
            request.output('Success',     MSSQL.Bit);
            request.output('OutMessage',  MSSQL.VarChar); 

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Input parameters value of ORM.AddEmailAlerts procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : ToIDs    = '+binds.toIDs);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : FromID    = ');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : CCIDs    = ');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : EmailSubject    = '+binds.emailSubject);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : EmailContent    = '+binds.emailContent);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].[AddEmailAlerts]').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Output parameters value of ORM.AddEmailAlerts procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Input parameters value of ORM.AddEmailAlerts procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : ToIDs    = '+binds.toIDs);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : FromID    = ');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : CCIDs    = ');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : EmailSubject    = '+binds.emailSubject);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : EmailContent    = '+binds.emailContent);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Input parameters value of ORM.GetRCSAEmailData procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : ToIDs    = '+binds.toIDs);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : FromID    = ');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : CCIDs    = ');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : EmailSubject    = '+binds.emailSubject);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : EmailContent    = '+binds.emailContent);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : addEmailAlerts : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update approved schedule inherent risk reviewer details to database
     * @param { ScheduleInherentRiskID, ReviewerComment, Status, CreatedBy } binds
     * @returns 
     */
    async updateApprovedScheduleInherentRiskReviewerDetails(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Execution started.');
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

            request.input('ScheduleInherentRiskID',    MSSQL.Int, binds.id);
            request.input('ReviewerComment',    MSSQL.NVarChar, binds.reviewerComment);
            request.input('Status',    MSSQL.NVarChar, 'Approved');
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Input parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : ReviewerComment    = '+binds.reviewerComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Status    = Approved');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddScheduleInherentRiskReviewerDetails').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Output parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Input parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : ScheduleInherentRiskID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : ReviewerComment    = '+binds.reviewerComment);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Status    = Approved');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Input parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : ReviewerComment    = '+binds.reviewerComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Status    = Approved');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateApprovedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will update rejected schedule inherent risk reviewer details to database
     * @param { ScheduleInherentRiskID, ReviewerComment, Status, CreatedBy } binds
     * @returns 
     */
    async updateRejectedScheduleInherentRiskReviewerDetails(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Execution started.');
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

            request.input('ScheduleInherentRiskID',    MSSQL.Int, binds.id);
            request.input('ReviewerComment',    MSSQL.NVarChar, binds.reviewerComment);
            request.input('Status',    MSSQL.NVarChar, 'Rejected');
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Input parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : ReviewerComment    = '+binds.reviewerComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Status    = Rejected');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].AddScheduleInherentRiskReviewerDetails').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Output parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : RecordSet    = ' + JSON.stringify(result.recordset));
                                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Input parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : ScheduleInherentRiskID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : ReviewerComment    = '+binds.reviewerComment);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Status    = Rejected');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Input parameters value of ORM.AddScheduleInherentRiskReviewerDetails procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : ReviewerComment    = '+binds.reviewerComment);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Status    = Rejected');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : updateRejectedScheduleInherentRiskReviewerDetails : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch Schedule Inherent Risk Action Trail from database
     * @param { ScheduleInherentRiskID, CreatedBy } binds
     * @returns 
     */
    async getScheduleInherentRiskActionTrail(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Execution started.');
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

            request.input('ScheduleInherentRiskID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Input parameters value of ORM.GetScheduleInherentRiskActionTrail procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetScheduleInherentRiskActionTrail').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Output parameters value of ORM.GetScheduleInherentRiskActionTrail procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Input parameters value of ORM.GetScheduleInherentRiskActionTrail procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : ScheduleInherentRiskID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Input parameters value of ORM.GetScheduleInherentRiskActionTrail procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : ScheduleInherentRiskID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getScheduleInherentRiskActionTrail : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch action responsible person from database
     * @param { ActionResponsiblePersonID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getActionResponsiblePerson(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getActionResponsiblePerson : Execution started.');
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

            request.input('ActionResponsiblePersonID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Int, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Input parameters value of ORM.GetActionResponsiblePerson procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : ActionResponsiblePersonID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetActionResponsiblePerson').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Output parameters value of ORM.GetActionResponsiblePerson procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Input parameters value of ORM.GetActionResponsiblePerson procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : ActionResponsiblePersonID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Input parameters value of ORM.GetActionResponsiblePerson procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : ActionResponsiblePersonID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getActionResponsiblePerson : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch residual risk response from database
     * @param { ResidualRiskResponseID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getResidualRiskResponse(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getResidualRiskResponse : Execution started.');
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

            request.input('ResidualRiskResponseID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Int, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : Input parameters value of ORM.GetResidualRiskResponse procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : ResidualRiskResponseID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRiskResponse').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : Output parameters value of ORM.GetResidualRiskResponse procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : Input parameters value of ORM.GetResidualRiskResponse procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : ResidualRiskResponseID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : CreatedBy    = ' + binds.createdBy);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : Input parameters value of ORM.GetResidualRiskResponse procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : ResidualRiskResponseID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponse : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch residual risk responsible person from database
     * @param { ResidualRiskResponsiblePersonID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getResidualRiskResponsiblePerson(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Execution started.');
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

            request.input('ResidualRiskResponsiblePersonID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Int, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Input parameters value of ORM.GetResidualRiskResponsiblePerson procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : ResidualRiskResponseID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetResidualRiskResponsiblePerson').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Output parameters value of ORM.GetResidualRiskResponsiblePerson procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Input parameters value of ORM.GetResidualRiskResponsiblePerson procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : ResidualRiskResponseID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Input parameters value of ORM.GetResidualRiskResponsiblePerson procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : ResidualRiskResponseID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getResidualRiskResponsiblePerson : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will fetch control type from database
     * @param { ControlTypeID, IsActive, CreatedBy } binds
     * @returns 
     */
    async getControlType(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getControlType : Execution started.');
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

            request.input('ControlTypeID',    MSSQL.Int, binds.id);
            request.input('IsActive',    MSSQL.Int, 1);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Input parameters value of ORM.GetControlType procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : ControlTypeID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].GetControlType').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Output parameters value of ORM.GetControlType procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Input parameters value of ORM.GetControlType procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : ControlTypeID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : IsActive    = 1');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Input parameters value of ORM.GetControlType procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : ControlTypeID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : IsActive    = 1');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getControlType : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will submit self assessment by schedule assessment to database server
     * @param { ScheduleAssessmentID,  CreatedBy } binds
     * @returns 
     */
    async submitSelfAssessmentsByScheduleAssessment(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Execution started.');
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

            request.input('ScheduleAssessmentID',    MSSQL.Int, binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Input parameters value of ORM.SubmitSelfAssessmentsByScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].SubmitSelfAssessmentsByScheduleAssessment').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Output parameters value of ORM.SubmitSelfAssessmentsByScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : RecordSet    = ' + JSON.stringify(result.recordset));
                
                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Input parameters value of ORM.SubmitSelfAssessmentsByScheduleAssessment procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : ScheduleAssessmentID    = '+binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : CreatedBy    = ' + binds.createdBy);
                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Input parameters value of ORM.SubmitSelfAssessmentsByScheduleAssessment procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : ScheduleAssessmentID    = '+binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : CreatedBy    = ' + binds.createdBy);
            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : submitSelfAssessmentsByScheduleAssessment : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function will upload RCSA evidence file to database.
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken 
     * @param {*} data 
     * @param {*} remarks
     * @param {*} callback 
     */
    uploadRCSAEvidence(id, userIdFromToken, userNameFromToken, data, remarks, callback) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentDb : uploadRCSAEvidence : Execution started.');
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

            request.input('ScheduleAssessmentID',   MSSQL.NVarChar,     id);
            request.input('OriginalFileName',       MSSQL.NVarChar,     data.fileName);
            request.input('FileType',               MSSQL.NVarChar,     data.fileType)
            request.input('FileContent',            MSSQL.VarBinary,    data.fileContent);
            request.input('Remark',                 MSSQL.NVarChar,     remarks)
            request.input('UserName',               MSSQL.NVarChar,     userNameFromToken);
            request.output('Success',               MSSQL.Bit);
            request.output('OutMessage',            MSSQL.VarChar)

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Input parameters value for ORM.RCSA_UploadScheduleAssessmentEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : ScheduleAssessmentID    = ' + id);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : UserName                = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : OriginalFileName        = ' + data.fileName);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : FileType                = ' + data.fileType);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Remarks                 = ' + remarks);

            request.execute('ORM.RCSA_UploadScheduleAssessmentEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Output parameters value of ORM.RCSA_UploadScheduleAssessmentEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Execution end.');

                callback(dbResponseObj);
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Input parameters value for ORM.RCSA_UploadScheduleAssessmentEvidence procedure.');
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : ScheduleAssessmentID   = ' + id);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : UserName               = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : OriginalFileName       = ' + data.fileName);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : FileType               = ' + data.fileType);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Remarks                = ' + remarks);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                callback(dbResponseObj);
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Input parameters value for ORM.RCSA_UploadScheduleAssessmentEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : ScheduleAssessmentID   = ' + id);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : UserName               = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : OriginalFileName       = ' + data.fileName);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : FileType               = ' + data.fileType);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Remarks                = ' + remarks);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : uploadRCSAEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            callback(dbResponseObj);
        }
    }

    /**
     * This function get rcsa evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data     
     * @returns 
     */
    async downloadRCSAEvidence(userIdFromToken, userNameFromToken, evidenceID) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentDb : downloadRCSAEvidence : Execution started.');
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

            request.input('ScheduleAssessmentEvidenceID',         MSSQL.BigInt, evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Input parameters value for ORM.INC_GetIncidentEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : EvidenceID  = ' + evidenceID);

            return request.execute('ORM.RCSA_GetScheduleAssessmentEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Output parameters value of ORM.INC_GetIncidentEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Input parameters value for ORM.INC_GetIncidentEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : userName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : EvidenceID  = ' + evidenceID); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Input parameters value for ORM.INC_GetIncidentEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : userName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : EvidenceID  = ' + evidenceID); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : downloadRCSAEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    /**
     * This function delete RCSA evidence data from database
     * @param {*} userIdFromToken 
     * @param {*} userNameFromToken
     * @param {*} data     
     * @returns 
     */
    async deleteRCSAEvidence(userIdFromToken, userNameFromToken, evidenceID) {
        logger.log('info', 'User Id : '+ userIdFromToken +' : ScheduleAssessmentDb : deleteRCSAEvidence : Execution started.');
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

            request.input('ScheduleAssessmentEvidenceID',         MSSQL.BigInt, evidenceID);
            request.input('UserName',           MSSQL.NVarChar, userNameFromToken);
            request.output('Success',           MSSQL.Bit);
            request.output('OutMessage',        MSSQL.NVarChar);

            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Input parameters value for ORM.INC_DeleteIncidentEvidence procedure.');
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : userName    = ' + userNameFromToken);
            logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : EvidenceID  = ' + evidenceID); 

            return request.execute('ORM.RCSA_DeleteScheduleAssessmentEvidence').then(function (result) {
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Output parameters value of ORM.INC_DeleteIncidentEvidence procedure.');
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : OutMessage    = ' + result.output.OutMessage);

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Input parameters value for ORM.INC_DeleteIncidentEvidence procedure.'); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : userName    = ' + userNameFromToken);
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : EvidenceID  = ' + evidenceID); 
                logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Input parameters value for ORM.INC_DeleteIncidentEvidence procedure.');
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : userName    = ' + userNameFromToken);
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : EvidenceID  = ' + evidenceID); 
            logger.log('error', 'User Id : ' + userIdFromToken + ' : ScheduleAssessmentDb : deleteRCSAEvidence : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    async getPreviousInherentRiskData(binds) {
        
        logger.log('info', 'User Id : '+ binds.userId +' : ScheduleAssessmentDb : getPreviousInherentRiskData : Execution started.');
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

            request.input('ScheduleInherentRiskID',    MSSQL.Int,     binds.id);
            request.input('CreatedBy',    MSSQL.NVarChar, binds.createdBy);		
            request.output('Success',    MSSQL.Bit);
            request.output('OutMessage', MSSQL.VarChar);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Input parameters value of ORM.RCSA_GetPreviousInherentRiskData procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : ScheduleInherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : CreatedBy    = ' + binds.createdBy);

            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData :  Parameters value are defined and ready to execute.');

            return request.execute('[ORM].RCSA_GetPreviousInherentRiskData').then(function (result) {

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Output parameters value of ORM.RCSA_GetPreviousInherentRiskData procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Success       = ' + result.output.Success);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : OutMessage    = ' + result.output.OutMessage);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : RecordSet    = ' + JSON.stringify(result.recordset));

                dbResponseObj.status           = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
                dbResponseObj.procedureSuccess = result.output.Success;
                dbResponseObj.procedureMessage = result.output.OutMessage;
                dbResponseObj.recordset        = result.recordsets;

                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Execution end.');

                return dbResponseObj;
            })
            .catch(function (error) {
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Input parameters value of ORM.getPreviousInherentRiskData procedure.');
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : ScheduleInherentRiskID    = ' + binds.id);
                logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : CreatedBy    = ' + binds.createdBy);

                logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Execution end. : Error details : ' + error);
                
                dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
                dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
                
                return dbResponseObj;
            });
        } catch (error) {
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Input parameters value of ORM.getPreviousInherentRiskData procedure.');
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : ScheduleInherentRiskID    = ' + binds.id);
            logger.log('info', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : CreatedBy    = ' + binds.createdBy);

            logger.log('error', 'User Id : ' + binds.userId + ' : ScheduleAssessmentDb : getPreviousInherentRiskData : Execution end. : Error details : ' + error);

            dbResponseObj.status   = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
            dbResponseObj.errorMsg = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;
            
            return dbResponseObj;
        }
    }

    stop() {
    }
}