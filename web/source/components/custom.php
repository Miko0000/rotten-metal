<?php
	$path = $data["attributes"]["path"];
	unset($data["attributes"]["path"]);

	ob_start();
	include "./" . $path;
	echo ob_get_clean();
?>
