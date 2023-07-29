
var convertedText ="";                            // Setup a global var for translated text
var botResponse = "";                             // Setup a global var for response from Open AIs API
let guidKey = "guid"                              //create a var for session key
sessionStorage.setItem(guidKey, 'not found');     //set the session key value


var langChange = function(){
  sessionStorage.setItem(guidKey, 'not found');   //reset the guid to not found (means the previous chat is not in context)
  alert("Please start the conversation again!");  //show an alert
}

var speechToText = function(){
  
  var startRecognizeOnceAsyncButton;

  // subscription key and region for speech services.
  var subscriptionKey, serviceRegion, languageTargetOptions, languageSourceOptions;
  var SpeechSDK;
  var recognizer;

  languageTargetOptions = "en";
  languageSourceOptions =  document.getElementById("languageSourceOptions"); //"ar-QA";

  document.addEventListener("DOMContentLoaded", function () {
    startRecognizeOnceAsyncButton = document.getElementById("startRecognizeOnceAsyncButton");
    subscriptionKey = "f2ba37af57ab4eb295c77a0d1947ce51";
    serviceRegion = "eastus"; 
    
    startRecognizeOnceAsyncButton.addEventListener("click", function () {
      startRecognizeOnceAsyncButton.disabled = true;
      
      var speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(subscriptionKey, serviceRegion);

      speechConfig.speechRecognitionLanguage = languageSourceOptions.value;
      let language = languageTargetOptions
      speechConfig.addTargetLanguage(language)

      var audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync(
        function (result) {
          startRecognizeOnceAsyncButton.disabled = false;
          if (result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
            let translation = result.translations.get(language);
            window.console.log(translation);
            convertedText = translation;
            let guid = sessionStorage.getItem(guidKey);
            botResponse = askBot_withHistory(convertedText,languageSourceOptions.value,guid) //askBot(convertedText,languageSourceOptions.value)
          }

          recognizer.close();
          recognizer = undefined;
        },
        function (err) {
          startRecognizeOnceAsyncButton.disabled = false;
          window.console.log(err);
          recognizer.close();
          recognizer = undefined;
        });
    });

    if (!!window.SpeechSDK) {
      SpeechSDK = window.SpeechSDK;
      startRecognizeOnceAsyncButton.disabled = false;
    }
  });
}



///// This function gets the reponse from backend - ////////////////////
  ////// The response is based on the context of chat ////////////////////
var askBot_withHistory = function(convertedText,lang,guid){
  console.log(guid);
  var res = "";
  $.ajax({
    type:"POST",
    url:"/speech_withHistory",
    data:{'input_text': convertedText,
          'lang': lang.split('-')[0],
          'guid': guid
         }
    
  }).done(function(data) {
      res = data.output_text;
      guid = data.guid;
      sessionStorage.setItem(guidKey, guid);
      
  }).fail(function(err) {
      res = err
  }).always(function(data) {
    if (res == ""){
      res = "Please try again later"
    }
    //Call Text to Speech with Final Response
    textToSpeech(res,lang)
  });
  
}

//Text to Speech Function
var textToSpeech = function(inputText,lang){    
  
  var subscriptionKey="f2ba37af57ab4eb295c77a0d1947ce51"
  var serviceRegion = "eastus"
  var SpeechSDK;
  SpeechSDK = window.SpeechSDK;
  var synthesizer;
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  
  speechConfig.speechSynthesisVoiceName = Voice(lang);
  console.log(speechConfig.speechSynthesisVoiceName)
 
  synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  synthesizer.speakTextAsync(
    inputText,
    function (result) {
      window.console.log(result);
      synthesizer.close();
      synthesizer = undefined;
    },
    function (err) {
      window.console.log(err)
      synthesizer.close();
      synthesizer = undefined;
  });
    
}
//call Speech to Text onload
speechToText();


//Function to return voice names for text to Speech
var Voice = function(lang){
  var VoiceName = ""
  switch (lang) {
    case "ar-QA":
      VoiceName = "ar-QA-AmalNeural";
      break;
    case "en-US":
      VoiceName = "en-US-AshleyNeural";
      break;
    case "ur-IN":
      VoiceName = "ur-IN-GulNeural";
      break;
    case "hi-IN":
      VoiceName = "hi-IN-SwaraNeural";
      break;
    case "de-DE":
      VoiceName = "de-DE-AmalaNeural";
      break;
    case "es-ES":
      VoiceName = "es-ES-AbrilNeural";
      break;
    case "fi-FI":
      VoiceName = "fi-FI-NooraNeural";
      break;
    case "fr-FR":
      VoiceName = "fr-FR-DeniseNeural";
      break;
    case  "it-IT":
      VoiceName = "it-IT-IsabellaNeural";
      break;
    case  "ja-JP":
      VoiceName = "ja-JP-AoiNeural";
      break;
    case  "ko-KR":
      VoiceName = "ko-KR-SunHiNeural";
      break;
    case  "pl-PL":
      VoiceName = "pl-PL-ZofiaNeural";
        break;
    case  "pt-BR":
      VoiceName = "pt-BR-BrendaNeural";
      break;
    case  "ru-RU":
      VoiceName = "ru-RU-DariyaNeural";
      break;
    case  "sv-SE":
      VoiceName = "sv-SE-HilleviNeural";
      break;
    case  "zh-CN":
      VoiceName = "zh-CN-XiaochenNeural";
      break;
    default:
      VoiceName = "en-US-JennyMultilingualNeural";
  }

  return VoiceName;

}


///// This function gets the reponse from backend - The response is based on the the single input ////////////////////
///// Not to be used but to be kept as a backup ///////////////////
var askBot = function(convertedText,lang){
  var res = "";
  $.ajax({
    type:"POST",
    url:"/speech",
    data:{'input_text': convertedText,
          'lang': lang.split('-')[0]
         }
    
  }).done(function(data) {
      res = data;
  }).fail(function(err) {
    res = err;
  }).always(function(data) {
    if (res == ""){
      res = "Please try again later"
    }
    textToSpeech(res,lang)
  });
  
}
