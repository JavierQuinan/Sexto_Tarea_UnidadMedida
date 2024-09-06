import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iproveedor } from 'src/app/Interfaces/iproveedor';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { ProveedorService } from 'src/app/Services/proveedores.service';
import { UnidadmedidaService } from 'src/app/Services/unidadmedida.service';
import Swal from 'sweetalert2';
import { IProducto } from 'src/app/Interfaces/iproducto'; // Asegúrate de que la interfaz esté bien definida
import { ProductoService } from 'src/app/Services/productos.service';

@Component({
  selector: 'app-nuevoproducto',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './nuevoproducto.component.html',
  styleUrls: ['./nuevoproducto.component.scss']
})
export class NuevoproductoComponent implements OnInit {
  listaUnidadMedida: IUnidadMedida[] = [];
  listaProveedores: Iproveedor[] = [];
  titulo = '';
  frm_Producto: FormGroup;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private unidadMedidaService: UnidadmedidaService, // Servicio para obtener las unidades de medida
    private proveedorService: ProveedorService // Servicio para obtener los proveedores
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatosIniciales();
  }

  crearFormulario() {
    this.frm_Producto = new FormGroup({
      Codigo_Barras: new FormControl('', Validators.required),
      Nombre_Producto: new FormControl('', Validators.required),
      Graba_IVA: new FormControl('', Validators.required),
      Unidad_Medida_idUnidad_Medida: new FormControl('', Validators.required),
      IVA_idIVA: new FormControl('', Validators.required),
      Cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      Valor_Compra: new FormControl('', [Validators.required, Validators.min(0)]),
      Valor_Venta: new FormControl('', [Validators.required, Validators.min(0)]),
      Proveedores_idProveedores: new FormControl('', Validators.required)
    });
  }

  cargarDatosIniciales() {
    // Cargar las unidades de medida
    this.unidadMedidaService.todos().subscribe((data: IUnidadMedida[]) => {
      this.listaUnidadMedida = data;
    });

    // Cargar los proveedores
    this.proveedorService.todos().subscribe((data: Iproveedor[]) => {
      this.listaProveedores = data;
    });
  }

  grabar() {
    let producto: IProducto = this.frm_Producto.value; // Obtener los datos del formulario

    // Comprobar si es una inserción o actualización
    if (!producto.idProductos) {
      // Inserción
      this.productoService.insertar(producto).subscribe(() => {
        Swal.fire('Éxito', 'Producto guardado con éxito', 'success');
        this.resetFormulario();
      });
    } else {
      // Actualización
      this.productoService.actualizar(producto).subscribe(() => {
        Swal.fire('Éxito', 'Producto actualizado con éxito', 'success');
        this.resetFormulario();
      });
    }
  }

  resetFormulario() {
    this.frm_Producto.reset();
  }
}
