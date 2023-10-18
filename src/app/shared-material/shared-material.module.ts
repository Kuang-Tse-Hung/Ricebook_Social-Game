import { NgModule } from '@angular/core';
/* Component */
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';


/* Layout */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    /* Layout */
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,

    /* Component */
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDividerModule,
    MatRippleModule,
    MatCardModule,
    MatSlideToggleModule,
    MatListModule,
    MatGridListModule,

    /* Form */
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    /* Layout */
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,

    /* Component */
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTabsModule,
    MatDividerModule,
    MatRippleModule,
    MatCardModule,
    MatSlideToggleModule,
    MatListModule,
    MatGridListModule,

    /* Form */
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedMaterialModule { }
