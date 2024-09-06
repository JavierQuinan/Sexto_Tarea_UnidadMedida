import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iproveedor } from 'src/app/Interfaces/iproveedor';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { ProveedorService } from 'src/app/Services/proveedores.service';
import { UnidadmedidaService } from 'src/app/Services/unidadmedida.service';
import { ProductoService } from 'src/app/Services/productos.service';
import { IProducto } from 'src/app/Interfaces/iproducto';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevoproducto',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './nuevoproducto.component.html',
  styleUrl: './nuevoproducto.component.scss'
})
export class NuevoproductoComponent implements OnInit {
  listaUnidadMedida: IUnidadMedida[] = [];
  listaProveedores: Iproveedor[] = [];
  titulo = 'Nuevo Producto';
  frm_Producto: FormGroup;
  idProducto: number = 0;

  constructor(
    private uniadaServicio: UnidadmedidaService,
    private fb: FormBuilder,
    private proveedoreServicio: ProveedorService,
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uniadaServicio.todos().subscribe((data) => (this.listaUnidadMedida = data));
    this.proveedoreServicio.todos().subscribe((data) => (this.listaProveedores = data));
    
    // Obtener ID del producto si existe
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idProducto = parseInt(idParam);
      this.titulo = 'Editar Producto';
      this.productoService.uno(this.idProducto).subscribe((producto) => {
        this.frm_Producto.patchValue(producto);
      });
    }
    
    this.crearFormulario();
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

  grabar() {
    const producto: IProducto = this.frm_Producto.value;

    if (this.idProducto === 0) {
      // Insertar nuevo producto
      this.productoService.insertar(producto).subscribe(() => {
        Swal.fire('Éxito', 'Producto creado con éxito', 'success');
        this.router.navigate(['/productos']);
      });
    } else {
      // Actualizar producto existente
      producto.idProductos = this.idProducto;
      this.productoService.actualizar(producto).subscribe(() => {
        Swal.fire('Éxito', 'Producto actualizado con éxito', 'success');
        this.router.navigate(['/productos']);
      });
    }
  }
}
