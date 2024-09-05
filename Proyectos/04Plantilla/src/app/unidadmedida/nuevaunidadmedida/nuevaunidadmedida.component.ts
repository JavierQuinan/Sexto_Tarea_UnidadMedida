import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { UnidadmedidaService } from '../../Services/unidadmedida.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule

@Component({
  selector: 'app-nuevaunidadmedida',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],  // Agrega CommonModule aquí
  templateUrl: './nuevaunidadmedida.component.html',
  styleUrl: './nuevaunidadmedida.component.scss'
})
export class NuevaunidadmedidaComponent implements OnInit {
  titulo = 'Nueva Unidad de Medida';
  frm_UnidadMedida: FormGroup;
  idUnidadMedida = 0;

  constructor(
    private unidadService: UnidadmedidaService,
    private navegacion: Router,
    private ruta: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.frm_UnidadMedida = new FormGroup({
      Detalle: new FormControl('', [Validators.required]),
      Tipo: new FormControl('', [Validators.required])
    });

    // Obtener id desde la URL para edición
    this.idUnidadMedida = parseInt(this.ruta.snapshot.paramMap.get('id') || '0');
    
    if (this.idUnidadMedida > 0) {
      // Cargar los datos si es edición
      this.unidadService.uno(this.idUnidadMedida).subscribe((unidad) => {
        this.frm_UnidadMedida.get('Detalle')?.setValue(unidad.Detalle);
        this.frm_UnidadMedida.get('Tipo')?.setValue(unidad.Tipo);
        this.titulo = 'Actualizar Unidad de Medida';
      });
    }
  }

  grabar() {
    let unidadmedida: IUnidadMedida = {
      Detalle: this.frm_UnidadMedida.get('Detalle')?.value,
      Tipo: this.frm_UnidadMedida.get('Tipo')?.value
    };

    if (this.idUnidadMedida == 0) {
      this.unidadService.insertar(unidadmedida).subscribe(() => {
        Swal.fire('Éxito', 'La unidad de medida se grabó con éxito', 'success');
        this.navegacion.navigate(['/unidadmedida']);
      });
      // Acción de actualizar
    } else {
      unidadmedida.idUnidad_Medida = this.idUnidadMedida;
      this.unidadService.actualizar(unidadmedida).subscribe(() => {
        Swal.fire('Éxito', 'La unidad de medida se actualizó con éxito', 'success');
        this.navegacion.navigate(['/unidadmedida']);
      });
    }
  }
 // Acción eliminar
  eliminar() {
    if (this.idUnidadMedida > 0) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.unidadService.eliminar(this.idUnidadMedida).subscribe(() => {
            Swal.fire('Eliminado', 'La unidad de medida ha sido eliminada', 'success');
            this.navegacion.navigate(['/unidadmedida']);
          });
        }
      });
    }
  }
}
