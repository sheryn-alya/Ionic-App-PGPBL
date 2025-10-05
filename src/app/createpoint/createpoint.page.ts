import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from '../data.service';

//import komponen dan variabel
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-createpoint',
  templateUrl: './createpoint.page.html',
  styleUrls: ['./createpoint.page.scss'],
  standalone: false,
})
export class CreatepointPage implements OnInit {
  map!: L.Map;

  name = '';
  coordinates = '';
  isEditMode = false;
  private pointKey: string | null = null;

  private navCtrl = inject(NavController);
  private alertCtrl = inject(AlertController);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);

  constructor() { }

  ngOnInit() {
    this.pointKey = this.route.snapshot.paramMap.get('key');
    this.isEditMode = !!this.pointKey;

    setTimeout(() => {
      if (this.isEditMode && this.pointKey) {
        this.dataService.getPoint(this.pointKey).then(snapshot => {
          const point:any = snapshot.val();
          this.name = point.name;
          this.coordinates = point.coordinates;
          this.setupMap(point.coordinates);
        });
      } else {
        this.setupMap();
      }
    });
  }

  setupMap(coords?: string) {
    const initialCoords = coords ? coords.split(',').map(c => parseFloat(c)) : [-7.7956, 110.3695];
    this.map = L.map('mapcreate').setView(initialCoords as L.LatLngExpression, 13);

    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'ESRI'
    });

    osm.addTo(this.map);

    var baseMaps = {
      "OpenStreetMap": osm,
      "Esri World Imagery": esri
    };

    L.control.layers(baseMaps).addTo(this.map);

    var tooltip = 'Drag the marker or move the map<br>to change the coordinates<br>of the location';
    var marker = L.marker(initialCoords as L.LatLngExpression, { draggable: true });
    marker.addTo(this.map);
    marker.bindPopup(tooltip);
    marker.openPopup();

    marker.on('dragend', (e) => {
      let latlng = e.target.getLatLng();
      this.coordinates = `${latlng.lat.toFixed(9)},${latlng.lng.toFixed(9)}`;
    });
  }

  async save() {
    if (this.name && this.coordinates) {
      try {
        if (this.isEditMode && this.pointKey) {
          await this.dataService.updatePoint(this.pointKey, { name: this.name, coordinates: this.coordinates });
        } else {
          await this.dataService.savePoint({ name: this.name, coordinates: this.coordinates });
        }
        this.navCtrl.navigateBack('/maps');
      } catch (error: any) {
        const alert = await this.alertCtrl.create({
          header: this.isEditMode ? 'Update Failed' : 'Save Failed',
          message: error.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
