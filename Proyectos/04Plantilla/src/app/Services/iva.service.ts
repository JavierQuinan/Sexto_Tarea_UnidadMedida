import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIva } from '../Interfaces/IIva';

@Injectable({
  providedIn: 'root'
})
export class IvaService {
  private apiurl = 'http://localhost/Sexto/Proyectos/03MVC/controllers/iva.controller.php?op=';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los IVAs
  todos(): Observable<IIva[]> {
    return this.http.get<IIva[]>(`${this.apiurl}todos`);
  }

  // Método para obtener un solo IVA
  uno(idIva: number): Observable<IIva> {
    return this.http.get<IIva>(`${this.apiurl}uno&idIva=${idIva}`);
  }

  // Método para insertar un nuevo IVA
  insertar(nuevoIva: IIva): Observable<IIva> {
    const formData = new FormData();
    formData.append('descripcion', nuevoIva.descripcion);
    formData.append('valor', nuevoIva.valor.toString());
    return this.http.post<IIva>(this.apiurl + 'insertar', formData);
  }

  // Método para actualizar un IVA existente
  actualizar(iva: IIva): Observable<IIva> {
    const formData = new FormData();
    formData.append('idIva', iva.idIva.toString());
    formData.append('descripcion', iva.descripcion);
    formData.append('valor', iva.valor.toString());
    return this.http.post<IIva>(this.apiurl + 'actualizar', formData);
  }

  // Método para eliminar un IVA
  eliminar(idIva: number): Observable<void> {
    return this.http.delete<void>(`${this.apiurl}eliminar&idIva=${idIva}`);
  }
}
