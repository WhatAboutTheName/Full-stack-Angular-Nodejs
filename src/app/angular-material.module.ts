import { NgModule } from "@angular/core";
import { MatCardModule } from '@angular/material/card';

import { 
    MatInputModule,
    MatToolbarModule,
    MatButtonModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
  ]
})
export class AngularMaterialModule {}