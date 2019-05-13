import requests, json, sys
from bs4 import BeautifulSoup

subjects = {
    '國文': 'chinese',
    '英文': 'english',
    '數學': 'math',
    '社會': 'society',
    '自然': 'science',
    '英聽': 'listening'
}
abbr_dict = {
    '國': '國文',
    '英': '英文',
    '數': '數學',
    '社': '社會',
    '自': '自然'
}
data = []
f_id = open('id.json', 'r')
id_all = json.loads(f_id.read())

cnt = 0
for id in id_all:
    print('processing '+id+'...', end='')
    sys.stdout.flush()

    # Requests
    url = 'https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/html/108_%s.htm' % id
    r = requests.get(url)
    r.encoding = 'utf-8'
    rawhtml = r.text

    # BeautifulSoup
    soup = BeautifulSoup(rawhtml, 'html.parser')
    if soup.title.text == '404 Not Found':
        sys.exit('Error. %s is not found.' % id)
    data.append({})
    allTags = soup.find_all('td')
    data[cnt]['id'] = id
    data[cnt]['school'] = allTags[0].get_text().split('\n')[1].strip()
    data[cnt]['name'] = allTags[0].get_text().split('\n')[2].strip()
    locate = 0
    for idx, tag in enumerate(allTags):
        s = tag.get_text(strip=True)
        if s == '離島外加名額': locate = idx
        if s in subjects:
            d1 = allTags[idx + 1].get_text(strip=True)
            d2 = allTags[idx + 2].get_text(strip=True)
            d3 = allTags[idx + 3].get_text(strip=True)
            if d1 != '--':
                data[cnt][subjects[s]] = d1
            elif d2 != '--':
                data[cnt][subjects[s]] = '採計'
            elif d3 != '--':
                data[cnt][subjects[s]] = '二階'
            else:
                data[cnt][subjects[s]] = '--'

    multi = allTags[locate + 2].get_text(strip=True)
    if multi != '--':
        for c in multi:
            if c not in abbr_dict:
                sys.exit('Abbreviation "%s" is not found.' % c)
            s = abbr_dict[c]
            if data[cnt][subjects[s]] == '二階' or data[cnt][subjects[s]] == '--':
                data[cnt][subjects[s]] = '採計'

    cnt += 1
    print('ok!')

f_data = open('data.json', 'w')
f_data.write(json.dumps(data, ensure_ascii=False))
