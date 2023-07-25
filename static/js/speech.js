
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
            botResponse = askBot(convertedText)
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

var askBot = function(convertedText){
  var res = "";
  $.ajax({
    type:"POST",
    url:"/speech",
    data:{'input_text': convertedText}
    
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
    textToSpeech(res)
  });
  
}

var textToSpeech = function(inputText){    
  
  var subscriptionKey="f2ba37af57ab4eb295c77a0d1947ce51"
  var serviceRegion = "eastus"
  var SpeechSDK;
  SpeechSDK = window.SpeechSDK;
  var synthesizer;
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
  speechConfig.speechSynthesisVoiceName = "ar-QA-MoazNeural";
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