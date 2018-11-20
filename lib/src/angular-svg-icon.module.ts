import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SVG_ICON_REGISTRY_PROVIDER } from './svg-icon-registry.service';
import { SvgIconComponent } from './svg-icon.component';

@NgModule({
	imports:	  [
		CommonModule,
	],
	declarations: [ SvgIconComponent ],
	providers:    [ SVG_ICON_REGISTRY_PROVIDER ],
	exports:      [ SvgIconComponent ]
})

export class AngularSvgIconModule {}
