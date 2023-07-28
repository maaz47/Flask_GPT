from flask import Flask, render_template, jsonify, request
import config
import openai
import aiapi


def page_not_found(e):
  return render_template('404.html'), 404


app = Flask(__name__)
app.config.from_object(config.config['development'])

app.register_error_handler(404, page_not_found)


@app.route("/", methods = ['POST', 'GET'])
def index():
  if request.method == 'POST':
    input_text = request.form['input_text']
    lang = request.form['lang']
    response_text = aiapi.callBotWithText(input_text,lang) #.replace("\n","<br>")
    return jsonify(response_text), 200
  return render_template('index.html', **locals())


@app.route("/speech", methods = ['POST', 'GET'])
def speech():
  if request.method == 'POST':
    input_text = request.form['input_text']
    lang = request.form['lang']
    response_text = aiapi.callBotWithSpeech(input_text,lang) #.replace("\n","<br>")
    return jsonify(response_text), 200
  return render_template('speech.html', **locals())


@app.route("/text", methods = ['POST', 'GET'])
def text():
  return render_template('text.html', **locals())


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='8888', debug=True)
