const MESSAGE_CONSTANT = {
   /** If user requested unauthorized API, (User Role basis) */
   UNAUTHORIZED_ACCESS                          : "Unauthorized access.",

   /** If token in request does not match with data base token. */
   INVALID_SESSION                              : "Invalid session, please re-login.",

   /** Token is null in request.Or Request body is undefined */ 
   INVALID_REQUEST                              : "Invalid request, missing mandatory parameters.",

   /** Unable to read or parse the request */
   INCORRECT_REQUEST                            : "Invalid request.",

   /** Page time out, (Page expired) */
   PAGE_EXPIRED                                 : "Webpage has expired, kindly refresh the page.",

   /** Username is null in request body or User name is empty in request body*/
   USER_NAME_NULL_EMPTY                         : "User id cannot be left blank.",

   /** Password is null in request body Or Password is empty in request body*/
   PASSWORD_NULL_EMPTY                          : "Password cannot be left blank.",

   /** Unable to update DB table */
   UNABLE_UPDATE_DB                             : "Unable to update the database, please try again.",

   /** Unbale to fetch from data base. */
   NO_RECORD_FOUND                              : "No records.",

   /** User name or password is incorrect */
   WRONG_CREDENTIALS                            : "Invalid credentials, please try again with valid credentials.",

   /** AD Server unreachable */
   AD_SERVER_UNREACHABLE                        : "AD server is unreachable, please try again or contact the administrator.",

   /** Unbale to read user id or other data from token. */
   TOKEN_INVALID                                : "Invalid token, please Re-Login.",

   /** Token expired or malformed token or other token issue. */
   TOKEN_EXPIRED                                : "Session expired, please Re-Login.",

   /** Token refreshed successfully. */
   TOKEN_REFRESHED                              : "Token refreshed successfully.",

   /** Unable to connect AD server. */
   NETWORK_ERROR                                : "Network error, please try again after some time or contact the administrator.",

   /** User is not existing into AD server. */
   USER_NOT_EXISTING_IN_AD                      : "User does not exist, please try again with a valid user.",

   /** User exist into AD server, but not belonging any group of AD server. */
   USER_NOT_EXISTING_IN_AD_GROUP                : "User cannot be added as it does not belong to any AD group.",

   /** User is not belonging to application's allowed group list. */
   USER_NOT_EXISTING_APP_ALLOWED_GROUP          : "User cannot be added as it does not belong to the application's allowed group.",

   /** Login successful */
   LOGIN_SUCCESS                                : "Login successful.",

   /** Login unsuccessful  */
   LOGIN_UNSUCCESS                              : "Unable to login, Please try again.",

   /** Logout successful*/
   LOGOUT_SUCCESS                               : "Logout successful.",

   /** Logout unsuccessful*/
   LOGOUT_FAIL                                  : "Logout unsuccessful.",

   /** Unable to fetch user id by user name from DB. Means user does not exist in the DB. */
   USER_NOT_EXISTING_IN_DB                      : "User is not authorized to use the application.",

   /** Successful on get key api */
   GET_KEY                                      : "Get public key successfully.",

   /** Error on get key api */
   GET_KEY_FAIL                                 : "Get public key unsuccessfull.",

   /** Fetched data successfully from DB */
   GET_DATA                                     : "Data fetch from DB successful.",
   GET_DATA_SUCCESSFUL                          : "Data fetched successfully.",

   /** Fetched data unsuccessfully from DB */
   GET_DATA_UNSUCCESSFUL                        : "Unable to fetch data from database.",

   /** Data added successfully into data base */
   ADDED_DATA                                   : "Added successfully.",

   /** Data added unsuccessful into data base */
   ADD_DATA_UNSUCCESSFUL                        : "Unable to add data.",

   /** Data deleted successfully into data base */
   DELETE_DATA                                  : "Deleted successfully.",

   /** Data delete unsuccessful into data base */
   DELETE_DATA_UNSUCCESSFUL                     : "Unable to delete data.",

   /** Update successfully */
   UPDATED_DATA                                 : "Saved successfully.",

   /** Update unsuccessful */
   UPDATED_DATA_UNSUCCESSFUL                    : "Unable to save data.",

   /** Update unsuccessful */
   PROCEDURE_EXECUTION_ERROR                    : "Error on procedure execution.",

   /** Update unsuccessful */
   UNHANDLED_ERROR_DB_LAYER                     : "Got unhandled exception in DB layer.",

   /**User exist in DB */
   USER_ALREADY_EXISTS                           : "User already exists",
   
   /** AD user name is null or empty*/
   AD_USER_NAME_NULL_EMPTY                      : "AD user name cannot be left blank.",

   /** AD user name is not valid format*/
   AD_USER_NAME_INVALID                         : "AD user name is not valid. it should be like foo@bar.com",

   /** Modules details are missing*/
   MODULES_MISSING                              : "Modules details are missing",

   /** Groups Units details are missing*/
   GROUPS_UNITS_MISSING                         : "Groups Units details are missing",

   /** Account GUID is null or empty*/
   ACCOUNT_GUID_NULL_EMPTY                      : "accountGUID is undefined or null or empty.",

   /** User GUID is null or empty*/
   USER_GUID_NULL_EMPTY                         : "userGUID is undefined or null or empty.",

   /** Is user manger is null or empty*/
   IS_USER_MANAGER_NULL_EMPTY                   : "Is User Manager can not unselected.",

   /**User exist in DB */
   EMAIL_ID_ALREADY_EXISTS                      : "EmailID already exists",

   /**User exist in DB */
   MOBILE_NUMBER_ALREADY_EXISTS                 : "Mobile Number already exists",

   /** AD user name is not valid format*/
   EMAIL_ID_INVALID                             : "EmailID is not valid. it should be like foo@bar.com",

   /** AD user name is not valid format*/
   MOBILE_NUMBER_INVALID                        : "Mobile number is not valid. it should be only 10-digit numeric ",

   /** Account Subscription has been expired */
   SUBSCRIPTION_EXPIRED                         : "Account subscription has been expired",

}

module.exports = {
   MESSAGE_CONSTANT: MESSAGE_CONSTANT,
};