<?php
	function pbar($text, $percentage, $classes = ""){
		ob_start();

		include "pbar.html";

		return ob_get_clean();
	}
?>