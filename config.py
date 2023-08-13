
class Config(object):
    DEBUG = True
    TESTING = False

#MPN Config
class DevelopmentConfig_(Config):
    #SECRET_KEY = "this-is-a-super-secret-key"
    #OPENAI_KEY = 'enter-openai-api-key-here'
    #################################################Translation configs################################################
    translation_key = "70625d08d1864174878a0dbdfcba34a2"
    translation_endpoint = "https://api.cognitive.microsofttranslator.com"
    translation_location = "eastus2"
    translation_path = '/translate'

    #################################################Custom Open AI configs################################################
    #Trained it on 3 sets of data 
    #data with only english - indexName = "onlyenglish"
    #data with only arabic - indexName = "onlyarabic"
    #data with both english & arabic- indexName = "both"
    openai_url = "https://openaidemo159.openai.azure.com/openai/deployments/openaidemo/extensions/chat/completions?api-version=2023-06-01-preview"
    openai_api_key = "6d98b90390f04fb3b9c2b8e2fbaab025"
    cognitive_service_url = "https://openaidemobasic.search.windows.net"
    cognitive_service_key ="LgKkqc69IRJflwf6rPPoVFnLzdGNJHUXTvb0ANGFG5AzSeBPXVbs"
    indexName = "onlyenglish"
    deployment = "openaidemo"


    #################################################Speech configs################################################
    speech_key = "f2ba37af57ab4eb295c77a0d1947ce51"
    speech_region = "eastus"


    #################################################generic Open AI configs################################################
    #openai.api_type = "azure"
    #openai.api_base = "https://openaidemo159.openai.azure.com/"
    #openai.api_version = "2023-03-15-preview"
    #openai.api_key = "6d98b90390f04fb3b9c2b8e2fbaab025"

#Azure Config
class DevelopmentConfig(Config):
   
    #################################################Translation configs################################################
    translation_key = "5dae6268f7a84776bd047216144846c0"
    translation_endpoint = "https://api.cognitive.microsofttranslator.com"
    translation_location = "eastus2"
    translation_path = '/translate'

    #################################################Custom Open AI configs################################################
    #Trained it on 3 sets of data
    #data with only english - indexName = "onlyenglish"
    #data with only arabic - indexName = "onlyarabic"
    #data with both english & arabic- indexName = "both"
    openai_url = "https://openaidemo-1599.openai.azure.com/openai/deployments/openaidemo159/extensions/chat/completions?api-version=2023-06-01-preview"
    openai_api_key = "bd95dc8f0530401f95ec759b65a1590a"
    cognitive_service_url = "https://cognitivesearchdemo1599.search.windows.net"
    cognitive_service_key ="XTB0UqoQFikKbXdFLc06lgwhLmdr4i7MoHdo8iWZdmAzSeDzNE0f"
    indexName = "onlyenglish"
    deployment = "openaidemo159"


    #################################################Speech configs################################################
    speech_key = "7e002ee4369540458ed6acd7fa15d561"
    speech_region = "eastus"




config = {
    'development': DevelopmentConfig,
    'testing': DevelopmentConfig,
    'production': DevelopmentConfig
}

