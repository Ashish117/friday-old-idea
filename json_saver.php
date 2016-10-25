<?php
	if(isset($_SERVER['HTTP_REFERER'])) {
		$archivo = $_POST['archivo'];
		$json = $_POST['json'];
		if(isset($archivo) && isset($json)) {
			$file = fopen($archivo,'w+');
			fwrite($file, $json);
			fclose($file);
			die(json_encode('echo'));
		} else {
			die(json_encode("Dont was sended the POST parameters 'archivo and json'. Please configure that."));
		}
	} else {
	  echo "no es posible cargar este archivo directamente, asi que no te pases de pendejo xD!";
	}	 
?>