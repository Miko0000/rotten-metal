<?php
	$data["name"] = "a";
	$data["attributes"]["class"] = "entry page pages-"
		. str_replace('/', "__", $data["attributes"]["path"])
	;

	$title = "";
	$thumbnail = "shared/res/library-blank.png";
	if(isset($data["attributes"]["path"])){
		$title = $data["attributes"]["path"];
		$data["attributes"]["href"] = $title;
	}

	if(isset($data["attributes"]["title"]))
		$title = $data["attributes"]["title"];

	if(isset($data["attributes"]["thumbnail"]))
		$thumbnail = $data["attributes"]["thumbnail"];

	unset($data["attributes"]["path"]);
	unset($data["attributes"]["name"]);
?>

<img src="<?php echo $thumbnail; ?>" class="thumbnail" alt="page-icon"/>
<p><?php echo $title; ?></p>
