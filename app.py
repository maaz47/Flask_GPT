from flask import Flask, render_template, jsonify, request
import config
import openai
import aiapi
from twilio.twiml.messaging_response import MessagingResponse

def page_not_found(e):
  return render_template('404.html'), 404

app = Flask(__name__)
app.config.from_object(config.config['development'])

app.register_error_handler(404, page_not_found)


############# TEXT ########################################
@app.route("/", methods = ['POST', 'GET'])
def index():
  if request.method == 'POST':
    input_text = request.form['input_text']
    guid = request.form['guid']
    lang = request.form['lang']
    response_text = aiapi.callBotWithText_withHistory(input_text,lang,guid) #.replace("\n","<br>")
    return jsonify(response_text), 200
  return render_template('index.html', **locals())


############# SPEECH ########################################
@app.route("/speech", methods = ['POST', 'GET'])
def speech_withHistory():
  if request.method == 'POST':
    input_text = request.form['input_text']
    lang = request.form['lang']
    guid = "nothing" #request.form['guid']
    response_text = aiapi.callBotWithSpeech_withHistory(input_text,lang,guid) #.replace("\n","<br>")
    return jsonify(response_text), 200
  return render_template('speech.html', **locals())


############# WHATSAPP ########################################
chat_history = []
@app.route("/whatsapp", methods=['POST'])
def chatgpt():
    inb_msg = request.form['Body'].lower()
    
    global chat_history;
    chat_history.append({'role': 'user', 'content': inb_msg})
    
    if len(chat_history) > 10:
      chat_history = chat_history[-10:]
    
    bot_reponse = aiapi.askBot(chat_history) #.replace("\n","<br>")
    if bot_reponse:
      last_msg = bot_reponse
      chat_history.append({'role': 'assistant', 'content': last_msg})
    
    else:
      last_msg="Try Again!!"
    
    resp = MessagingResponse()
    resp.message(last_msg)
    return str(resp)
  

############# DELETE HISTORY ########################################
@app.post("/deleteHistory")
def delete_History():
  if request.method == 'POST':
    res = aiapi.delete_History()
    return jsonify(res), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8888', debug=True)
