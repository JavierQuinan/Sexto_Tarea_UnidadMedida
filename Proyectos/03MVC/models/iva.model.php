<?php
// Incluir la configuración de la base de datos
require_once('../config/config.php');

class IVA
{
    // Función para obtener todos los valores de IVA
    public function todos() 
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();

        // Consulta SQL para obtener los detalles del IVA
        $query = "SELECT idIVA, Detalle, Estado, Valor FROM iva WHERE 1";
        
        // Ejecutar la consulta y almacenar el resultado
        $result = mysqli_query($con, $query);

        // Cerrar la conexión a la base de datos
        $con->close();

        // Devolver el resultado de la consulta
        return $result;
    }
}
?>