/**
 * environment Name Value can be
 * QA   = For Secureyes domain
 * PROD = For Production domain
 */
const ENVIRONMENT_NAME = {
  envName : "QA"
}


/**
 * Email config for QA env
 */
const QA_MAIL_CONFIG = {
  host    : "smtp.office365.com",
  port    : 587,
  secure  : false,
  auth  : {
            user  : "risktrac@secureyes.net",
            pass  : "JLUORLMWhI9NKjycTzpU2Pk+Dyfze7b82tzRgriCjIyjRN/sm1NA6/vKwqLf8EF0rdprbfAzdwo+KNrS6/OYVWQQlPJUb9ZWCN6JlsVh2No+2HCPpnkaMVE7d5I4BAepuxD/v7zJOgMlKOnTib+Paph2ERr8BsTRP1Djob4MOnOdCzmNZuwAN/pxwVssRPhAo9Uew7edqcmjQmyk/IQ2p832IlJJaG3Lo0KzKLFsWdVW0NeuBBPAZt66O8U5oX6AxflQfYG5tdG3XJIOflQQpjBa6qTrc7v8RqkQqEhnw0AiPE/CRd/esCRbH8zDxqW+GU670FePXLnx8X5kZsUbwSNrdwThg/z5irh2Gm8XIzhKwSr6XpLON19V6JFQLGJHBw8t8JCBsZfxIHuyzox/I/cOYHBTCx23lKLh3dluMBHq0kiegf/i9bgMk6SJr3jlQukMJrC4NCMZ5pJO3tkrgzBRsoD6UClFkormJsNwCBh6YbWTXhhKPFpj8FAXnJ8D6gSC+zA/lgzLEhz1QXva/sylCb2Dzr1Uld0ujN6TsfaCBACBH7DeuVdUUQBrRuK4lbzYVwJHO+fIxDa+/WmkQCAkiz9YZtkg5nnr1IblB1PjjPgK1KbkGtZ8oDAIxWKIdt50Dl2Frgis6phhPAA1eGTxD9Z6ZMrOnUxyvZ2h8xM="
            
  }
};

const QA_SENDER_CONFIG = {
  senderEmail : "risktrac@secureyes.net",
  senderName  : "RiskTrac"
}

/**
 * Email config for QA env
 */
const PROD_MAIL_CONFIG = {
  host    : "mail.amlakint-dev.com",
  port    : 465,
  secure  : true,
  auth  : {
            user  : "opssecureyesalert@amlakint-dev.com",           
            pass  : "lNdwNMBClFL4E4XVDTCxTgU/eAql/V9lWi2PIg2AKguL198cy9594Dc6Pav97vLVE5/eHijoQk82gm9mMTCN1Kg6v1GANR4CN+4dzsjDgW63sGEEN6kwttpobCE6PF0BzE3ahaeT87gMWZaGBEmUWMGO5bBWD6NuSKoQYh6qskbTETvplqG0cpnxqoTNQC+bW7CmvNcCu4EUoRJCCGT/4ixttMAWoh1jAUt4KU+5b8oFhtP2nS2rZd6AN+hlusFyXgwNAYMhIkLvNChIjB/7DLcm69soCNXykyqcoO17QUa5G0GUeoRHT8z360dgLO9LlGSb6RgWFm91kK1IUhbGnqJuOccSr0EPnp1fiOkpFajLXgxeyH7+VD39Ms4IRZV1MZomQ7zaZBQ8PTtoNA+AguvSZz5OMCL2t1u1z23sYb0YdGoRAYxqkjjRzBXBaT1nUp6pQUaUa0ttviYdaHeekF6q6mzh3RZn0Gd1sSs8gxqklapLYAh3iQgvzg1Ru8zL3K8ndsrc/on48phz6YtRBwgA2tabV+Ewe9tiSUcwvNzyBoumvsMJePxWXFsUvvOiiFokZQJ6d61VUyskbRY2Oz1IyNgWiiY+NJpWa09NgWycFbkWj0bai6T8cZZVyP3iCNTobmqYLzIdsQOQrnftaROzoCYLetTT4qOnszE3nGc="
  }
};

const PROD_SENDER_CONFIG = {
  senderEmail : "opssecureyesalert@amlakint-dev.com",
  senderName  : "RiskTrac"
}

/**
*  Exporting contains of file
*/
module.exports = {
  QA_MAIL_CONFIG      : QA_MAIL_CONFIG,  
  QA_SENDER_CONFIG    : QA_SENDER_CONFIG,
  PROD_MAIL_CONFIG    : PROD_MAIL_CONFIG,  
  PROD_SENDER_CONFIG  : PROD_SENDER_CONFIG,
  ENVIRONMENT_NAME    : ENVIRONMENT_NAME
};