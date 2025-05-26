<?php
	$attributes = $data["attributes"];
	$title = "";
	if(isset($attributes["title"]))
		$title = $attributes["title"];

	ob_start();
?>
<nav>
	<a href="../" onclick="history.back()" class="icon back"></a>
	<h2 class="title"><?php echo $title; ?></h2>
</nav>
<?php
	$nav = ob_get_clean();
	if(!isset($attributes["nav"]) || $attributes["nav"] != "none")
		echo $nav;

	include "shared/body.php";
?>