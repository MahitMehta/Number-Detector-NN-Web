from flask import Flask, render_template, request
from number_detector import Number_Detector
import json

app = Flask(__name__)


@app.route("/", methods=["GET"])
def home():
    return render_template('index.html')


@app.route("/image", methods=["POST"])
def Image():
    data = json.loads(request.data.decode())
    dataURL = data["dataURL"]
    number_detector = Number_Detector(dataURL)
    number_detector.cvt_Image()
    guess = number_detector.detect_number()
    try:
        number = data["number"]
        if guess != number:
            number_detector.train_detector(number)
    except KeyError:
        pass
    returnData = json.dumps({"guess": guess})
    return returnData


if __name__ == "__main__":
    app.run(debug=True, port=5000)
