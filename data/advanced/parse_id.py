import requests, json, js2py

link = "https://campus4.ncku.edu.tw/uac/cross_search/script/all_info.js"
req = requests.get(link)
js = req.text
context = js2py.EvalJs()
context.execute(js)
all_data = context.all_dept_info
data = [x[2] for x in all_data]

f = open("id.json", "w")
f.write(json.dumps(data))
