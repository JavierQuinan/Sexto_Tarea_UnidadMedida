import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IvaService } from 'src/app/Services/iva.service';
import { ProveedorService } from 'src/app/Services/proveedores.service';
import { UnidadmedidaService } from 'src/app/Services/unidadmedida.service';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { IIva } from 'src/app/Interfaces/IIva';
import { Iproveedor } from 'src/app/Interfaces/iproveedor';
import { ProductoService } from 'src/app/Services/productos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProducto } from 'src/app/Interfaces/iproducto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevoproducto',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule], // Importar ReactiveFormsModule y FormsModule
  templateUrl: './nuevoproducto.component.html',
  styleUrls: ['./nuevoproducto.component.scss']
})
export class NuevoproductoComponent implements OnInit {
  frm_Producto: FormGroup;
  listaIva: IIva[] = [];
  listaProveedores: Iproveedor[] = [];
  listaUnidadMedida: IUnidadMedida[] = [];
  idProducto: number = 0;
  titulo: string = 'Nuevo Producto'; // Definir la propiedad 'titulo'

  constructor(
    private fb: FormBuilder,
    private ivaService: IvaService,
    private proveedorService: ProveedorService,
    private unidadmedidaService: UnidadmedidaService,
    private productoService: ProductoService,
    private rutaActiva: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatos();

    this.idProducto = this.rutaActiva.snapshot.params['id'];
    if (this.idProducto) {
      this.titulo = 'Editar Producto'; // Cambiar el título si es edición
      this.productoService.uno(this.idProducto).subscribe((producto) => {
        this.frm_Producto.patchValue(producto);
      });
    }
  }

  crearFormulario() {
    this.frm_Producto = this.fb.group({
      Codigo_Barras: ['', Validators.required],
      Nombre_Producto: ['', Validators.required],
      Graba_IVA: ['', Validators.required],
      Unidad_Medida_idUnidad_Medida: ['', Validators.required],
      IVA_idIVA: ['', Validators.required],
      Cantidad: ['', [Validators.required, Validators.min(1)]],
      Valor_Compra: ['', [Validators.required, Validators.min(0)]],
      Valor_Venta: ['', [Validators.required, Validators.min(0)]],
      Proveedores_idProveedores: ['', Validators.required]
    });
  }

  cargarDatos() {
    this.ivaService.todos().subscribe((data) => {
      this.listaIva = data;
    });

    this.proveedorService.todos().subscribe((data) => {
      this.listaProveedores = data;
    });

    this.unidadmedidaService.todos().subscribe((data) => {
      this.listaUnidadMedida = data;
    });
  }

  grabar() {
    const producto: IProducto = this.frm_Producto.value;

    if (this.idProducto === 0) {
      this.productoService.insertar(producto).subscribe(() => {
        Swal.fire('Éxito', 'Producto creado con éxito', 'success');
        this.router.navigate(['/productos']);
      });
    } else {
      this.productoService.actualizar(this.idProducto, producto).subscribe(() => {
        Swal.fire('Éxito', 'Producto actualizado con éxito', 'success');
        this.router.navigate(['/productos']);
      });
    }
  }

  trackByFn(index: number, item: any): number {
    return item.idUnidad_Medida || item.idProveedores || item.idIva;
  }
}
