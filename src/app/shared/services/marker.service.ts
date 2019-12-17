import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private http: HttpClient) {}

  getMapMarkers(): Observable<any> {
    return this.http.get(`${environment.URL}`);
  }
}
