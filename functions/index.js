// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
// var aws = require('aws-sdk');
// aws.config.update({
//   "accessKeyId": "AKIAJ6KEWRI6AS7MOZTA",
//   "secretAccessKey": "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",
//   "region": "us-east-1"
// });
// var ses = new aws.SES();


// exports.checkCaptcha = functions.https.onCall((data, context) => {
//   const captchas = [238456, 345356, 385294, 376943, 386367, 357485, 487539, 295732, 491233, 593853, 129444, 208833, 205330, 409233, 432788, 555678, 734129, 439455, 223666, 997543];
//   var incomingCode = parseInt(data.code.replace(/\s/g,''));
//   var codeToMatch = captchas[data.capNumber];
//   if (incomingCode === codeToMatch){
//     return {
//       match: true
//     }
//   } else {
//     return {
//       match: false
//     }
//   }
// });