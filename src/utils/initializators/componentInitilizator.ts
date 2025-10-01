// import { of } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { ApiService } from '../../services/api.services1';
// import { componentStorage, initComponentTypes } from '../redux/component';
// import { Injectable } from '@angular/core';
// @Injectable({
//     providedIn: 'root'
// })
// export class ComponentInitializator {
//     initComponentTypes(api: ApiService) {
//         const componentTypeAlias = JSON.parse(localStorage.getItem('componentTypeAlias')!);

//         if (componentTypeAlias && Array.isArray(componentTypeAlias)) {
//             componentStorage.dispatch(initComponentTypes(componentTypeAlias as any));

//             return of(componentTypeAlias);
//         } else {
//             return api.getComponentNames()?.pipe(
//                 tap(data => {
//                     localStorage.setItem('componentTypeAlias', JSON.stringify(data));
//                     componentStorage.dispatch(initComponentTypes(data))
//                 })
//             );
//         }
//     }
// }
