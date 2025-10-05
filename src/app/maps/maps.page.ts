import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import { DataService } from '../data.service'; //import komponen DataService

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: false,
})
export class MapsPage implements OnInit {
  map!: L.Map;

  private dataService = inject(DataService);
  private router = inject(Router);

  constructor() { }

  async loadPoints() {
    const points: any = await this.dataService.getPoints();
    for (const key in points) {
      if (points.hasOwnProperty(key)) {
        const point = points[key];
        const coordinates = point.coordinates.split(',').map((c: string) => parseFloat(c));
        const marker = L.marker(coordinates as L.LatLngExpression).addTo(this.map);

        const popupContent = `
          <div style="display: flex; align-items: center;">
            <span style="margin-right: 10px;">${point.name}</span>
            <span style="white-space: nowrap;">
              <button id="edit-btn-${key}" style="border: none; background: transparent; cursor: pointer; vertical-align: middle;">
                <ion-icon name="create-outline" style="font-size: 20px; color: #007bff;"></ion-icon>
              </button>
              <button id="delete-btn-${key}" style="border: none; background: transparent; cursor: pointer; vertical-align: middle;">
                <ion-icon name="trash-outline" style="color: red; font-size: 20px;"></ion-icon>
              </button>
            </span>
          </div>
        `;
        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const editBtn = document.getElementById(`edit-btn-${key}`);
          if (editBtn) {
            editBtn.onclick = () => {
              this.editPoint(key);
            };
          }
          const deleteBtn = document.getElementById(`delete-btn-${key}`);
          if (deleteBtn) {
            deleteBtn.onclick = () => {
              this.deletePoint(key, marker);
            };
          }
        });
      }
    }
  }

  editPoint(key: string) {
    this.router.navigate(['/createpoint', key]);
  }

  async deletePoint(key: string, marker: L.Marker) {
    try {
      await this.dataService.deletePoint(key);
      this.map.removeLayer(marker);
      this.map.closePopup();
    } catch (error) {
      console.error('Error deleting point: ', error);
    }
  }


  ngOnInit() {

    this.loadPoints();

    if (!this.map) {
      setTimeout(() => {
        this.map = L.map('map').setView([-7.7956, 110.3695], 13);

        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        });

        osm.addTo(this.map);

        const iconRetinaUrl = 'assets/marker-icon-2x.png';
        const iconUrl = 'assets/marker-icon.png';
        const shadowUrl = 'assets/marker-shadow.png';
        const iconDefault = L.icon({
          iconRetinaUrl,
          iconUrl,
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;


      });
    }
  }


}
