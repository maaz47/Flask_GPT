from flask import Flask, render_template, jsonify, request
import config
import openai
import aiapi


def page_not_found(e):
  return render_template('404.html'), 404


app = Flask(__name__)
app.config.from_object(config.config['development'])

app.register_error_handler(404, page_not_found)


@app.route("/mobile", methods = ['POST', 'GET'])
def mobile():
  if request.method == 'POST':
    input_text = request.form['input_text']
    response_text = aiapi.callBotWithSpeech() #.replace("\n","<br>")
    return jsonify(response_text), 200
  return render_template('mobile.html', **locals())

@app.route("/", methods = ['POST', 'GET'])
def index():
  if request.method == 'POST':
    input_text = request.form['input_text']
    response_text = aiapi.callBotWithText(input_text) #.replace("\n","<br>")
    return jsonify(response_text), 200
  return render_template('index.html', **locals())



 




if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8888', debug=True)
