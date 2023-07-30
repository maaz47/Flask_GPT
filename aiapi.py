import http.client
import requests, uuid, json
import azure.cognitiveservices.speech as speechsdk
import os
import openai
import config 
import uuid

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

chat = []


################## HTTP ASK BOT OPEN AI FUNCTION ##################################################
def askBothttpClient(chat):
    conn = http.client.HTTPSConnection("openaidemo159.openai.azure.com")
    payload = ({
      "dataSources": [
        {
          "type": "AzureCognitiveSearch",
          "parameters": {
            "endpoint": cognitive_service_url,
            "key": cognitive_service_key,
            "indexName": indexName,
            "semanticConfiguration": "",
            "queryType": "simple",
            "fieldsMapping": None,
            "inScope": True,
            "roleInformation": "You are an Educational AI assistant for Ministry of Education & Higher Education that helps people in Qatar find relevant information."
          }
        }
      ],
      "deployment": "openaidemo",
      "temperature": 0.3,
      "top_p": 1,
      "max_tokens": 500,
      "stop": None,
      "stream": False
    })
    payload["messages"] = chat
    payload = json.dumps(payload)

    headers = {
      'api-key': openai_api_key,
      'Content-Type': 'application/json'
    }
    
    conn.request("POST", "/openai/deployments/openaidemo/extensions/chat/completions?api-version=2023-06-01-preview", payload, headers)
    res = conn.getresponse()
    data = res.read()
    response = json.loads(data.decode("utf-8")) 
    return (response["choices"][0]["messages"][1]["content"])
    

############ REQUEST ASK BOT OPEN AI FUNCTION ######################################
def askBot(chat):
    headers = {
      'api-key': openai_api_key,
      'Content-Type': 'application/json'
    }
    
    payload = ({"dataSources":[{"type":"AzureCognitiveSearch","parameters":{"endpoint":cognitive_service_url,"key":cognitive_service_key,"indexName":indexName,"semanticConfiguration":"","queryType":"simple","fieldsMapping":None,"inScope":True,"roleInformation":"You are an AI assistant for Ministry of Education & Higher Education that helps people in Qatar find information relevant to ministry of education."}}],"deployment":"openaidemo","temperature":0,"top_p":1,"max_tokens":200,"stop":None,"stream":False})
    print(chat)
    payload["messages"] = chat 
    payload = json.dumps(payload)

    try:
        response = requests.request("POST", openai_url, headers=headers, data=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx errors
        #return response.json()
        res = response.json() 
        #res = json.loads(response)
        return str(res["choices"][0]["messages"][1]["content"])

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


############ TRANSLATE ######################################
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

############ TEXT BACKEND ######################################
def callBotWithText_withHistory(input_text,lang,guid):
    
    if(lang != "en"):
        #Translating from Arabic to English
        res = translate(translation_key = translation_key,
                        translation_location = translation_location,
                        translation_endpoint = translation_endpoint,
                        translation_path = translation_path,
                        input_text = input_text,
                        from_language = lang,
                        to_language = 'en')

        translated_text = res[0]["translations"][0]["text"]
    else:
        translated_text = input_text

    #getting history (if any)
    #chat,guid = getHistory(guid,translated_text,'user')
    global chat
    chat.append(({'role': 'user', 'content': translated_text}))
    if len(chat) > 10:
        chat = chat[-10:]

    bot_reponse = askBot(chat) # for generic: askBot(chat)
    
    if bot_reponse:
            #last_message = bot_reponse[len(bot_reponse)-1][len(bot_reponse[len(bot_reponse)-1])-1]["content"]  #for generic: bot_reponse[len(bot_reponse)-1]["content"] 
            last_message = bot_reponse #[1]["content"]  #for generic: bot_reponse[len(bot_reponse)-1]["content"] 
            #chat,guid = getHistory(guid,last_message,'assistant') #saving response to history
            chat.append(({'role': 'assistant', 'content': last_message}))

    else:
            last_message = "Error occurred during the request."

    if(lang != "en"):
        #call translator for English to Arabic
        res = translate(translation_key = translation_key,
                        translation_location = translation_location,
                        translation_endpoint = translation_endpoint,
                        translation_path = translation_path,
                        input_text = last_message,
                        from_language = "en",
                        to_language = lang)

        return ({"last_message": res[0]["translations"][0]["text"], "guid":guid})
    else:
        return ({"last_message": last_message, "guid":guid})

############ SPEECH BACKEND ######################################
def callBotWithSpeech_withHistory(input_text,lang,guid):
    
    #getting Chat history (if any)
    #chat,guid = getHistory(guid,input_text,'user')
    
    global chat
    chat.append(({'role': 'user', 'content': input_text}))
    if len(chat) > 10:
        chat = chat[-10:]

    #Passing English Chat to askBot (Azure Open AI)
    bot_reponse = askBot(chat)

    if bot_reponse:
            last_message = bot_reponse #bot_reponse[len(bot_reponse)-1][len(bot_reponse[len(bot_reponse)-1])-1]["content"] #bot_reponse[len(bot_reponse[len(bot_reponse)-1])-1]["content"]  #for generic: bot_reponse[len(bot_reponse)-1]["content"] 
            #chat,guid = getHistory(guid,last_message,'assistant') #saving the response to history
            chat.append(({'role': 'assistant', 'content': last_message}))

    else:
            last_message = "Error occurred during the request"
   
    if(lang != 'en-US'):
        #Translating english response from askBot in to Arabic
        res = translate(translation_key = translation_key,
                        translation_location = translation_location,
                        translation_endpoint = translation_endpoint,
                        translation_path = translation_path,
                        input_text = last_message,
                        from_language = "en",
                        to_language = lang)
        output_text = res[0]["translations"][0]["text"]
    
    else:
        output_text = last_message
    
    return ({"output_text": output_text, "guid":guid}) 


############ DELETE HISTORY ######################################
def delete_History():
     global chat
     chat = []
     return "Please start the conversation!"


############ MAINTAIN HISTORY (NOT IN USE) ######################################
def getHistory(guid,message,role):
    filepath = ""
    chat = []
    try:
        if(guid == "not found"):
            guid = uuid.uuid4().hex
            filepath = "./chats/"+ guid +".json"
            chat.append(({'role': role, 'content': message}))
            
        else:
            filepath = "./chats/"+ guid +".json"
            fp = open(filepath)
            chat = json.load(fp)
            chat.append(({'role': role, 'content': message}))
        
        if len(chat) > 10:
            chat = chat[-10:]
        
        with open(filepath, "wt") as fp:
            fp.write("")
        
        with open(filepath, "wt") as fp:
            json.dump(chat, fp)
   
        return chat, guid
    except:
       return "Error"