import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatepointPage } from './createpoint.page';

const routes: Routes = [
  {
    path: '',
    component: CreatepointPage
  },
  {
    path: ':key',
    component: CreatepointPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatepointPageRoutingModule {}
