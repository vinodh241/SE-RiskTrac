const MSSQL               = require("mssql");
const CONSTANT_FILE_OBJ   = require("../../utility/constants/constant.js");
const MESSAGE_FILE_OBJ    = require("../../utility/message/message-constant.js");

module.exports = class VendorDb {
  constructor() {}

  start() {}

  

  /**
   * This function will fetch vendor master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getVendorDetails(userIdFromToken, userNameFromToken,data) {
    logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status            : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess  : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName",     MSSQL.NVarChar,     userNameFromToken);
      request.output("Success",     MSSQL.Bit);
      request.output("OutMessage",  MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Input parameters value for [BCM].[Vendors_GetVendorMaster] procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : UserName       = " + userNameFromToken);

      return request.execute("[BCM].[Vendors_GetVendorMaster]").then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Output parameters value of [BCM].[Vendors_GetVendorMaster] procedure.");
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Success       = " + result.output.Success );
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : OutMessage    = " + result.output.OutMessage );

          dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess  = result.output.Success;
          dbResponseObj.procedureMessage  = result.output.OutMessage;
          dbResponseObj.recordset         = result.recordsets;

          logger.log( "info", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Execution end." );

          return dbResponseObj;
        }).catch(function (error) {
          logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Input parameters value for [BCM].[Vendors_GetVendorMaster] procedure." );
          logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : UserName       = " + userNameFromToken );
          logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Execution end. : Error details : " + error );

          dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Input parameters value for [BCM].[Vendors_GetVendorMaster] procedure." );
      logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : UserName       = " + userNameFromToken );
      logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getVendorDetails : Execution end. : Error details : " + error );

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch add master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async addVendorMaster(userIdFromToken, userNameFromToken,data) {
    logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status            : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess  : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);
      request.input("VendorID",     MSSQL.BigInt,     data.VendorID);
      request.input("VendorName",   MSSQL.NVarChar,   data.VendorName);
      request.input("SupportTeams", MSSQL.NVarChar,   JSON.stringify(data.SupportTeams));
      request.input("UserName",     MSSQL.NVarChar,   userNameFromToken);
      request.output("Success",     MSSQL.Bit);
      request.output("OutMessage",  MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Input parameters value for [BCM].[Vendors_AddVendorMaster] procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : data           = " + JSON.stringify(data));

      return request.execute("[BCM].[Vendors_AddVendorMaster]").then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Output parameters value of  [BCM].[Vendors_AddVendorMaster]  procedure.");
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Success       = " + result.output.Success );
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : OutMessage    = " + result.output.OutMessage );

          dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess  = result.output.Success;
          dbResponseObj.procedureMessage  = result.output.OutMessage;
          dbResponseObj.recordset         = result.recordsets;

          logger.log( "info", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Execution end." );

          return dbResponseObj;
        }).catch(function (error) {
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Input parameters value for  [BCM].[Vendors_AddVendorMaster] procedure." );
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : UserName       = " + userNameFromToken );
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : data           = " + JSON.stringify(data));
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Execution end. : Error details : " + error );

          dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Input parameters value for  [BCM].[Vendors_AddVendorMaster] procedure." );
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : UserName       = " + userNameFromToken );
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : data           = " + JSON.stringify(data));
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : addVendorMaster : Execution end. : Error details : " + error );

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }
  
  /**
   * This function will fetch vendor master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async getApplicationSupportDetails(userIdFromToken, userNameFromToken) {
    logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status            : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess  : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);

      request.input("UserName",     MSSQL.NVarChar,     userNameFromToken);
      request.output("Success",     MSSQL.Bit);
      request.output("OutMessage",  MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Input parameters value for    procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : UserName       = " + userNameFromToken);

      return request.execute("[BCM].[Vendors_GetApplicationsInfo]").then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Output parameters value of    procedure.");
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Success       = " + result.output.Success );
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : OutMessage    = " + result.output.OutMessage );

          dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess  = result.output.Success;
          dbResponseObj.procedureMessage  = result.output.OutMessage;
          dbResponseObj.recordset         = result.recordsets;

          logger.log( "info", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Execution end." );

          return dbResponseObj;
        }).catch(function (error) {
          logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
          logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : UserName       = " + userNameFromToken );
          logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Execution end. : Error details : " + error );

          dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Input parameters value for ORM.KRI_GetKRIReportData procedure." );
      logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : UserName       = " + userNameFromToken );
      logger.log( "error", "User Id : " + userIdFromToken + " : VendorDb : getApplicationSupportDetails : Execution end. : Error details : " + error );

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  /**
   * This function will fetch update master data from database
   * @param {*} userIdFromToken
   * @param {*} userNameFromToken
   * @returns
   */
  async updateVendorMaster(userIdFromToken, userNameFromToken,data) {
    logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Execution started.");
    /**
     *   dbResponseObj.status values
     *   1 - Successful operation
     *   0 - Error while connecting database
     *   2 - Error while executing procedure
     */
    var dbResponseObj = {
      status            : CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO,
      recordset         : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      errorMsg          : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
      procedureSuccess  : CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE,
      procedureMessage  : CONSTANT_FILE_OBJ.APP_CONSTANT.NULL,
    };

    try {
      // Fetching poolConnectionObject from global object of application
      var request = new MSSQL.Request(poolConnectionObject);
      request.input("VendorID",     MSSQL.BigInt,     data.VendorID);
      request.input("VendorName",   MSSQL.NVarChar,   data.VendorName);
      request.input("SupportTeams", MSSQL.NVarChar,   JSON.stringify(data.SupportTeams));
      request.input("UserName",     MSSQL.NVarChar,   userNameFromToken);
      request.output("Success",     MSSQL.Bit);
      request.output("OutMessage",  MSSQL.VarChar);

      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Input parameters value for [BCM].[Vendors_AddVendorMaster] procedure.");
      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : UserName       = " + userNameFromToken);
      logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : data           = " + JSON.stringify(data));

      return request.execute("[BCM].[Vendors_AddVendorMaster]").then(function (result) {
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Output parameters value of  [BCM].[Vendors_AddVendorMaster]  procedure.");
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Success       = " + result.output.Success );
          logger.log("info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : OutMessage    = " + result.output.OutMessage );

          dbResponseObj.status            = CONSTANT_FILE_OBJ.APP_CONSTANT.ONE;
          dbResponseObj.procedureSuccess  = result.output.Success;
          dbResponseObj.procedureMessage  = result.output.OutMessage;
          dbResponseObj.recordset         = result.recordsets;

          logger.log( "info", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Execution end." );

          return dbResponseObj;
        }).catch(function (error) {
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Input parameters value for  [BCM].[Vendors_AddVendorMaster] procedure." );
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : UserName       = " + userNameFromToken );
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : data           = " + JSON.stringify(data));
          logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Execution end. : Error details : " + error );

          dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.TWO;
          dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.PROCEDURE_EXECUTION_ERROR;
          return dbResponseObj;
        });
    } catch (error) {
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Input parameters value for  [BCM].[Vendors_AddVendorMaster] procedure." );
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : UserName       = " + userNameFromToken );
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : data           = " + JSON.stringify(data));
      logger.log("error", "User Id : " + userIdFromToken + " : VendorDb : updateVendorMaster : Execution end. : Error details : " + error );

      dbResponseObj.status      = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
      dbResponseObj.errorMsg    = MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.UNHANDLED_ERROR_DB_LAYER;

      return dbResponseObj;
    }
  }

  stop() {}
};
