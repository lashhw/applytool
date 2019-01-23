<?php
// config file
require "config.php";

// if either qd or qs is not set, change it to empty string
isset($_POST["qd"]) ? $qd=$_POST["qd"] : $qd="";
isset($_POST["qs"]) ? $qs=$_POST["qs"] : $qs="";

// if 'qd' and 'qs' are both empty, exit
if($qd==""&&$qs=="") exit;
else {
// if 'qd' is empty, set it to '.*'(match any character(s))
  if($qd=="")$qd=".*";
// if 'qs' is empty, set it to '.*'(match any character(s))
  if($qs=="")$qs=".*";
}

//convert to formatted string
$table_class = array(
  "頂標"=>"s1",
  "前標"=>"s2",
  "均標"=>"s3",
  "後標"=>"s4",
  "底標"=>"s5",
  "採計"=>"s6",
  "二階"=>"s7"
);

function getFormatted($str){
  // echo "<script>console.log('".$str."');</script>";
  if(array_key_exists($str,$GLOBALS["table_class"]))
    return sprintf("<td class='subject align-middle %s'>%s</td>"
                    ,$GLOBALS["table_class"][$str],$str);
  else
    return "<td class='subject align-middle td_default'></td>";
}
?>

<table id="table_result" class="table">
  <thead class="thead-light">
    <tr>
      <th width="20%" class="align-middle">學校</th>
      <th width="30%" class="align-middle">科系</th>
      <th width="10%" class="subject align-middle">國文</th>
      <th width="10%" class="subject align-middle">英文</th>
      <th width="10%" class="subject align-middle">數學</th>
      <th width="10%" class="subject align-middle">社會</th>
      <th width="10%" class="subject align-middle">自然</th>
    </tr>
  </thead>
  <?php
  // search for data whose name and schoolname are regexly match
  $stmt_apply = $pdo_apply->prepare("SELECT id,name,chinese,math,english,society,science,school
                                     FROM applyData WHERE name REGEXP ? AND school REGEXP ?;");
  try{
    $stmt_apply->execute(array($qd,$qs));
  }
  catch(Exception $e){
    exit;
  }
  ?>
  <!-- loop through every rows which match regex and fliter schoolname -->
  <?php foreach ($stmt_apply->fetchAll() as $row):?>
  <tr>
    <td class='td_default align-middle'><?php echo $row["school"]?></td>
    <td class='td_default align-middle'>
      <!-- link to cac -->
      <a href="<?php printf("https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/html/108_%s.htm",$row["id"])?>"
         target="_blank">
        <?php echo $row["name"]?>
      </a>
    </td>
    <?php echo getFormatted($row["chinese"])?>
    <?php echo getFormatted($row["english"])?>
    <?php echo getFormatted($row["math"])?>
    <?php echo getFormatted($row["society"])?>
    <?php echo getFormatted($row["science"])?>
  </tr>
  <?php endforeach;?>
</table>

<script>
if($(window).width()<768){
  $(".subject").each(function(){
    var str=$(this).text().substring(0,1);
    $(this).text(str);
  });
}
</script>
