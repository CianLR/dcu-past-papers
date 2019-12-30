from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import sys

app = Flask('DCU Past Papers Backend')
CORS(app)

papers_path = "papers.pickle"
papers = {}
with open(papers_path, 'rb') as f:
    papers = pickle.load(f)

def paper_sort_key(paper):
    year = float(paper["year"])
    if paper["code"].endswith("R"):
        year += 0.5
    return year

@app.route('/api/search', methods=['POST'])
def search():
    search = None
    try:
        search = request.get_json()['search'].lower()
    except Exception as e:
        print("Error in request:", e)
        return "Error parsing JSON", 400
    print("Search:", search)
    if len(search) < 3:
        return "Search must be more than 3 characters", 400
    found = []
    for code in papers:
        if code.startswith(search):
            found.extend(papers[code])
    if not found:
        return "{} not in papers".format(search), 400
    return jsonify({"results": sorted(
        found,
        key=paper_sort_key,
        reverse=True,
    )})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

