from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask('DCU Past Papers Backend')
CORS(app)

papers = {
    'ca4009': [{'code': 'CA4009', 'year': '2018R', 'link': 'http://google.com'}],
}

@app.route('/api/search', methods=['POST'])
def search():
    search = None
    try:
        search = request.get_json()['search'].lower()
    except Exception as e:
        print("Error in request:", e)
        return "Error parsing JSON", 400
    if search not in papers:
        return "{} not in papers".format(search), 400
    return jsonify({'results': papers[search]})

