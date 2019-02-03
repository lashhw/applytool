import requests, json, sys
from bs4 import BeautifulSoup
data = []
GROUP_START = 1
GROUP_END = 19

for groupid in range(GROUP_START,GROUP_END+1):
    groupid_f = "{:02d}".format(groupid)
    print("processing "+groupid_f+"...", end="")
    sys.stdout.flush()
    # Requests
    url = "https://campus4.ncku.edu.tw/uac/cross_search/class_info/D%s.html" % groupid_f
    r = requests.get(url)
    r.encoding = 'utf-8'
    rawhtml = r.text
    # BeautifulSoup
    soup = BeautifulSoup(rawhtml, 'html5lib')
    allTags = soup.select('td.t > a')
    for tag in allTags:
        data.append(tag['href'][-10:-5])
    print("ok!")
f = open("id.json", "w")
f.write(json.dumps(data))
