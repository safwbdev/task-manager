import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webservice: WebRequestService, private router: Router) { }

  login(email: string, password: string){
    console.log('auth.serce login()');
    return this.webservice.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log("Logged In!");
      })
    )
  }

  logout(){
    this.removeSession();
  }

  getAccessToken(){
    return localStorage.getItem('x-access-item');
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }
  setAccessToken(accessToken: string){
    localStorage.setItem('x-access-token', accessToken);
  }

  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }
}