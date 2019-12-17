import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { MarkerService } from '../../shared/services/marker.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'll-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map: L.map;
  private destroy$ = new Subject();

  constructor(private markerService: MarkerService) {}

  private initMap() {
    // привязываем к id в разметке
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 5,
      attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    // ADD TILES LAYER
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    tiles.addTo(this.map);
  }

  // БЛАГОДАРЯ ЭТОМУ LIFECYCLE HOOK УДОСТОВЕРЯЕМСЯ, ЧТО КОРНЕВОЙ VIEW И ВСЕ ДОЧЕРНИЕ VIEWS ПРИЛОЖЕНИЯ УСПЕШНО ОТРЕНДЕРЕНЫ
  ngAfterViewInit(): void {
    this.initMap();
    this.markerService
      .getMapMarkers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        for (const coor of res.features) {
          const lat = coor.geometry.coordinates[0];
          const lon = coor.geometry.coordinates[1];
          L.marker([lon, lat]).addTo(this.map);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
