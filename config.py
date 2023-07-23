
class Config(object):
    DEBUG = True
    TESTING = False

class DevelopmentConfig(Config):
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


    #################################################Speech configs################################################
    speech_key = "f2ba37af57ab4eb295c77a0d1947ce51"
    speech_region = "eastus"


    #################################################generic Open AI configs################################################
    #openai.api_type = "azure"
    #openai.api_base = "https://openaidemo159.openai.azure.com/"
    #openai.api_version = "2023-03-15-preview"
    #openai.api_key = "6d98b90390f04fb3b9c2b8e2fbaab025"

config = {
    'development': DevelopmentConfig,
    'testing': DevelopmentConfig,
    'production': DevelopmentConfig
}

