import { ref, push, onValue, remove, get, update } from 'firebase/database';
import { database } from './firebase.service';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Save a new point
  savePoint(point: { name: string, coordinates: string }) {
    const pointsRef = ref(database, 'points');
    return push(pointsRef, point);
  }

  //Get all Point
  getPoints() {
    const pointsRef = ref(database, 'points');
    return new Promise((resolve, reject) => {
      onValue(pointsRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }



}
