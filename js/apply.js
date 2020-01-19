/* eslint-disable dot-notation */
/* global init getData checkName $ */
'use strict'
const resultsPerQuery = 50
const subjects = ['s1', 's2', 's3', 's4', 's5']
const subjectIndex = {
  頂標: 'standard_1',
  前標: 'standard_2',
  均標: 'standard_3',
  後標: 'standard_4',
  底標: 'standard_5',
  一階: 'standard_6',
  二階: 'standard_7'
}
const filterList = ['頂標', '前標', '均標', '後標', '底標', '一階', '二階', '--']
var filter = []
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
      content += '<td '
      if (r['const'][j] === 'n') content += "style='color: #808080;' "
      var s = ''
      if (str in subjectIndex) s = subjectIndex[r[subjects[j]]]
      content += `class='subject align-middle ${s}'>${str}</td>`
    }
    content += '</tr>'
  }
  $('#result_content').append(content)
  $('#table_result').floatThead('reflow')
}

function update (start) {
  if (typeof start === 'undefined') {
    $('#result_content').empty()
    start = 0
  }
  var tmp = search(
    data, $('input[name=mode]:checked').val(), $('#qd').val(), $('#qs').val(), resultsPerQuery, start
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
  var element1 = subjects[id.split('-')[0]]
  var element2 = filterList[id.split('-')[1]]
  var item = [element1, element2]
  var exist = false
  var index = -1
  for (var i = 0; i < filter.length; i++) {
    if (filter[i][0] === element1 && filter[i][1] === element2) {
      exist = true
      index = i
      break
    }
  }
  if (!exist) {
    filter.push(item)
    $('#' + id).children().removeClass('oi-check')
  } else {
    filter.splice(index, 1)
    $('#' + id).children().addClass('oi-check')
  }
  update()
}

function search (data, mode, qd, qs, limit, start) {
  if (qd === '' && qs === '') return [-1, []]

  var results = []
  var cnt = 0
  for (var i = start; i < data.length; i++) {
    if (cnt === limit) return [i, results]
    var testData = data[i]

    var flagName = checkName(testData, mode, qd, qs)
    if (flagName === false) continue

    var flagFilter = true
    for (var j = 0; j < filter.length; j++) {
      if (testData[filter[j][0]] === filter[j][1]) flagFilter = false
    }

    if (flagName && flagFilter) {
      results.push(testData)
      cnt++
    }
  }
  return [-1, results]
}

// get data and search automatically when the page is fully loaded
$(document).ready(function () {
  init()
  data = getData('data/apply/data.json')
  update()
})
