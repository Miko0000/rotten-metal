<?php
	$data["name"] = "div";
	$data["attributes"]["class"] = "pages";
	ob_start();
	echo "<?"

	/*
	<page path="entry/ace" title="Ace"/>
	<page path="entry/alfa" title="Alfa"/>
	<page path="entry/alter" title="Alter"/>
	<page path="entry/atomorphism" title="Atomorphism"/>
	<page path="entry/authoritary" title="Authoritary"/>
	<page path="entry/july" title="July" />
	<page path="entry/project-ascension" title="Project Ascension"/>
	*/
?>
xml version="1.0" encoding="UTF-8"?>
<root>
	<h2>A</h2>
	<h2>B</h2>
	<h2>C</h2>
	<h2>D</h2>
	<h2>E</h2>
	<h2>F</h2>
	<h2>G</h2>
	<h2>I</h2>
	<h2>J</h2>
	<h2>K</h2>
	<h2>L</h2>
	<h2>M</h2>
	<h2>N</h2>
	<h2>O</h2>
	<h2>P</h2>
	<h2>Q</h2>
	<h2>R</h2>
	<h2>S</h2>
	<h2>T</h2>
	<h2>U</h2>
	<h2>V</h2>
	<h2>W</h2>
	<h2>X</h2>
	<h2>Y</h2>
	<h2>Z</h2>
</root>

<?php
	$ostr = $pmx_path;
	$pmx_path = "./local/library/";
	$content = ob_get_clean();
	ob_start();
	pmx_compile($content, 1);
	$content = ob_get_clean();
	$data["after"] = $content;
	$pmx_path = $ostr;
?>
