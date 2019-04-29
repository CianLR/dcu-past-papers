import csv
import sys
import pickle

def extract_url(text):
    start = text.find("'")
    end = text.find("'", start + 1)
    return text[start + 1:end]

def parse(filename):
    rows = []
    with open(filename) as csv_file:
        reader = csv.DictReader(csv_file)
        rows = list(reader)
    parsed = {}
    for r in rows:
        code = r['ModuleCode'].lower()
        if code not in parsed:
            parsed[code] = []
        parsed[code].append({
            'code': r['ModuleCode'],
            'year': r['Year'],
            'link': extract_url(r['Link']),
        })
    return parsed


def serialise(data, outfile):
    with open(outfile, 'wb') as out:
        pickle.dump(data, out)


def main():
    if len(sys.argv) != 2:
        print("Usage {} <csv_file>".format(sys.argv[0]))
        return
    data = parse(sys.argv[1])
    serialise(data, 'papers.pickle')

if __name__ == '__main__':
    main()

