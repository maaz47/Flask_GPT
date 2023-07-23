import requests, uuid, json
import azure.cognitiveservices.speech as speechsdk
import os
import openai
import config 

#################################################Translation configs################################################
translation_key = config.DevelopmentConfig.translation_key
translation_endpoint = config.DevelopmentConfig.translation_endpoint
translation_location = config.DevelopmentConfig.translation_location
translation_path = config.DevelopmentConfig.translation_path

#################################################Custom Open AI configs################################################
#Trained it on 3 sets of data 
#data with only english - indexName = "onlyenglish"
#data with only arabic - indexName = "onlyarabic"
#data with both english & arabic- indexName = "both"
openai_url = config.DevelopmentConfig.openai_url
openai_api_key = config.DevelopmentConfig.openai_api_key
cognitive_service_url = config.DevelopmentConfig.cognitive_service_url
cognitive_service_key= config.DevelopmentConfig.cognitive_service_key
indexName = config.DevelopmentConfig.indexName


#################################################Speech configs################################################
speech_key = config.DevelopmentConfig.speech_key
speech_region = config.DevelopmentConfig.speech_region


#################################################generic Open AI configs################################################
#openai.api_type = config.DevelopmentConfig.openai.api_type
#openai.api_base = config.DevelopmentConfig.openai.api_base
#openai.api_version = config.DevelopmentConfig.openai.api_version
#openai.api_key = config.DevelopmentConfig.openai.api_key



def askBot(openai_url, openai_api_key,chat,cognitive_service_url,cognitive_service_key,indexName):
    headers = {
      'api-key': openai_api_key,
      'Content-Type': 'application/json'
    }
    
    payload = ({"dataSources":[{"type":"AzureCognitiveSearch","parameters":{"endpoint":cognitive_service_url,"key":cognitive_service_key,"indexName":indexName,"semanticConfiguration":"","queryType":"simple","fieldsMapping":None,"inScope":True,"roleInformation":"You are an AI assistant for Ministry of Education & Information that helps people in Qatar find information relevant to ministry of education."}}],"deployment":"openaidemo","temperature":0,"top_p":1,"max_tokens":800,"stop":None,"stream":False})
    payload["messages"] = chat
    payload = json.dumps(payload)

    try:
        response = requests.request("POST", openai_url, headers=headers, data=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx errors
        #return response.json()
        response = response.json()
        chat.append(response["choices"][0]["messages"])
        return chat

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


def translate(translation_key,translation_location,translation_endpoint,translation_path,from_language,to_language,input_text):
    constructed_url = translation_endpoint + translation_path

    params = {
        'api-version': '3.0',
        'from': from_language,
        'to': [to_language]
    }

    headers = {
        'Ocp-Apim-Subscription-Key': translation_key,
        # location required if you're using a multi-service or regional (not global) resource.
        'Ocp-Apim-Subscription-Region': translation_location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    # You can pass more than one object in body.
    body = [{
        'text': input_text
    }]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    #return json.dumps(response, sort_keys=True, ensure_ascii=False, indent=4, separators=(',', ': '))
    return response

def textToSpeech_output(speech_key,speech_region,speech_synthesis_voice_name,text):
    
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
    # Note: the voice setting will not overwrite the voice element in input SSML.
    speech_config.speech_synthesis_voice_name = speech_synthesis_voice_name 


    # use the default speaker as audio output.
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)

    result = speech_synthesizer.speak_text_async(text).get()
    # Check result
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        print("Speech synthesized for text [{}]".format(text))
      
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))


def speechToText_input(speech_key,speech_region,speech_recognition_language,target_language):
    
    speech_translation_config = speechsdk.translation.SpeechTranslationConfig(subscription=speech_key, region=speech_region)
    speech_translation_config.speech_recognition_language=speech_recognition_language
    
    target_language=target_language
    speech_translation_config.add_target_language(target_language)

    audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
    translation_recognizer = speechsdk.translation.TranslationRecognizer(translation_config=speech_translation_config, audio_config=audio_config)

    print("Speak into your microphone.")
    translation_recognition_result = translation_recognizer.recognize_once_async().get()

    if translation_recognition_result.reason == speechsdk.ResultReason.TranslatedSpeech:
        print("Recognized: {}".format(translation_recognition_result.text))
        print("""Translated into '{}': {}""".format(
            target_language, 
            translation_recognition_result.translations[target_language]))
        return translation_recognition_result.translations[target_language]
    elif translation_recognition_result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized: {}".format(translation_recognition_result.no_match_details))
    elif translation_recognition_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = translation_recognition_result.cancellation_details
        print("Speech Recognition canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))
            print("Did you set the speech resource key and region values?")


def callBotWithText(input_text):
    #input_text = "من أنت؟"

    #Translating from Arabic to English
    res = translate(translation_key = translation_key,
                    translation_location = translation_location,
                    translation_endpoint = translation_endpoint,
                    translation_path = translation_path,
                    input_text = input_text,
                    from_language = "ar",
                    to_language = 'en')

    translated_text = res[0]["translations"][0]["text"]


    #appending the converted english text in Chat Array
    chat = []
    chat.append({'role': 'user', 'content': translated_text})

    bot_reponse = askBot(openai_url, openai_api_key, chat,cognitive_service_url,cognitive_service_key,indexName) # for generic: askBot(chat)

    if bot_reponse:
            last_message = bot_reponse[len(bot_reponse)-1][len(bot_reponse)-1]["content"]  #for generic: bot_reponse[len(bot_reponse)-1]["content"] 

    else:
            last_message = "Error occurred during the request."

    #call translator for English to Arabic
    res = translate(translation_key = translation_key,
                    translation_location = translation_location,
                    translation_endpoint = translation_endpoint,
                    translation_path = translation_path,
                    input_text = last_message,
                    from_language = "en",
                    to_language = 'ar')


    return res[0]["translations"][0]["text"]


def callBotWithSpeech():
    file_path = "static/audio/recording.m4a"
    # Converting Arabic Speech to English Text
    input_text = speechToText_input(speech_key=speech_key,speech_region=speech_region,speech_recognition_language="ar-QA",target_language="en")

    #appending the converted english text in Chat Array
    chat = []
    chat.append({'role': 'user', 'content': input_text})

    #Passing English Chat to askBot (Azure Open AI)
    bot_reponse = askBot(openai_url, openai_api_key, chat,cognitive_service_url,cognitive_service_key,indexName) # for generic: askBot(chat)

    if bot_reponse:
            last_message = bot_reponse[len(bot_reponse)-1][len(bot_reponse)-1]["content"]  #for generic: bot_reponse[len(bot_reponse)-1]["content"] 

    else:
            last_message = "Error occurred during the request"

    #Translating english response from askBot in to Arabic
    res = translate(translation_key = translation_key,
                    translation_location = translation_location,
                    translation_endpoint = translation_endpoint,
                    translation_path = translation_path,
                    input_text = last_message,
                    from_language = "en",
                    to_language = 'ar-QA')

    #Arabic Text is converted to arabic speech
    output_text = res[0]["translations"][0]["text"]
    return textToSpeech_output(speech_key=speech_key,speech_region=speech_region,speech_synthesis_voice_name="ar-QA-AmalNeural",text=output_text)
    
    #{ "input_text":input_text , 
    #  "output_text": output_text }
    

