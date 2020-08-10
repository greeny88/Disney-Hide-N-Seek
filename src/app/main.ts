import 'zone.js';
import 'reflect-metadata';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './dhns.module';

// if (PRODUCTION) {
//     //enable prod mode
//     import 'reflect-metadata'
// }

platformBrowserDynamic().bootstrapModule(AppModule);