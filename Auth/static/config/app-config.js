const PATH_OBJ = require('path');


/**
 * Application server related configurations variable.
 */
const APP_SERVER = {
    /**
     * This variable is use for to identify deployed environment, for select MO Application URL
     * Value will as below:
     * PROD         - PROD for Production environment
     * PRE_PROD     - PRE_PROD for Pre-Production (SIT) environment
     * UAT          - UAT for UAT environment
     * QA           - QA for QA environment
     * DEV          - DEV for DEV environment
     */
    ENVIRONMENT_NAME        : "DEV",
    APP_START_PORT          : 6001,         // Port for API server run on
    APP_AUTHENTICATION_MODE : 1,             /**
                                                Values for APP_AUTHENTICATION_MODE
                                                1 - AD (Active Directory) Authentication,
                                                2 - ADFS (Active Directory Federation Services) Authentication, (Not suppoerted right now)
                                                3 - Application Authentication, (Not suppoerted right now)
                                             */
    APP_ADMIN_USER_NAME     : "",
    APP_ADMIN_PASSWORD      : "",
    PATH                    : PATH_OBJ.join(__dirname, '../'),
    ALLOWED_ORIGINS         : ["https://serisktrac.secureyes.net","http://localhost:46004","http://localhost:46002"]      // Alowed origins list, else we will get CORS policy error.
};

/**
 * Application security related configurations variable.
 */
const APP_SECURITY = {
    LOGIN_PAGE_EXPIRE_TIME_SECONDS   : 120,          // Login page expiration time in seconds
    ENCRYPTION_SEPARATOR             : "--",        // Encryption separtor will get use in encryption and decryption to separate two or more then two string.
    WRONG_LOGIN_ATTEMPT_NUMBER       : 3,           // Number of wrong login attempts by user.
    USER_ACCOUNT_LOCK_TIME_IN_MIN    : 60           // Account lock time in minutes once wrong login attempts number exceeded.
};

/**
 * JWT token related configurations variable.
 */
const JWT_TOKEN = {
    TOKEN_EXPIRY_TIME_IN_MINUTES          : 120,                // JWT token expiry time (In minutes).
    TOKEN_USES_NOT_BEFORE_IN_MILLISECONDS : 2000                // JWT token uses not before (In Milliseconds), Means after token creation, we can not use token verification for define time. It is to prevent robotic access of application.
};

/**
 * Application log related configurations variable.
 */
const LOG_CONFIG = {
    FILE_SIZE           : 5,                // Maximum size of log file in MB (Megabyte). After that new file will get created for same day.
    ERROR_LOG_FILE_NAME : "error_log",      // Application error log file name.
    
    /**
     * Configure log level, LOG_LEVEL value is
     * info     : Then error log file will have info and error messages
     * error    : Then error log file will have only error messages
     * 
     * For UAT and Production we do not required to write other then error messages 
     */
    LOG_LEVEL   : "info"
};

/**
*  Exporting contains of file
*/
module.exports = {
    APP_SERVER          : APP_SERVER,
    APP_SECURITY        : APP_SECURITY,
    JWT_TOKEN           : JWT_TOKEN,
    LOG_CONFIG          : LOG_CONFIG
};