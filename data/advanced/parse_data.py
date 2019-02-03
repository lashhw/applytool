import requests, json, sys, unicodedata
from bs4 import BeautifulSoup

subjects_dict = {
    "國文": "s1",
    "英文": "s2",
    "數學甲": "s3",
    "物理": "s4",
    "化學": "s5",
    "生物": "s6",
    "數學乙": "s7",
    "歷史": "s8",
    "地理": "s9",
    "公民與社會": "s10",
    "術科(美術)": "s11",
    "術科(體育)": "s11",
    "術科(音樂)": "s11"
}

subjects_gsat_dict = {
    "國文": "s1",
    "英文": "s2",
    "數學": "s3",
    "社會": "s4",
    "自然": "s5",
    "英聽": "s6"
}

def normalize(str):
    str = unicodedata.normalize("NFKD", str)
    str = str.replace('x','')
    str = str.replace('.','')
    str = str.replace(' ','')
    str = ''.join([i for i in str if not i.isdigit()]) # remove numbers
    return str

def normalize_list(l):
    l = [normalize(x) for x in l]
    l = list(filter(None, l)) # remove empty string
    return l

data = []
f_id = open("id.json", "r")
id_all = json.loads(f_id.read())
len_id_all = len(id_all)
for idx, id in enumerate(id_all):
    print("processing %s...(%s%%)" % (id,(int)((idx+1)/len_id_all*100)), end="")
    sys.stdout.flush()

    # Requests
    url = "https://campus4.ncku.edu.tw/uac/cross_search/dept_info/"+id+".html"
    r = requests.get(url)
    r.encoding = 'big5'
    rawhtml = r.text

    #BeautifulSoup
    # init
    soup_all = BeautifulSoup(rawhtml, 'html5lib')
    trs = soup_all.find_all("tr")
    soup_tr1 = BeautifulSoup(trs[1].prettify(), 'html.parser')
    soup_tr3 = BeautifulSoup(trs[3].prettify(), 'html.parser')
    tds_tr1 = soup_tr1.find_all("td")
    tds_tr3 = soup_tr3.find_all("td")
    # get subjects
    subjects = tds_tr1[2].get_text().split('\n')
    subjects = normalize_list(subjects)
    subjects = [subjects_dict[x] for x in subjects]
    # get gsat subjects
    tmp_list = tds_tr1[1].get_text().split('\n') + tds_tr3[0].get_text().split('\n')
    tmp_list = normalize_list(tmp_list)
    subjects_gsat = {subjects_gsat_dict[x[0:2]]:x[3:5] for x in tmp_list if x != "---"}
    # create data
    data.append({})
    data[idx]['id'] = id
    data[idx]['school'] = soup_all.title.string.split(" - ")[0]
    data[idx]['name'] = soup_all.title.string.split(" - ")[1]
    data[idx]['subjects'] = subjects
    data[idx]['subjects_gsat'] = subjects_gsat
    print("ok!")
f_data = open("data.json", "w")
f_data.write(json.dumps(data, ensure_ascii=False))
