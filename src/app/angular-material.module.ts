import { NgModule } from "@angular/core";

import { 
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule
  ]
})
export class AngularMaterialModule {}