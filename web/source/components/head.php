<?php
	ob_start();
	include $pmx_path . "/local/head.php";
	$content = ob_get_clean();
	$data["name"] = "head";
	$data["before"] = $content;
?>
