"use strict";
var data = [];
var results_per_query = 50;
var subjects = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11'];
var subjects_gsat = {
  's1': 2,
  's2': 2,
  's3': 2,
  's4': 2,
  's5': 2,
  's6': 1
};

function init(){
  $('#table_result').floatThead();
  $('#advanced_options').on('shown.bs.collapse hidden.bs.collapse', function () {
    $('#table_result').floatThead('reflow');
  });
}

function getData(){
  $.getJSON('data/advanced/data.json', function(json_data) {
    for(var x in json_data)
      data.push(json_data[x]);
  });
}

function search(mode, qd, qs, start){
  if(qd == '' && qs == '') return [false, []];

  var results = [];
  var cnt = 0;
  for(var i=start; i<data.length; i++){
    if(cnt == results_per_query) return [i, results];
    var test = false;
    if(mode=='2'){
      var regex_qd = new RegExp(qd,'i');
      var regex_qs = new RegExp(qs,'i');
      test = regex_qd.test(data[i]['name']) && regex_qs.test(data[i]['school']);
    }
    else{
      test = data[i]['name'].toLowerCase().indexOf(qd.toLowerCase()) !== -1 &&
             data[i]['school'].toLowerCase().indexOf(qs.toLowerCase()) !== -1;
    }
    if(test){
      results.push(data[i]);
      cnt++;
    }
  }
  return [false, results];
}

function getFormatted(str, colspan, additional_class){
  return "<td class='subject align-middle " + additional_class + "' colspan='" + colspan + "'>" + str + "</td>";
}

function update_table(results){
  var content = '';
  for(var i=0; i<results.length; i++){
    var url = "https://campus4.ncku.edu.tw/uac/cross_search/dept_info/" + results[i]['id'] + ".html";
    content += '<tr>';
    content += "<td class='align-middle' rowspan='2'>" + results[i]['school'] + '</td>';
    content += "<td class='align-middle' rowspan='2'><a href='" + url + "' target='_blank'>" + results[i]['name'] + '</a></td>';
    for(var j=0; j<subjects.length; j++){
      if(subjects[j] in results[i]['subjects']){
        if($(document).width()<768)
          content += getFormatted("採", 1, 'advanced');
        else
          content += getFormatted('x'+results[i]['subjects'][subjects[j]], 1, 'advanced');
      }
      else
        content += getFormatted('--', 1, '');
    }
    content += '</tr><tr>';
    for(var j in subjects_gsat) {
      if(j in results[i]['subjects_gsat']){
          if($(document).width()<768)
            content += getFormatted(results[i]['subjects_gsat'][j].substring(0,1), subjects_gsat[j], 'gsat');
          else
            content += getFormatted(results[i]['subjects_gsat'][j], subjects_gsat[j], 'gsat');
      }
      else
        content += getFormatted('--', subjects_gsat[j], '');
    }
    content += '</tr>'
  }
  $('#result_content').append(content);
}

function update(start){
  if(typeof start === 'undefined'){
    $('#result_content').empty();
    start = 0;
  }
  var tmp = search($('input[name=mode]:checked').val(), $('#qd').val(), $('#qs').val(), start);
  var next_start = tmp[0];
  var results = tmp[1];
  update_table(results);
  if(next_start !== false) {
    $('#more-results').removeClass('d-none')
                      .off('click')
                      .click(function(){
                        update(next_start)
                      });
  }
  else {
    $('#more-results').addClass('d-none');
  }
}

// get data and search automatically when the page is fully loaded
$(document).ready(function(){
  init();
  getData();
  update();
});
