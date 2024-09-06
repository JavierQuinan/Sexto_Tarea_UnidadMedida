<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}

// Controlador de IVA - Solo para seleccionar todos los registros
require_once('../models/iva.model.php');

$iva = new IvaModel();

switch ($_GET["op"]) {
    case "todos":  // Procedimiento para cargar todos los IVA disponibles
        $datos = array();
        $datos = $iva->todos();
        while ($row = mysqli_fetch_assoc($datos)) {
            $todas[] = $row;
        }
        echo json_encode($todas);
        break;

    default:
        echo json_encode(["error" => "Invalid operation."]);
        break;
}
?>
