<?php
//config file
require "config.php";

// if 'qd' is empty, set it to '(?!.*)'(don't match anything)
if($_GET["qd"]=="")$_GET["qd"]="(?!.*)";
// if 'qs' is empty, set it to '.*'(match any character(s))
if($_GET["qs"]=="")$_GET["qs"]=".*";

// convert id to school name
function getSchoolName($id,$row,$pdo){
  $stmt_school = $pdo->prepare("SELECT name FROM schoolData WHERE id=?");
  // get the first three digits
  $schoolid = substr($row["id"],0,3);
  $stmt_school->execute(array($schoolid));
  $schoolname = $stmt_school->fetchAll()[0]["name"];
  return $schoolname;
}

//convert to formatted string
$table_colors = array(
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
  if(array_key_exists($str,$GLOBALS["table_colors"]))
    return "<td class='subject ".$GLOBALS["table_colors"][$str]."'>".$str."</td>";
  else
    return "<td class='subject td_default'></td>";
}
?>
<div class="container">
  <?php
  // serach for data whose name is regexly match
  $stmt_apply = $pdo_apply->prepare("SELECT id,name,chinese,math,english,society,science
                               FROM applyData WHERE name REGEXP ?;");
  $stmt_apply->execute(array($_GET["qd"]));
  ?>
  <table id="table_result" class="table">
    <thead class="thead-light">
      <tr>
        <th width="20%">學校</th>
        <th width="30%">科系</th>
        <th width="10%" class="subject">國文</th>
        <th width="10%" class="subject">英文</th>
        <th width="10%" class="subject">數學</th>
        <th width="10%" class="subject">社會</th>
        <th width="10%" class="subject">自然</th>
      </tr>
    </thead>

    <!-- loop through every rows which match regex and fliter schoolname -->
    <?php $cnt = 0; ?>
    <?php foreach ($stmt_apply->fetchAll() as $row):?>
      <?php $schoolname = getSchoolName($row["id"],$row,$pdo_apply);?>
      <?php if(preg_match("/".$_GET["qs"]."/",$schoolname)):?>
        <tr>
          <td class='td_default'><?php echo $schoolname?></td>
          <td class='td_default'>
            <!-- link to cac -->
            <a href="<?php echo 'https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/html/108_'.$row['id'].'.htm'?>"
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
      <?php endif;?>
    <?php endforeach;?>
  </table>
</div>
