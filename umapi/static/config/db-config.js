let DB_CONFIG = {
  /**
   * Below configuration is for SQL Server Authentication to connect MSSQL data base sever 
   */
  /** Below configuration parameters for development environment. */
    user                : 'sqldev',                       // User name to use for authentication
    password            : "vwlGuDUwk5yfxw6XKrl0tx5uRQMkaewuUfwZSuKYmPr7QUj1SeeE6+6WEY1EDbtDf8O3FTbkzsNTKDiQjUddX035YASOo6M29EQjMnQuKapNuSfpJzNA4MNNmHF6tt3190GJsIU2Xma3IXmZHa3dsSbkxrUAJnh2CHnYagRRuUKqmqStsSrU6dDFiqPG8+L3MsxvjctX/Q0a8i0pae+/AVcpdGeKourWwFPGOmNqEdscY5sxsZ/AxkUAKDgK9AfuODfe+ottdkBinrgtS1PbLOtwEtYNdymrLQKgf3GHffebZRJEYEZmBP8Ubewy3BLpw9m4BO4POzxdPJXTJrdCupi9d9AAAnQ+cPOzyGdnHX51abAz7LDyiOtRas599BzZOIFm7PBv0LaFzSXgS9ImTfR2j3dzNQKrkQoDY8RwIE+MQU2f9s7o96j2UWGrlTirJw0SNB8fMsgHlJG6hbzupS+nNiHNDJpE9ZLdZSUDLG7dOcBOn7wlMnxA0E9jmsxkjHz2BHG6u8kAP5YxvFw9AA+zxDCOs4oQizunzaMktxoQ7znhv8XqAXInvD40QaA+Gj65ujAgHY2wK0APD05/axQGVe5I9yAB2rO1Plvlx9cmzosmx6eVaCA7BveYQpduc65bXrKRxBGeuZXy9gYoFDO+W3NnlBwnIoACWiNKBQY=",
    server              : '10.0.1.22',                     // Private IP of Dev DB
    port                : 1433,                           // Port to connect to Dev DB

  /** Below configuration parameters for QA environment. */
    // user                : 'sqlqa',                       // User name to use for authentication
    // password            : "HYBEhxTLAtVDQP88TcjaJ65bjiL+nOhfsKi2/IwF/f2lkjHNgjfAQExP28lACS+c9u8imV9XnFlxFNNyBgxJFqCLtTIMUEt7T2o6Rxtv4U/9XA+PcqULPBBut53sv+JUpl3LBLCTzUVXEt+tOy8WdYChEkND8dYQrKN1Ho9r+hsc8Ykeg1QA7DsC1wWLo8Yqoj90KeqDigxoS1MZPSb2DC+gKiIudC/fh1Umtmha32RQMvMLUq7xeN1yWkHhHonR8XTuoLjdA12OzvfJHprWVqkEstbaOD0c1C0z/GnTykChJ5n4fnJTJM9GXPZtQrMi09qDkBhtS1nMfdQMYezuZh+DvL37A9Ib/gA1e+7hleBnICpUMaj/+rKCb9lfVlNhvRyVWBDgH/zMAxOo/x81Cwob9sI1i0wDqlquR1jfFRA3j8wHu0fUHRv7bkRJUsbtVHiN9yInoNd/NFqkjpmVLB8HP9NZdTSV9zu5ilykQPaqCL1IJ+cyXfzxWrWK2xVqtkfPaAOAHsGLf6A4fh1fas8sU4C2gBFd4JcboNjqdQxEyjTLEPPwC/3vCRK7qQK+Zkep2R3BJZYp6KuMA0ToGwerkXpuqr4s1TF/UCrcvp43NY1ZJK2dhaxB3XK9JGfoa9/m5dqVSfdlJdNOxoDaka+GbMuyzw+TxIjgfiIQGSE=",
    // server              : '10.0.1.9',                     // Private IP of QA DB
    // port                : 1533,                           // Port to connect to QA DB

  // Common configuration parameters
    database            : 'AMLAK',                        // Database to connect to
    connectionTimeout   : 30000,                          // Connection time out in ms (default: 15000). Time to wait while trying to establish a connection before terminating the attempt and generating an error.
    requestTimeout      : 0,                              // Request time out in ms (default: 15000). Maximum time to complete SQL operation else generating an error of request time out.
    options             : {encrypt: true},                // Encryption for data encryption which will travel on network, App server to DB server
    pool                : {                               // Pooling options
                            max               : 200,      // The maximum number of connections there can be in the pool
                            min               : 50,       // The minimum of connections there can be in the pool
                            idleTimeoutMillis : 30000     // The Number of milliseconds before closing an unused connection
                          }
  };
  module.exports = DB_CONFIG;