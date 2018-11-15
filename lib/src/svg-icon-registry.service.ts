import { Injectable, Optional, SkipSelf } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of as observableOf, throwError as observableThrowError } from 'rxjs';
import { map, tap, catchError, finalize, share } from 'rxjs/operators';

@Injectable()
export class SvgIconRegistryService {

	private iconsByUrl = new Map<string, SVGElement>();
	private iconsLoadingByUrl = new Map<string, Observable<SVGElement>>();

	constructor(private http:HttpClient) {
	}

	/** Add a SVG to the registry by passing a name and the SVG. */
	addSvg(name:string, data:string) {
		if (!this.iconsByUrl.has(name)) {
			const div = document.createElement('DIV');
			div.innerHTML = data;
			const svg = <SVGElement>div.querySelector('svg');
			this.iconsByUrl.set(name, svg);
		}
	}

	/** Load a SVG to the registry from a URL. */
	loadSvg(url:string) : Observable<SVGElement> {

		if (this.iconsByUrl.has(url)) {
			return observableOf(this.iconsByUrl.get(url));
		} else if (this.iconsLoadingByUrl.has(url)) {
			return this.iconsLoadingByUrl.get(url);
		} else {
			const o = <Observable<SVGElement>> this.http.get(url, { responseType: 'text' }).pipe(
				map(svg => {
					const div = document.createElement('DIV');
					div.innerHTML = svg;
					return <SVGElement>div.querySelector('svg');
				}),
				tap (svg => this.iconsByUrl.set(url, svg) ),
				catchError(err => {
					console.error(err);
					return observableThrowError(err);
				}),
				finalize(() => this.iconsLoadingByUrl.delete(url) ),
				share()
			);

			this.iconsLoadingByUrl.set(url, o);
			return o;
		}
	}

	/** Remove a SVG from the registry by URL (or name). */
	unloadSvg(url:string) {
		if (this.iconsByUrl.has(url)) {
			this.iconsByUrl.delete(url);
		}
	}
}

export function SVG_ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry:SvgIconRegistryService, http:HttpClient) {
	return parentRegistry || new SvgIconRegistryService(http);
}

export const SVG_ICON_REGISTRY_PROVIDER = {
	provide: SvgIconRegistryService,
	deps: [ [new Optional(), new SkipSelf(), SvgIconRegistryService], HttpClient ],
	useFactory: SVG_ICON_REGISTRY_PROVIDER_FACTORY
};
