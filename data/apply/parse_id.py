import requests, json, sys
from bs4 import BeautifulSoup
links = []
data = []

# get school url
# Requests
url1 = 'https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/ShowSchool.php'
r1 = requests.post(url1, data={'option': 'SCHNAME'})
r1.encoding = 'utf-8'
raw1 = r1.text
# BeautifulSoup
soup1 = BeautifulSoup(raw1, 'html.parser')
for tag in soup1.find_all('a'):
    links.append(tag.get('href'))

for link in links:
    print("processing %s..." % link, end="")
    sys.stdout.flush()

    # Requests
    url2 = 'https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/%s' % link
    r2 = requests.get(url2, headers={'referer': url1})
    r2.encoding = 'utf-8'
    raw2 = r2.text
    # BeautifulSoup
    soup2 = BeautifulSoup(raw2, 'html.parser')
    for tag in soup2.find_all('a'):
        data.append(tag['href'][-10:-4])
    print("ok!")

f = open("id.json", "w")
f.write(json.dumps(data))
