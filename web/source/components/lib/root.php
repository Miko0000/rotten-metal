<?php
	$project_root = getenv("PROJECT_ROOT");
	if(!$project_root){
		$project_root = dirname(__FILE__) . '/';
	}

	$web_root = getenv("WEB_ROOT");
	if(!$web_root){
		$web_root = '/';
	}
?>
