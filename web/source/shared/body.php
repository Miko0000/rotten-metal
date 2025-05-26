<?php ob_start() ?>
<root>
<div class="top bg"></div>
<options class="top">
	<option class="collapse absolute browse invisible">

	</option>
	<option class="icon">

	</option>
	<option class="profile invisible">

	</option>
	<!--<li class="collapse">
		<span>C</span>
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
		</ul>
	</li>-->
</options>
<div class="access-context pseudobg">
	<div class="level">0</div>
	<div class="username">Guest</div>
</div>
</root>
<?php
	$ob = ob_get_clean();
	$opmx = $pmx_path;
	$pmx_path = dirname(__FILE__) . "/../";

	pmx_compile($ob, 1);
	$pmx_path = $opmx;
?>