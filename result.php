<?php
//config file
require "config.php";

// if 'qd' and 'qs' are both empty, exit
if($_GET["qd"]=="" && $_GET["qs"]=="") exit;
else {
// if 'qd' is empty, set it to '.*'(match any character(s))
  if($_GET["qd"]=="")$_GET["qd"]=".*";
// if 'qs' is empty, set it to '.*'(match any character(s))
  if($_GET["qs"]=="")$_GET["qs"]=".*";
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
    return "<td class='subject ".$GLOBALS["table_class"][$str]."'>".$str."</td>";
  else
    return "<td class='subject td_default'></td>";
}
?>

<div class="container">
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
    <?php
    // search for data whose name and schoolname are regexly match
    $stmt_apply = $pdo_apply->prepare("SELECT id,name,chinese,math,english,society,science,school
                                       FROM applyData WHERE name REGEXP ? AND school REGEXP ?;");
    $stmt_apply->execute(array($_GET["qd"],$_GET["qs"]));
    ?>
    <!-- loop through every rows which match regex and fliter schoolname -->
    <?php foreach ($stmt_apply->fetchAll() as $row):?>
      <tr>
        <td class='td_default'><?php echo $row["school"]?></td>
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
    <?php endforeach;?>
  </table>
</div>
