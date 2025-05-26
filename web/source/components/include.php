<?php
	$path = $data["attributes"]["path"];
	unset($data["attributes"]["path"]);
	$data["name"] = "div";
	$data["attributes"]["class"] = "include";

	ob_start();
	include "./" . $path;
	echo ob_get_clean();
?>
