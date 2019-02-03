import requests, json, sys
from bs4 import BeautifulSoup
data = []
SCHOOL_START = 1
SCHOOL_END = 154

for schoolid in range(SCHOOL_START,SCHOOL_END+1):
    schoolid_f = "{:03d}".format(schoolid)
    print("processing "+schoolid_f+"...", end="")
    sys.stdout.flush()
    # Requests
    url = "https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/ShowSchGsd.php?colno=%s" % schoolid_f
    r = requests.get(url)
    r.encoding = 'utf-8'
    rawhtml = r.text
    # BeautifulSoup
    soup = BeautifulSoup(rawhtml, 'html.parser')
    allTags = soup.find_all('a')
    for tag in allTags:
        data.append(tag['href'][-10:-4])
    print("ok!")
f = open("id.json", "w")
f.write(json.dumps(data))
