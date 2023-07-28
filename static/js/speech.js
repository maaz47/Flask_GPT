
var convertedText ="";
var botResponse = "";

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
            botResponse = askBot(convertedText,languageSourceOptions.value)
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
      //return res;
      
  }).fail(function(err) {
    res = err;
    //return res;
  }).always(function(data) {
    if (res == ""){
      res = "Please try again later | الرجاء معاودة المحاولة في وقت لاحق"
      //return res;
    }
    textToSpeech(res,lang)
  });
  
}

var textToSpeech = function(inputText,lang){    
  
  var subscriptionKey="f2ba37af57ab4eb295c77a0d1947ce51"
  var serviceRegion = "eastus"
  var SpeechSDK;
  SpeechSDK = window.SpeechSDK;
  var synthesizer;
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  
  switch (lang) {
    case "ar-QA":
      speechConfig.speechSynthesisVoiceName = "ar-QA-AmalNeural";
      break;
    case "en-US":
      speechConfig.speechSynthesisVoiceName = "en-US-AshleyNeural";
      break;
    case "ur-IN":
      speechConfig.speechSynthesisVoiceName = "ur-IN-GulNeural";
      break;
    case "hi-IN":
      speechConfig.speechSynthesisVoiceName = "hi-IN-SwaraNeural";
      break;
    case "de-DE":
      speechConfig.speechSynthesisVoiceName = "de-DE-AmalaNeural";
      break;
    case "es-ES":
      speechConfig.speechSynthesisVoiceName = "es-ES-AbrilNeural";
      break;
    case "fi-FI":
      speechConfig.speechSynthesisVoiceName = "fi-FI-NooraNeural";
      break;
    case "fr-FR":
      speechConfig.speechSynthesisVoiceName = "fr-FR-DeniseNeural";
      break;
    case  "it-IT":
      speechConfig.speechSynthesisVoiceName = "it-IT-IsabellaNeural";
      break;
    case  "ja-JP":
      speechConfig.speechSynthesisVoiceName = "ja-JP-AoiNeural";
      break;
    case  "ko-KR":
      speechConfig.speechSynthesisVoiceName = "ko-KR-SunHiNeural";
      break;
    case  "pl-PL":
        speechConfig.speechSynthesisVoiceName = "pl-PL-ZofiaNeural";
        break;
    case  "pt-BR":
      speechConfig.speechSynthesisVoiceName = "pt-BR-BrendaNeural";
      break;
    case  "ru-RU":
      speechConfig.speechSynthesisVoiceName = "ru-RU-DariyaNeural";
      break;
    case  "sv-SE":
      speechConfig.speechSynthesisVoiceName = "sv-SE-HilleviNeural";
      break;
    case  "zh-CN":
      speechConfig.speechSynthesisVoiceName = "zh-CN-XiaochenNeural";
      break;
    default:
      speechConfig.speechSynthesisVoiceName = "en-US-JennyMultilingualNeural";
  }
  
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
    //if (!!window.SpeechSDK) {
    //  document.getElementById('content').style.display = 'block';
    //  document.getElementById('warning').style.display = 'none';
    //   //in case we have a function for getting an authorization token, call it.
    //  if (typeof RequestAuthorizationToken === "function") {
    //      RequestAuthorizationToken();
    //  }
    //}
  }

  speechToText();


var Voice = function(lang){
  switch (lang) {
    case "ar-QA":
      speechSynthesisVoiceName = "ar-QA-AmalNeural";
      break;
    case "en-US":
      speechSynthesisVoiceName = "en-US-AshleyNeural";
      break;
    case "ur-PK":
      speechSynthesisVoiceName = "ur-PK-UzmaNeural";
      break;
    case "hi-IN":
      speechSynthesisVoiceName = "hi-IN-SwaraNeural";
      break;
    case "de-DE":
      speechSynthesisVoiceName = "de-DE-AmalaNeural";
      break;
    case "es-ES":
      speechSynthesisVoiceName = "es-ES-AbrilNeural";
      break;
    case "fi-FI":
      speechSynthesisVoiceName = "fi-FI-NooraNeural";
      break;
    case "fr-FR":
      speechSynthesisVoiceName = "fr-FR-DeniseNeural";
      break;
    case  "it-IT":
      speechSynthesisVoiceName = "it-IT-IsabellaNeural";
      break;
    case  "ja-JP":
      speechSynthesisVoiceName = "ja-JP-AoiNeural";
      break;
    case  "ko-KR":
      speechSynthesisVoiceName = "ko-KR-SunHiNeural";
      break;
    case  "pl-PL":
        speechSynthesisVoiceName = "pl-PL-ZofiaNeural";
        break;
    case  "pt-BR":
      speechSynthesisVoiceName = "pt-BR-BrendaNeural";
      break;
    case  "ru-RU":
      speechSynthesisVoiceName = "ru-RU-DariyaNeural";
      break;
    case  "sv-SE":
      speechSynthesisVoiceName = "sv-SE-HilleviNeural";
      break;
    case  "zh-CN":
      speechSynthesisVoiceName = "zh-CN-XiaochenNeural";
      break;
    default:
      speechSynthesisVoiceName = "en-US-JennyMultilingualNeural";
  }

  return speechSynthesisVoiceName;

}
