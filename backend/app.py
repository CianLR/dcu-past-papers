from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import sys

app = Flask('DCU Past Papers Backend')
CORS(app)

if len(sys.argv) != 2:
    print('Usage: {} <pickled_data>'.format(sys.argv[0]))
    sys.exit(1)

papers = {}
with open(sys.argv[1], 'rb') as f:
    papers = pickle.load(f)

@app.route('/api/search', methods=['POST'])
def search():
    search = None
    try:
        search = request.get_json()['search'].lower()
    except Exception as e:
        print("Error in request:", e)
        return "Error parsing JSON", 400
    if len(search) < 3:
        return "Search must be more than 3 characters", 400
    found = []
    for code in papers:
        if code.startswith(search):
            found.extend(papers[code])
    if not found:
        return "{} not in papers".format(search), 400
    return jsonify({'results': found})


app.run(host='0.0.0.0')

