import { Component, OnInit } from '@angular/core';
import { IUnidadMedida } from '../Interfaces/iunidadmedida';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../theme/shared/shared.module';
import { UnidadmedidaService } from '../Services/unidadmedida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unidadmedida',
  standalone: true,
  imports: [RouterLink, SharedModule],
  templateUrl: './unidadmedida.component.html',
  styleUrl: './unidadmedida.component.scss'
})
export class UnidadmedidaComponent implements OnInit {
  listaunidades: IUnidadMedida[] = [];

  constructor(private unidadServicio: UnidadmedidaService, private router: Router) {}

  ngOnInit(): void {
    this.unidadServicio.todos().subscribe((data) => {
      this.listaunidades = data;
    });
  }

  // Navega al formulario de edición de una unidad de medida
  editarUnidad(idUnidad_Medida: number): void {
    this.router.navigate([`/unidadmedida/editar/${idUnidad_Medida}`]);
  }

  // Método para navegar al formulario de creación de una nueva unidad de medida
  nuevaUnidad(): void {
    this.router.navigate(['/unidadmedida/nueva']);
  }

  // Confirmación para eliminar una unidad de medida
  eliminar(idUnidad_Medida: number): void {
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
        this.unidadServicio.eliminar(idUnidad_Medida).subscribe(() => {
          Swal.fire('Eliminado', 'La unidad de medida ha sido eliminada', 'success');
          // Eliminar la unidad de la lista localmente sin hacer una nueva llamada al servidor
          this.listaunidades = this.listaunidades.filter(unidad => unidad.idUnidad_Medida !== idUnidad_Medida);
        });
      }
    });
  }
}

