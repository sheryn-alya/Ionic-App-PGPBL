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

  // Get a single point by key
  getPoint(key: string) {
    const pointRef = ref(database, `points/${key}`);
    return get(pointRef);
  }

  // Update a point
  updatePoint(key: string, point: { name: string, coordinates: string }) {
    const pointRef = ref(database, `points/${key}`);
    return update(pointRef, point);
  }

  // Delete a point
  deletePoint(key: string) {
    const pointRef = ref(database, `points/${key}`);
    return remove(pointRef);
  }

}
