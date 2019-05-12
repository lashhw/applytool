/* global search init getData isInSmallDevice */
/* eslint-disable camelcase */
'use strict'
const resultsPerQuery = 50
const subjects = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11']
const subjects_gsat = {
  's1': 2,
  's2': 2,
  's3': 2,
  's4': 2,
  's5': 2,
  's6': 1
}
var data = []

function getFormatted (str, colspan, additionalClass) {
  return "<td class='subject align-middle " + additionalClass + "' colspan='" + colspan + "'>" + str + '</td>'
}

function updateTable (results) {
  var content = ''
  for (var i = 0; i < results.length; i++) {
    var url = 'https://campus4.ncku.edu.tw/uac/cross_search/dept_info/' + results[i]['id'] + '.html'
    content += '<tr>'
    content += "<td class='align-middle' rowspan='2'>" + results[i]['school'] + '</td>'
    content += "<td class='align-middle' rowspan='2'><a href='" + url + "' target='_blank'>" + results[i]['name'] + '</a></td>'
    for (var j = 0; j < subjects.length; j++) {
      if (subjects[j] in results[i]['subjects']) {
        if (isInSmallDevice()) {
          content += getFormatted('採', 1, 'advanced')
        } else {
          content += getFormatted('x' + results[i]['subjects'][subjects[j]], 1, 'advanced')
        }
      } else {
        content += getFormatted('--', 1, '')
      }
    }
    content += '</tr><tr>'
    for (var x in subjects_gsat) {
      if (x in results[i]['subjects_gsat']) {
        if (isInSmallDevice()) {
          content += getFormatted(results[i]['subjects_gsat'][x].substring(0, 1), subjects_gsat[x], 'gsat')
        } else {
          content += getFormatted(results[i]['subjects_gsat'][x], subjects_gsat[x], 'gsat')
        }
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
      .click(
        function () {
          update(nextStart)
        }
      )
  } else {
    $('#more-results').addClass('d-none')
  }
}

// get data and search automatically when the page is fully loaded
$(document).ready(function () {
  init()
  data = getData('data/advanced/data.json')
  update()
})
