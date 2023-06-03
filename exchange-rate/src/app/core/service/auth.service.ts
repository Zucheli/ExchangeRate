import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Envs
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = `${environment.baseUrlApi}`;
  private keyApi = `${environment.keyApi}`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  getCurrentExchangeRate(code: any): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}/open/currentExchangeRate?apiKey=${this.keyApi}&from_symbol=BRL&to_symbol=${code}`
    );
  }
}
