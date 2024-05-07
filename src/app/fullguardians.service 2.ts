import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FullguardiansService implements CanActivate {

  constructor(private router: Router) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  let tk = localStorage.getItem('token');
  if ( tk == null){
    this.router.navigate(['/login']);
    return false;
  } else {

    return true;
  }
}

}
