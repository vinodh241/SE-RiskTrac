const CONSTANT_FILE_OBJ = require("./constants/constant.js");
const ENUMS_OBJ         = require("./enums/enums.js");
const APP_CONFIG        = require("../config/app-config.js")


module.exports = class ComputationsUtility {
    constructor() {
    }


     /**
     * This function will calculate risk rating       
     * @param {*} userIdFromToken
     * @param {*} likelihoodID 
     * @param {*} impactID 
     */
    async calcutateRiskRating(userIdFromToken,likelihoodID,impactID,riskRanges){
        let overAllRating = CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO;
        let overAllRiskRating = [];
        try{
            logger.log('info', 'User Id : '+ userIdFromToken +' : ComputationsUtility : calcutateRiskRating : Execution Started ');

            let formula = APP_CONFIG.COMPUTATIONAL_FORMULA.RISK_RATING_FORMULA;

            overAllRating = eval(formula);

            if(overAllRating > CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO){
                overAllRiskRating = await this.getRiskRating(userIdFromToken,overAllRating,riskRanges);
            }

            logger.log('info', 'User Id : '+ userIdFromToken +' : ComputationsUtility : calcutateRiskRating : Execution End ');
            return overAllRiskRating;

        }catch(error){
            logger.log('error', 'User Id : '+ userIdFromToken +' : ComputationsUtility : calcutateRiskRating : Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        }
    }

    async getRiskRating(userIdFromToken,currentriskrating,riskRanges){
        let riskRating = []

        try{
            logger.log('info', 'User Id : '+ userIdFromToken +' : ComputationsUtility : getRiskRating : Execution Started ');

            riskRanges.forEach(ele => {
                if (ele.Computation.includes('&')) {
                    let data = ele.Computation.split('&');
                    let min = `${currentriskrating}${data[0]}`;
                    let max = `${currentriskrating}${data[1]}`;
                        if (eval(min) && eval(max) ) {
                            riskRating.push(ele);
                        }
                } else {
                    let val = `${currentriskrating}${ele.Computation}`;
                    if (eval(val)) {
                        riskRating.push(ele);
                    }
                }
            });
            return riskRating;

        }catch(error){
            logger.log('error', 'User Id : '+ userIdFromToken +' : ComputationsUtility : getRiskRating : Execution End ' + error);
            return CONSTANT_FILE_OBJ.APP_CONSTANT.NULL; 
        }
    }

}




