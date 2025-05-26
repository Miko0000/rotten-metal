<?php
  if(!file_exists("source")){
    echo "Cannot find source directory =(";
    
    exit;
  }
  
  if(!is_dir("source")){
    echo "Source is not a directory.";
    
    exit;
  }
  
  function compile_dir($path, $dest){
    $dir_handle = opendir($path);
    $entry;
    while(false !== ($entry = readdir($dir_handle))){
      if($entry === "." || $entry === "..")
        continue ;
        
      if(is_link("{$path}/{$entry}")){
	$link = readlink("${path}/${entry}");
        if(str_ends_with($link, ".php")){
          continue ;
        }

        symlink($link, "${dest}/${entry}");
        
        continue ;
      }
      
      if(is_dir("{$path}/{$entry}")){
        if(!file_exists("{$dest}/{$entry}")){
          mkdir("{$dest}/{$entry}");
        }
        
        echo "DIR {$path}/{$entry}...\n";
        
        compile_dir("{$path}/{$entry}", "{$dest}/{$entry}");
        
        continue;
      }
      
      #$dest = str_replace($path, "source/", "result/", 1);
      
      #echo "Doing {$dest}/{$entry}...\n";
      
      $destEntry = $entry;
      $info = pathinfo($entry);
      if($info["extension"] == "php"){
        $destEntry = "{$info["filename"]}.html";

        echo "PHP {$path}/${entry}... \n";

        file_put_contents(__DIR__ . "/{$dest}/{$destEntry}",
          shell_exec("cd ${path} && php ${entry}")
        );
      } else {
        echo "FILE {$path}/${entry}... \n";

        file_put_contents(__DIR__ . "/{$dest}/{$destEntry}",
          shell_exec("cd ${path} && cat ${entry}")
        );
      }

      /*
      if($info["extension"] == "link"){
        $destEntry = "{$info["filename"]}";

        shell_exec("cd ${path} && "
          . "rm ${__DIR__}/${dest}/${$destEntry} &&"
          . "cp -L -r ${entry} ${__DIR__}/${dest}/${$destEntry}"
        );

        continue ;
      }
      */
    }
  }

  function resolve_links($path, $dest){
    $dir_handle = opendir($path);
    $entry;
    while(false !== ($entry = readdir($dir_handle))){
      if($entry === "." || $entry === "..")
        continue ;

      // need a rewrite (?)
      if(is_link($path)){
        $link = readlink($path);
        $dir = pathinfo($path);
        $dir = $dir["dirname"];
        $link = realpath($dir . '/' . $link);
	$rpath = realpath($path);

        echo "RL DEBUG " . $link . "|" . $rpath;
        if(substr($link, 0, strlen($rpath)) == $rpath){
          continue ;
        }
      }

      $info = pathinfo($entry);

      if($info["extension"] == "link"){
        $destEntry = "{$info["filename"]}";

        echo "RL " . __DIR__ . "/{$dest}/{$destEntry}";

        shell_exec("cd {$path} && "
          . "rm " . __DIR__ ."/{$dest}/{$destEntry} && "
          . "cp -L -r {$entry} " . __DIR__ . "/{$dest}/{$destEntry} && "
          . "rm " . __DIR__ . "/{$dest}/{$entry}"
        );

        continue ;
      }

      if(is_dir("{$path}/{$entry}")){
        if(!file_exists("{$dest}/{$entry}")){
          mkdir("{$dest}/{$entry}");
        }

        echo "RL_DIR {$path}/{$entry}...\n";

        resolve_links("{$path}/{$entry}", "{$dest}/{$entry}");

        continue;
      }

    }
  }
  
  compile_dir("source", "result");
  resolve_links("source", "result");
  
  $exclude_str = file_get_contents("exclude.list");
  $exclude_list = preg_split("/\r\n|\n|\r/", $exclude_str);
  $exclude_current;
  
  if(!$exclude_list){
    $exclude_list = $exclude_str;
  }
  
  while(false !== ($exclude_current = next($exclude_list))){
    echo "EXCLUDE $exclude_current\n";
    
    shell_exec("rm -r result/$exclude_current");
  }
?>
