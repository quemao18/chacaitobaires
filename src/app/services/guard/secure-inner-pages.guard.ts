import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../auth/auth.service";
import { Observable } from 'rxjs';
import { NotificationService } from '../notification/notification.service';

@Injectable({
  providedIn: 'root'
})

export class SecureInnerPagesGuard implements CanActivate {

  constructor(
    public authService: AuthService,
    public router: Router,
    private notification: NotificationService
  ) { }

  // Esta funcion bloquea accesso a la ruta si ya estas logeado.
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggedIn) {
      // window.alert("You are not allowed to access this URL!");
      this.notification.showNotification('top', 'center', 'warning', 'warning', 'You are not allowed to access this URL!' );
      this.router.navigate(['dashboard'])
    }
    return true;
  }

}