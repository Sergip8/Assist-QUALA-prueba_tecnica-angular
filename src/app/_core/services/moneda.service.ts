import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Moneda } from "../../models/moneda.model";
import { firstValueFrom } from "rxjs";



const baseUrl = `${environment.API_URL}/moneda`;

@Injectable({
  providedIn: 'root'
})
export class monedaService {
  constructor(private http: HttpClient, ) {}


    getMonedas(query: string){
        const url = `${baseUrl}/search?query=${encodeURIComponent(query)}`;
        return firstValueFrom(this.http.get<any[]>(url)).then(resultados =>
    resultados.map(moneda => ({
      id: moneda.idMoneda,
      nombre: moneda.nombre
    }))
  );
    }
}