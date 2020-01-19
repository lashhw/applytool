/* eslint-disable dot-notation */
/* global init getData checkName $ */
/* eslint-disable camelcase */
'use strict'
const resultsPerQuery = 50
const subjects = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11']
const subjects_gsat = {
  s1: 2,
  s2: 2,
  s3: 2,
  s4: 2,
  s5: 2,
  s6: 1
}
var filter = []
var data = []

function getFormatted (str, colspan, additionalClass) {
  return `<td class='subject align-middle ${additionalClass}' colspan='${colspan}'>${str}</td>`
}

function updateTable (results) {
  var content = ''
  for (var i = 0; i < results.length; i++) {
    const r = results[i]
    var url = `https://campus4.ncku.edu.tw/uac/cross_search/dept_info/${r['id']}.html`

    content += '<tr>'
    content += `<td class='align-middle' rowspan='2'>${r['school']}</td>`
    content += `<td class='align-middle' rowspan='2'><a href='${url}' target='_blank'>${r['name']}</a></td>`
    for (var j = 0; j < subjects.length; j++) {
      if (subjects[j] in r['subjects']) {
        content += getFormatted(
          `<span class='d-md-none'>採</span>
           <span class='d-none d-md-inline'>x${r['subjects'][subjects[j]]}</span>`,
          1,
          'advanced'
        )
      } else {
        content += getFormatted('--', 1, '')
      }
    }
    content += '</tr>'

    content += '<tr>'
    for (var x in subjects_gsat) {
      if (x in r['subjects_gsat']) {
        content += getFormatted(
          `${r['subjects_gsat'][x].substring(0, 1)}
           <span class='d-none d-md-inline'>${r['subjects_gsat'][x].substring(1, 2)}</span>`,
          subjects_gsat[x],
          'gsat'
        )
      } else {
        content += getFormatted('--', subjects_gsat[x], '')
      }
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
  if (!filter.includes(subjects[id])) {
    filter.push(subjects[id])
    $('#' + id).children().removeClass('oi-check')
  } else {
    var index = filter.indexOf(subjects[id])
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
      if (testData['subjects'][filter[j]] !== undefined) flagFilter = false
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
  data = getData('data/advanced/data.json')
  update()
})
