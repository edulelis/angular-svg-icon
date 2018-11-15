import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SvgIconRegistryService } from './svg-icon-registry.service';
import { SvgIconComponent } from './svg-icon.component';

@NgModule({
	imports:	  [
		CommonModule,
	],
	declarations: [ SvgIconComponent ],
	providers:    [ SvgIconRegistryService ],
	exports:      [ SvgIconComponent ]
})

export class AngularSvgIconModule {}
