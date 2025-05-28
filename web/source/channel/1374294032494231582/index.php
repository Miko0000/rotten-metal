<?php
	include "shared/php/php-my-xml.php";
	$pmx_path = dirname(__FILE__);

	pmx_compile(file_get_contents("index.xhtml"));
?>