const EXPRESS                       = require('express');
const APP                           = EXPRESS();
const BODY_PARSER                   = require('body-parser');
const CORS                          = require('cors');
const COOKIE_PARSER                 = require('cookie-parser');
const FILE_UPLOAD                   = require('express-fileupload');
const HELMET 						= require('helmet');
const NO_CACHE 						= require('nocache');
const APP_CONFIG_FILE_OBJECT        = require('./config/app-config.js');
const SYSTEM_CONFIG                 = require('./config/system-config.json');
const LOG_MANAGER_FILE_OBJECT       = require('./utility/log-manager/log-manager.js');
const CONSTANT_FILE_OBJECT          = require('./utility/constants/constant.js');
const ALLOWED_ORIGINS               = APP_CONFIG_FILE_OBJECT.APP_SERVER.ALLOWED_ORIGINS;

/**
 * This will abolish all client-side caching
 */
APP.use(NO_CACHE());

/**
 * Allowing X-Frames from same origin only
 */
APP.use(HELMET.frameguard({ action: CONSTANT_FILE_OBJECT.APP_CONSTANT.DENY }));

/**
 * Disabling X-Powered-By header to hide app running Express
 */
APP.disable('x-powered-by');
 

APP.use(BODY_PARSER.urlencoded({limit: '512mb', extended: true}));
APP.use(BODY_PARSER.json({limit: '512mb', extended: true}));

/**
 * App will use cors
 */
// APP.use(CORS({origin : CONSTANT_FILE_OBJECT.APP_CONSTANT.TRUE, exposedHeaders : ['token','status', 'OriginalFileName', 'FileName']}));
APP.use(CORS({
    origin          : function(origin, callback) {
                        // allow requests with no origin
                        // (like mobile apps or curl requests)
                        if (!origin) return callback(CONSTANT_FILE_OBJECT.APP_CONSTANT.NULL, CONSTANT_FILE_OBJECT.APP_CONSTANT.TRUE);
                        if (ALLOWED_ORIGINS.indexOf(origin) === CONSTANT_FILE_OBJECT.APP_CONSTANT.MINUS_ONE) {
                            let message = 'The CORS policy for RiskTrac site does not allow access from the specified Origin. : Origin : '+origin;
                            return callback(new Error(message), CONSTANT_FILE_OBJECT.APP_CONSTANT.FALSE);
                        }
                        return callback(CONSTANT_FILE_OBJECT.APP_CONSTANT.NULL, CONSTANT_FILE_OBJECT.APP_CONSTANT.TRUE);
                    },
    credentials     : CONSTANT_FILE_OBJECT.APP_CONSTANT.TRUE,
    exposedHeaders : ['token','status', 'OriginalFileName', 'FileType','ErrorMessage'],
    methods         : ['GET','POST','HEAD']
}));

/**
 * App will use cookie parser
 */
APP.use(COOKIE_PARSER());

/**
 * Node server is running on port no. "appPortNo"
 */
var appPortNo   = APP_CONFIG_FILE_OBJECT.APP_SERVER.APP_START_PORT;
appPortNo       = (appPortNo == CONSTANT_FILE_OBJECT.APP_CONSTANT.NULL || appPortNo == CONSTANT_FILE_OBJECT.APP_CONSTANT.UNDEFINED ) ? CONSTANT_FILE_OBJECT.APP_CONSTANT.DEFAULT_PORT : appPortNo;

 
/**
 *  
 */
 APP.listen(appPortNo, async function() {
    /**
     * Fetching looger object and setting in global variable :: Start
     */
    try {
        global.logger = await LOG_MANAGER_FILE_OBJECT.logger;
        logger.log('info', 'Logger initialized......');
        // console.log("Logger initialized......");
    } catch (error) {
        // console.log('appIndex.js : Logger is not set into global object. Error details : '+error.stack);
        logger.log('error', 'appIndex.js : Logger is not set into global object. Error details : '+error);
        process.exit(CONSTANT_FILE_OBJECT.APP_CONSTANT.ZERO);
    }

    console.log('App is listening on port : '+appPortNo);
    logger.log('info', 'App is listening on port : '+appPortNo);
    
    /**
     * Fetching looger object and setting in global variable :: End
     */
    // console.log('App is listening on port : '+appPortNo);
    logger.log('info', 'App is listening on port : '+appPortNo);
    APP.set("moduleConfig", SYSTEM_CONFIG);
    initializeModules();

    /**
     * Connecting to database by connection pooling logic :: Start
     */
    try {
        var { poolConnectionObject } = require('./utility/db-connection/db-connection.js');
        // Setting pool connection object in global variable
        global.poolConnectionObject = await poolConnectionObject;
    } catch (error) {
        // console.log('appIndex.js : Error from appIndex.js : Data Base is not connected : Error details : '+error.stack);
        logger.log('error', 'appIndex.js : Error from appIndex.js : Data Base is not connected : Error details : '+error);
        process.exit(CONSTANT_FILE_OBJECT.APP_CONSTANT.ZERO);
    }
 
});

/**
 * Initializing module request handler (router) class
 */
function initializeModules() {
    try {
        let moduleConfigObj = APP.get('moduleConfig');
        logger.log('info', 'Application modules loading.......');
        for(let key in moduleConfigObj['APP_MODULES']) {            
            let appModules      = require(moduleConfigObj['APP_MODULES'][key]);
            let modulesInstance = appModules.getInstance(APP);
            modulesInstance.start();
            logger.log('info', key+' loaded.');
            // console.log(key+' loaded.');
        }
    } catch (error) {
        // console.log('appIndex.js : Error from appIndex.js : Modules not intialized : Error details : '+error.stack);
        logger.log('error', 'appIndex.js : Error from appIndex.js : Modules not intialized : Error details : '+error);
        process.exit(CONSTANT_FILE_OBJECT.APP_CONSTANT.ZERO);
    }
}