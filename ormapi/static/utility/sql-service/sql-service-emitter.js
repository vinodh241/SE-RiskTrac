const EventEmitter          = require('events')
const MESSAGE_QUEUE_DB      = require('../../data-access/message-queue-db.js');
const CONSTANT_FILE_OBJ     = require('../constants/constant.js');
let messageQueue            = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
var messageQueueDBObject    = CONSTANT_FILE_OBJ.APP_CONSTANT.NULL;
 

class SQLServiceEmitter extends EventEmitter {
    constructor() {
        super();
        messageQueueDBObject = new MESSAGE_QUEUE_DB();
    }
    async messageFromQueue(options, callback) {
        try {
            const RESPONSE = await messageQueueDBObject.getMessageFromQueue(options, callback);
            if (RESPONSE) {
                const CONTEXT = this.createContext(RESPONSE);
                this.emit(CONTEXT.messageTypeName, CONTEXT);
                if (RESPONSE && RESPONSE.recordset) {
                    // notificationlogger.log('info', 'SQLServiceEmitter : messageFromQueue : ' + JSON.stringify(RESPONSE.recordset || null));
                    await callback(RESPONSE.recordset[CONSTANT_FILE_OBJ.APP_CONSTANT.ZERO])
                }
            }
        } catch (error) {
            notificationlogger.log('error', 'SQLServiceEmitter : messageFromQueue :' + error);
        }

    }

    // async getMissedEmailFromEmailAlerts() {
    //     return await this._dataAdapter.getMissedEmailFromEmailAlerts();
    // }

    async getIncidentOverDueRecommendation() {
        try {
            return await messageQueueDBObject.getIncidentOverDueRecommendation();
        } catch (error) {
            notificationlogger.log('error', 'SQLServiceEmitter : getMessageFromQueueIncident :' + error);
        }

    }

    async getOverDueCollection() {
        try {
            return await messageQueueDBObject.getOverDueCollection();
        } catch (error) {
            notificationlogger.log('error', 'SQLServiceEmitter : getMessageFromQueueRiskAppetite :' + error);
        }

    }

    async getKRIOverDueMetric() {
        try {
            return await messageQueueDBObject.getKRIOverDueMetric();
        } catch (error) {
            notificationlogger.log('error', 'SQLServiceEmitter : getMessageFromQueueKRI :' + error);
        }
    }

    async startKRINotifyReport() {
        try {
            return await messageQueueDBObject.startKRINotifyReport();
        } catch (error) {
            notificationlogger.log('error', 'SQLServiceEmitter : getMessageFromKRINotifyReport :' + error);
        }
    }

    async startUpdateReportingKRIReport() {
        try {
            return await messageQueueDBObject.startUpdateReportingFrequency();
        } catch (error) {
            notificationlogger.log('error', 'SQLServiceEmitter : startUpdateReportingKRIReport :' + error);
        }
    }
    
    async start(options = {}, callback) {
        this.messageFromQueue(options, callback);
    }
    
 
    createContext(response) {
        const {
            service_name: serviceName,
            conversation_handle: conversationId
        } = response

        return {
            conversationId,
            messageBody: response.EmailAlertsID,
            messageTypeName: response.message_type_name,
            messageSequenceNumber: response.message_sequence_number,
            serviceName,
        }
    }

    stop() {
    }
}
function getSQLServiceEmitterClassInstance() {
    if (messageQueue === null) {
        messageQueue = new SQLServiceEmitter();
    }
    return messageQueue;
}
module.exports = getSQLServiceEmitterClassInstance;
