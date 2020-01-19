/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
/* global $ */
function getData (location) {
  var data = []
  $.getJSON(location, function (jsonData) {
    for (var x in jsonData) data.push(jsonData[x])
  })
  return data
}

function init () {
  $('#table_result').floatThead()
  $('#advanced_options').on('shown.bs.collapse hidden.bs.collapse', function () {
    $('#table_result').floatThead('reflow')
  })
  $('[data-toggle="tooltip"]').tooltip()
}

function checkName (testData, mode, qd, qs) {
  if (mode === '1') {
    var t1 = testData['name'].toLowerCase().indexOf(qd.toLowerCase()) !== -1
    var t2 = testData['school'].toLowerCase().indexOf(qs.toLowerCase()) !== -1
    return (t1 && t2)
  } else if (mode === '2') {
    var regexQd = new RegExp(qd, 'i')
    var t3 = regexQd.test(testData['name'])
    var regexQs = new RegExp(qs, 'i')
    var t4 = regexQs.test(testData['school'])
    return (t3 && t4)
  }
}
