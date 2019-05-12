/* eslint-disable no-extend-native */
/* eslint-disable no-unused-vars */

function isInSmallDevice () {
  return $(document).width() < 768
}

function isInArray (value, array) {
  return array.indexOf(value) > -1
}

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

function search (data, mode, qd, qs, limit, start, additionalRule = []) {
  if (qd === '' && qs === '') return [-1, []]

  var results = []
  var cnt = 0
  for (var i = start; i < data.length; i++) {
    if (cnt === limit) return [i, results]
    var test = false
    var testData = data[i]

    if (mode === '1') {
      var t1 = testData['name'].toLowerCase().indexOf(qd.toLowerCase()) !== -1
      var t2 = testData['school'].toLowerCase().indexOf(qs.toLowerCase()) !== -1
      test = t1 && t2
    } else if (mode === '2') {
      var regexQd = new RegExp(qd, 'i')
      var t3 = regexQd.test(testData['name'])
      var regexQs = new RegExp(qs, 'i')
      var t4 = regexQs.test(testData['school'])
      test = t3 && t4
    }

    var ta = true
    for (var x in additionalRule) {
      if (!isInArray(testData[x], additionalRule[x])) ta = false
    }

    if (test && ta) {
      results.push(testData)
      cnt++
    }
  }
  return [-1, results]
}
