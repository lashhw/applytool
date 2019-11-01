/* global search init getData */
'use strict'
const resultsPerQuery = 50
const subjects = ['s1', 's2', 's3', 's4', 's5']
const subjectIndex = {
  '頂標': 'standard_1',
  '前標': 'standard_2',
  '均標': 'standard_3',
  '後標': 'standard_4',
  '底標': 'standard_5',
  '一階': 'standard_6',
  '二階': 'standard_7'
}
const ruleList = ['頂標', '前標', '均標', '後標', '底標', '一階', '二階', '--']
var filter = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1]
]
var rule = [
  ['頂標', '前標', '均標', '後標', '底標', '一階', '二階', '--'],
  ['頂標', '前標', '均標', '後標', '底標', '一階', '二階', '--'],
  ['頂標', '前標', '均標', '後標', '底標', '一階', '二階', '--'],
  ['頂標', '前標', '均標', '後標', '底標', '一階', '二階', '--'],
  ['頂標', '前標', '均標', '後標', '底標', '一階', '二階', '--']
]
var data = []

function updateTable (results) {
  var content = ''
  for (var i = 0; i < results.length; i++) {
    var r = results[i]
    var url = `https://www.cac.edu.tw/apply109/system/109ColQrytk4p_forapply_os92k5w/html/109_${r['id']}.htm`
    content += '<tr>'
    content += `<td>${r['school']}</td>`
    content += '<td>'
    content += `<a href='${url}' target='_blank'>${r['name']}</a>`
    if (r['s6'] !== '--') content += `(英聽${r['s6']})`
    content += '</td>'
    for (var j = 0; j < subjects.length; j++) {
      var str = r[subjects[j]]
      content += '<td ';
      if (r['const'][j] == 'n') content += "style='color: #808080;' "
      var s = ''
      if (str in subjectIndex) s = subjectIndex[r[subjects[j]]]
      content += `class='subject align-middle ${s}'>${str}</td>`
    }
    content += '</tr>'
  }
  $('#result_content').append(content)
  $('#table_result').floatThead('reflow')
}

function updateRule () {
  for (var i = 0; i < 5; i++) {
    rule[i] = []
    for (var j = 0; j < 8; j++) {
      if (filter[i][j] === 1) rule[i].push(ruleList[j])
    }
  }
}

function update (start) {
  if (typeof start === 'undefined') {
    $('#result_content').empty()
    start = 0
  }
  var tmp = search(
    data, $('input[name=mode]:checked').val(), $('#qd').val(), $('#qs').val(), resultsPerQuery, start,
    {
      's1': rule[0],
      's2': rule[1],
      's3': rule[2],
      's4': rule[3],
      's5': rule[4]
    }
  )
  var nextStart = tmp[0]
  var results = tmp[1]
  updateTable(results)
  if (nextStart !== -1) {
    $('#more-results')
      .removeClass('d-none')
      .off('click')
      .click(function () {
        update(nextStart)
      })
  } else {
    $('#more-results').addClass('d-none')
  }
}

// eslint-disable-next-line no-unused-vars
function changeFilter (id) {
  var subject = id.split('-')[0]
  var standard = id.split('-')[1]
  if (filter[subject][standard] === 1) {
    filter[subject][standard] = 0
    $('#' + id).children().removeClass('oi-check')
  } else if (filter[subject][standard] === 0) {
    filter[subject][standard] = 1
    $('#' + id).children().addClass('oi-check')
  }
  updateRule()
  update()
}

// get data and search automatically when the page is fully loaded
$(document).ready(function () {
  init()
  data = getData('data/apply/data.json')
  update()
})
