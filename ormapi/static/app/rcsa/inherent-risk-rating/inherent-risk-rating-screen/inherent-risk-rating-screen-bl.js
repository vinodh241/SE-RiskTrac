const VALIDATOR_OBJECT      = require('validator');
const APP_VALIATOR          = require('../../../../utility/app-validator.js');
const MESSAGE_FILE_OBJ      = require('../../../../utility/message/message-constant.js');
const CONSTANT_FILE_OBJ     = require('../../../../utility/constants/constant.js');
const INHERENT_RISK_RATING_SCREEN_DB    = require('../../../../data-access/inherent-risk-rating-screen-db.js');

var appValidatorObject              = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var InherentRiskRatingScreenDbObject          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var InherentRiskRatingScreenBlClassInstance   = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

class InherentRiskRatingScreenBl {
    constructor() {
        appValidatorObject  = new APP_VALIATOR();
        InherentRiskRatingScreenDbObject = new INHERENT_RISK_RATING_SCREEN_DB();
    }

    start() {

    }

    /**
     * This function will fetch details of Inherent Risk Rating Screen from database server.
     * @param {*} request 
     * @param {*} response 
     * @returns 
     */
     async getDataForInherentRiskRatingScreen(request, response){
        var refreshedToken          = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userIdFromToken         = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
        var userNameFromToken       = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;

        try {
            const binds = {};
            refreshedToken      = request.body.refreshedToken;
            userIdFromToken     = request.body.userIdFromToken;
            userNameFromToken   = request.body.userNameFromToken;
            binds.createdBy = userIdFromToken || "";
            binds.userId = userIdFromToken;
            binds.userName = userNameFromToken; 
            binds.refreshedToken = refreshedToken;

            logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution started.');

            const result = await InherentRiskRatingScreenDbObject.getDataForInherentRiskRatingScreen(binds);
            
            //Merging all recordset and return as single recordset

            const resultResponse={
                RiskCategory:[],
                Process:[],
                InherentLikelihoodRating:[],
                InherentImpactRating:[],
                OverallInherentRiskScore:[],
                InherentRiskScoreConfig:[],
                OverallInherentRiskRating:[],
                InherentRiskRatingConfig:[] 
            }

            resultResponse.RiskCategory=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO];
            resultResponse.Process=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ONE];
            resultResponse.InherentLikelihoodRating=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.TWO];
            resultResponse.InherentImpactRating=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.THREE];
            resultResponse.OverallInherentRiskScore=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FOUR];
            resultResponse.InherentRiskScoreConfig=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.FIVE];
            resultResponse.OverallInherentRiskRating=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SIX];
            resultResponse.InherentRiskRatingConfig=result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.SEVEN];

            var resultArr=[];
            resultArr.push(resultResponse);

            result.recordset=JSON.parse(JSON.stringify(resultArr));

            //If undefined
            if(CONSTANT_FILE_OBJ.APP_CONSTANT.UNDEFINED == result || CONSTANT_FILE_OBJ.APP_CONSTANT.NULL == result){
                logger.log('error', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : result is undefined or null.');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if not success
            if (result.status != CONSTANT_FILE_OBJ.APP_CONSTANT.ONE) {
                logger.log('error', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Error details :' + result.errorMsg);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
            }

            //if proc failed
            if (result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.FALSE) {
                logger.log('error', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Error details : ' + result.procedureMessage);
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, result.procedureMessage));
            }

            // No Record found in database.
            if(result.status === CONSTANT_FILE_OBJ.APP_CONSTANT.ONE && result.procedureSuccess === CONSTANT_FILE_OBJ.APP_CONSTANT.TRUE && result.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO].length == CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : No Record in data base');
                return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.NO_RECORD_FOUND, result));
            }

            logger.log('info', 'User Id : '+ binds.userId +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Data fetched successfully.');
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(successfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA, result));   
        } catch (error) {
            logger.log('error', 'User Id : '+ userIdFromToken +' : InherentRiskRatingScreenBl : getDataForInherentRiskRatingScreen : Execution end. : Got unhandled error. : Error Detail : ' + error);
            return response.status(CONSTANT_FILE_OBJ.APP_CONSTANT.TWO_HUNDRED).json(unsuccessfulResponse(refreshedToken, MESSAGE_FILE_OBJ.MESSAGE_CONSTANT.GET_DATA_UNSUCCESSFUL));
        }
    }

    stop() {
    }
}

function validateAndReturnData(response, result, userId, refreshedToken, methodName ){

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
    result.recordset=result.recordset[0];
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
 * This is function will be used to return single instance of class.
 */
function getInherentRiskRatingScreenBLClassInstance() {
    if (InherentRiskRatingScreenBlClassInstance === CONSTANT_FILE_OBJ.APP_CONSTANT.NULL) {
        InherentRiskRatingScreenBlClassInstance = new InherentRiskRatingScreenBl();
    }
    return InherentRiskRatingScreenBlClassInstance;
}

exports.getInherentRiskRatingScreenBLClassInstance = getInherentRiskRatingScreenBLClassInstance;