<?php require "config.php" ?>
<div class="container">
  <?php
  $stmt_apply = $pdo_apply->prepare("SELECT id,name,chinese,math,english,society,science
                               FROM applyData WHERE name REGEXP ?;");
  $stmt_apply->execute(array($_GET["q"]));
  ?>
  <table id="search_result" class="table table-striped">
    <tr>
      <th width="11%">學校</th>
      <th width="20%">科系</th>
      <th width="5%">國文</th>
      <th width="5%">英文</th>
      <th width="5%">數學</th>
      <th width="5%">社會</th>
      <th width="5%">自然</th>
      <th width="7%">ID</th>
    </tr>
    <?php foreach ($stmt_apply->fetchAll() as $row):?>
    <?php
      $stmt_school = $pdo_apply->prepare("SELECT name FROM schoolData WHERE id=?");
      $schoolid = substr($row["id"],0,3);
      $stmt_school->execute(array($schoolid));
      $schoolname = $stmt_school->fetchAll()[0]["name"];
    ?>
    <?php if(preg_match("/".$_GET["s"]."/",$schoolname)):?>
    <tr>
      <td><?php echo $schoolname?></td>
      <td><?php echo $row["name"]?></td>
      <td><?php echo $row["chinese"]?></td>
      <td><?php echo $row["english"]?></td>
      <td><?php echo $row["math"]?></td>
      <td><?php echo $row["society"]?></td>
      <td><?php echo $row["science"]?></td>
      <td>
      <a href=<?php echo "https://www.cac.edu.tw/apply108/system/108ColQry_forapply_3r5k9d/html/108_".$row["id"].".htm"?>
        target="_blank">
        <?php echo $row["id"]?>
      </a>
      </td>
    </tr>
    <?php endif;?>
    <?php endforeach;?>
  </table>
</div>
