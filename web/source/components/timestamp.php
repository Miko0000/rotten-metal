<div class="timestamp">
<?php
	$data["name"] = "div";
	echo str_replace(
		"\$TIMESTAMP",
		date(DATE_RFC1123, time()),
		(string) $data["xml"]
	);
	$data["set-skip"] = 1;
?>
</div>
