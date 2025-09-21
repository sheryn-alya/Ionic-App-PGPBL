import { Component } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  public actionSheetButtons = [
    {
      text: 'Hapus',
      role: 'destructive',
      data: { action: 'delete' },
      handler: () => {
        console.log('Delete clicked');
      }
    },
    {
      text: 'Bagikan',
      data: { action: 'share' },
      handler: () => {
        console.log('Share clicked');
      }
    },
    {
      text: 'Batal',
      role: 'cancel',
      data: { action: 'cancel' },
    },
  ];

  constructor() {}
}
