<?php
	$pmx_path = "./";
	
	function pmx_compile_component(&$data, &$shared){
		global $abort; $abort = false;
		global $pmx_path;
		global $dirname;
		
		// ignore failed include when including components
		set_error_handler(function($errno){
			// This function broken
			global $abort;
			//ob_get_clean();
			
			// if the include fails simply because the file
			// is not found then supress warning message.
			if($errno == 2){
				//$abort = true;
				// don't execute internal error handler
				
				return true;
			}
			
			return false;
		}, E_WARNING);
		
		ob_start();
		
		include $pmx_path . "/components/" . $data["name"] . ".php";
		
		$content = trim(ob_get_clean());
		
		restore_error_handler();
		if($abort == true)
			return '';
		
		//var_dump($data["depth"]);
		
		$EOL = ["\r\n", "\r", "\n"];
		
		$content = str_repeat("\t", $data["depth"] - 1) . $content;
		$content = str_replace(PHP_EOL
			, PHP_EOL . str_repeat("\t", $data["depth"] - 1)
			, $content
		);
		
		// echo "[DEBUG] content: " . $content . PHP_EOL;
		
		return $content . PHP_EOL;
	}
	
	function pmx_element_attributes_array($element){
		$result = [];
	
		foreach($element->attributes() as $key => $value)
			$result[$key] = $value;
		;
		
		return $result;
	}
	
	function pmx_element_attributes_array_toString(&$array){
		$result = '';
	
		foreach($array as $key => $value)
			$result .= $key . '="' . $value . '" '
		;
		
		return $result;
	}
	
	function pmx_elAttArrToString(&$array){
		return pmx_element_attributes_array_toString($array);
	}
	
	function pmx_element_attributes_string(&$element){
		$result = '';
	
		foreach($element->attributes() as $key => $value)
			$result .= $key . '="' . $value . '" '
		;
		
		return $result;
	}
	
	function pmx_compile_element(&$root, $depth = 1, &$shared = []){
		//usleep((int)(0.1 * 1000000));
		$data = [];
		$data["name"] = $root->getName();
		$data["attributes"] = pmx_element_attributes_array(
			$root
		);
		$data["depth"] = $depth;
		$data["xml"] = &$root;
		
		$data["set-sct"] = "normal";
		$data["before"] = '';
		$data["after"] = '';
		
		//$data["attributes"]["added"] = "by PMX";
		
		$component = pmx_compile_component($data, $shared);
		
		if(key_exists("set-skip", $data)){
			echo $component . PHP_EOL;
		
			return ;
		}
	
		if($root->count() == 0){
			$content = (string) $root;
			$content .= $component;
			$content = $data["before"] . $content;
			$content .= $data["after"];
			
			if($content || $data["set-sct"] == "none")
				echo str_repeat("\t", $depth + 1)
					. "<" . $data["name"] . " "
					. pmx_elAttArrToString(
						$data["attributes"]
					)
					. " >"
					. PHP_EOL
					, str_repeat("\t", $depth + 1)
						. "\t" . str_replace('\n', '\n'
							. str_repeat(
								"\t",
								$depth + 1
							)
							, $content
						)
						. PHP_EOL
						. str_repeat("\t", $depth + 1)
						. "</" . $data["name"] . ">"
						. PHP_EOL
			; else
				echo str_repeat("\t", $depth + 1)
					. "<" . $data["name"] . " "
					. pmx_elAttArrToString(
						$data["attributes"]
					)
					. " />"
					. PHP_EOL
			;
			
			return ;
		}
		
		echo str_repeat("\t", $depth + 1) . "<" . $data["name"] . " "
			. pmx_elAttArrToString($data["attributes"])
			. " >"
			. PHP_EOL
		;
		echo $data["before"];
		echo $component;
		foreach($root as $element)
			pmx_compile_element($element, $depth + 1, $shared)
		;
		echo $data["after"];
		echo str_repeat("\t", $depth + 1)
			. "</" . $data["name"] . ">"
			. PHP_EOL
		;
	}
	
	function pmx_compile($xmlstr, $no_add = null){
		$xml = new SimpleXMLElement($xmlstr);
		
		header('Content-type: application/xhtml+xml');
		
		if(!$no_add){
			echo "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>"
				. PHP_EOL
			;
			echo "<html xmlns=\"http://www.w3.org/1999/xhtml\" "
				. "xml:lang=\"en-US\">"
				. PHP_EOL
			;
		}
		
		//echo '#'; var_dump($xmlstr); echo '#';
		
		foreach($xml as $element)
			pmx_compile_element($element)
		;
		
		if(!$no_add){
			echo "</html>"
				. PHP_EOL
			;
		}
	}
?>
