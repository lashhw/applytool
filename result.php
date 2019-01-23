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

$_POST["f1"]=="true" ? $f1="0" : $f1="1";
$_POST["f2"]=="true" ? $f2="0" : $f2="1";
$_POST["f3"]=="true" ? $f3="0" : $f3="1";
$_POST["f4"]=="true" ? $f4="0" : $f4="1";
$_POST["f5"]=="true" ? $f5="0" : $f5="1";

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
      <th width="10%" id="t1" class="subject align-middle">國文</th>
      <th width="10%" id="t2" class="subject align-middle">英文</th>
      <th width="10%" id="t3" class="subject align-middle">數學</th>
      <th width="10%" id="t4" class="subject align-middle">社會</th>
      <th width="10%" id="t5" class="subject align-middle">自然</th>
    </tr>
  </thead>
  <?php
  // search for data whose name and schoolname are regexly match
  $stmt_apply = $pdo_apply->prepare("SELECT id,name,chinese,math,english,society,science,school
                                     FROM applyData WHERE name REGEXP ? AND school REGEXP ?
                                     AND (chinese='--' OR 1=?)
                                     AND (english='--' OR 1=?)
                                     AND (math='--' OR 1=?)
                                     AND (society='--' OR 1=?)
                                     AND (science='--' OR 1=?);");
  try{
    $stmt_apply->execute(array($qd,$qs,$f1,$f2,$f3,$f4,$f5));
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
