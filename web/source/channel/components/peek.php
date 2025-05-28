<?php
	$url = file_get_contents("../url");
	$attributes = $data["attributes"];

	$path = "";
	$title = "";
	$link = "";
	$description = "";

	if(isset($attributes["image"]))
		$path = $attributes["image"];

	if(isset($attributes["url"]))
		$link = $attributes["url"];

	if(isset($attributes["title"]))
		$title = $attributes["title"];

	if(isset($attributes["description"]))
		$description = $attributes["description"];

	$data["set-skip"] = 1;
?>
<meta property="og:image" content="<?php echo $url . $path; ?>">
<meta property="og:type" content="website">
<meta property="og:url" content="<?php echo $url; ?>">
<meta property="og:title" content="<?php echo $title;  ?>">
<meta property="og:description" content="<?php echo $description; ?>">