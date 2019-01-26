"use strict";
var data = [];
var subjects = ['chinese', 'english', 'math', 'society', 'science'];
var subject_index = {
  "頂標": "s1",
  "前標": "s2",
  "均標": "s3",
  "後標": "s4",
  "底標": "s5",
  "採計": "s6",
  "二階": "s7"
};

function getData(){
  $.getJSON('data/data.json', function(json_data) {
    for(var x in json_data)
      data.push(json_data[x]);
  });
}

function search(qd, qs, c){
  if(qd == '' && qs == '') return [];

  var results = [];
  for(var i=0; i<data.length; i++){
    if(data[i]['name'].toLowerCase().indexOf(qd.toLowerCase())>=0 && data[i]['school'].toLowerCase().indexOf(qs.toLowerCase())>=0){
      var flag = true;
      for(var j=0; j<5; j++){
        if(data[i][subjects[j]]=='--' && c[j]=='2') flag = false;
        if(data[i][subjects[j]]!='--' && c[j]=='3') flag = false;
      }
      if(flag) results.push(data[i]);
    }
  }
  return results;
}

function getFormatted(str){
  if(str in subject_index){
    return "<td class='subject align-middle " + subject_index[str] + "'>" + str + "</td>";
  }
  return "<td class='subject align-middle'>" + str + "</td>";
}

function update(){
  $(".loading").show();

  // clear table
  $('#result_content').empty();
  var results = search($('#qd').val(), $('#qs').val(), [$('#s1').val(),
                                                        $('#s2').val(),
                                                        $('#s3').val(),
                                                        $('#s4').val(),
                                                        $('#s5').val()]);
  var content = '';
  for(var i=0; i<results.length; i++){
    var url = "https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/html/108_" + results[i]['id'] + ".htm";
    content += '<tr>';
    content += '<td>' + results[i]['school'] + '</td>';
    content += "<td><a href='" + url + "'>" + results[i]['name'] + '</a></td>';
    for(var j=0; j<subjects.length; j++)
      content += getFormatted(results[i][subjects[j]]);
    content += '</tr>';
  }
  $('#result_content').append(content);

  $(".loading").hide();
}
