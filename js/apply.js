/* global search init getData isInSmallDevice */
'use strict'
const resultsPerQuery = 50
const subjects = ['chinese', 'english', 'math', 'society', 'science']
const subjectIndex = {
  '頂標': 's1',
  '前標': 's2',
  '均標': 's3',
  '後標': 's4',
  '底標': 's5',
  '採計': 's6',
  '二階': 's7'
}
var data = []

function getFormatted (str) {
  var s = ''
  if (str in subjectIndex) s = subjectIndex[str]
  return `<td class='subject align-middle ${s}'>${str}</td>`
}

function updateTable (results) {
  var content = ''
  for (var i = 0; i < results.length; i++) {
    var url = 'https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/html/108_' + results[i]['id'] + '.htm'
    content += '<tr>'
    content += '<td>' + results[i]['school'] + '</td>'
    content += "<td><a href='" + url + "' target='_blank'>" + results[i]['name'] + '</a></td>'
    for (var j = 0; j < subjects.length; j++) content += getFormatted(results[i][subjects[j]])
    content += '</tr>'
  }
  $('#result_content').append(content)
  $('#table_result').floatThead('reflow')
}

function getRule () {
  const selVal = [
    $('#sel1').val(),
    $('#sel2').val(),
    $('#sel3').val(),
    $('#sel4').val(),
    $('#sel5').val()
  ]
  var rule = []
  for (var i = 0; i < selVal.length; i++) {
    switch (selVal[i]) {
      case '1':
        rule[i] = ['頂標', '前標', '均標', '後標', '底標', '採計', '二階', '--']
        break
      case '2':
        rule[i] = ['頂標', '前標', '均標', '後標', '底標', '採計', '二階']
        break
      case '3':
        rule[i] = ['--']
        break
    }
  }
  return rule
}

function update (start) {
  const rule = getRule()
  if (typeof start === 'undefined') {
    $('#result_content').empty()
    start = 0
  }
  var tmp = search(
    data, $('input[name=mode]:checked').val(), $('#qd').val(), $('#qs').val(), resultsPerQuery, start,
    {
      'chinese': rule[0],
      'english': rule[1],
      'math': rule[2],
      'society': rule[3],
      'science': rule[4]
    }
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
  if (isInSmallDevice()) {
    $('#mode-title').text('模式')
    $('.subject-title').each(function () {
      var str = $(this).text().substring(0, 1)
      $(this).text(str)
    })
    for (var i = 1; i <= 5; i++) {
      $('#sel' + i).addClass('custom-select-sm')
    }
  }
  data = getData('data/apply/data.json')
  update()
})
