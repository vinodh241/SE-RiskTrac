import { DOCUMENT } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { discardPeriodicTasks } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, from, map, Observable, tap } from 'rxjs';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable({
  providedIn: 'root'
})

export class LoginComponent implements OnInit {
  // @ts-ignore
  authForm: FormGroup;

  // @ts-ignore
  separator;

  // @ts-ignore
  serverTime;

  // @ts-ignore
  wait;

  publicKey: any;
  hide = true;

  apierror = "";



  constructor(
    private utils: UtilsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
    localStorage.setItem('showmenu', 'false');
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.authService.getPublicKey()
      .subscribe((response: any) => {

        next:
        // this.disableButton = false;
        this.publicKey = response.result.publicKey;
        this.separator = response.result.separator;
        this.serverTime = response.result.serverTime;
        // this.domainapi = response['result'].domainName;
        // localStorage.setItem('domainapiuser', response['result'].domainName);
        // this.versionApi = response['result'].version;
        // localStorage.setItem("CurrserverTime", this.serverTime);
        // localStorage.setItem('sessionTimeOut', response.result.sessionTimeOut);
        // localStorage.setItem('mgmtDashboardDataTimeDelayInSecond', response.result.mgmtDashboardDataTimeDelayInSecond);
        // var versionweb = version.split(".");
        // this.finalVersion = this.versionApi + '-' + versionweb[2];
        error: this.handleError.bind(this)

      });
  }

  getHTTPHeaders(): HttpHeaders {
    const result = new HttpHeaders();
    result.set('Content-Type', 'application/json');
    return result;
  }

  public onSubmit(): void {
    if (this.authForm.valid) {
      this.openWait()
      let username = this.authForm.value.username
      if (username.indexOf("@") == -1)
        username += "@" + environment.domain
      this.authService.login(username, this.authForm.value.password, this.publicKey, this.separator, this.serverTime)
        .subscribe({
          next: this.getlogin.bind(this),
          error: this.handleError.bind(this)
        });
    }
  }

  getlogin(response: any) {
    this.closeWait()
    localStorage.setItem('token', response.token);
    if (response.success) {
      localStorage.setItem('showmenu', 'true');
      let login = response.result.loginData[0];
      let roles = response.result.roleData;
      let auths = response.result.authorizedModuleData;
      let roleo = response.result.userModuleRoleData; // Roles for ORM
      let userUnitData = response.result.userUnitData;
      let bcmStreeringCommittee = response.result?.bcmStreeringCommittee || [];
      let role = 'XX';
      if (login && auths && roles && roleo) {
        localStorage.setItem('userguid', login.UserGUID)
        let mods: any[] = []
        // roleo.forEach((mod: any) => {
        //   mods.push(auths.find((eachauth: any)=>eachauth.ModuleGUID == mod.ModuleGUID).Abbreviation)
        // })
                
        roleo.forEach((mod:any) => {
          const auth = auths.find((eachauth:any) => eachauth.ModuleGUID === mod.ModuleGUID);
          if (auth) {
            mods.push(auth.Abbreviation);
          } else {
            mods.push(null);
          }
        });
        mods = mods.filter(Boolean)
        console.log('✌️mods --->', mods);
        localStorage.setItem('mods', mods.join(','));
        console.log('✌️mods --->', mods);

        let sa = -1;
        let um = -1;
        let pu = -1;
        let su = -1;
        roles.forEach((role: any) => {
          if (role.Abbreviation == "SA") sa = role.RoleID;
          if (role.Abbreviation == "UM") um = role.RoleID;
          if (role.Abbreviation == "PU") pu = role.RoleID;
          if (role.Abbreviation == "SU") su = role.RoleID;
        });
        if (login.RoleID == sa) role = 'SA';
        if (login.RoleID == um) role = 'UM';
        localStorage.setItem('role', role);

        roleo.forEach((roles: any) => {
          role = 'XX';
          if (roles.RoleID == su){ role = 'SU'; }
          if (roles.RoleID == pu) {
            role = 'PU';
            if (roles.IsFunctionalAdmin)
              role = 'FA';
          }
          // role = 'SU'; //SU, PU, FA
          // ***changes done on 19/06/2024(this line has been commented as Module GUID is different in all the server)***
          // if (roles.ModuleGUID == '73C44A7B-A3FD-453A-ACA6-E78B41FDA9B7') localStorage.setItem('rbcm', role);
          // if (roles.ModuleGUID == '18A3D88E-617D-4E7B-B3B8-2E72508BC77E') localStorage.setItem('rorm', role);
          if(roles.Abbreviation == "BCM") localStorage.setItem('rbcm', role);
          if(roles.Abbreviation == "ORM") localStorage.setItem('rorm', role);

        });
console.log('✌️roles --->', roles);

        localStorage.setItem('username', response.result.loginData[0].FullName);
        localStorage.setItem('userUnitData', JSON.stringify(userUnitData));
        localStorage.setItem('bcmStreeringCommittee', JSON.stringify(bcmStreeringCommittee));
      }
      this.router.navigate(['landing']);
    } else {
      if (response.error.errorCode == "PAGE_EXPIRED")
        this.utils.relogin(this.document)
      else
        this.apierror = response.error.errorMessage;
    }
  }

  private handleError<T>(operation = 'operation', result?: any) {
    this.closeWait()
    return (error: any): Observable<any> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return from(result);
    };
  }

  // private saveAccessData(accessData: AccessData) {
  //   if (typeof accessData !== 'undefined') {
  //     this.tokenStorage
  //       .setAccessToken(accessData["success"])
  //       .setRefreshToken(accessData["success"])
  //       .setUserRoles(["USER"]);
  //   }
  // }

  getErrorMessage() {
    if (this.authForm.get('username')?.hasError('required')) {
      return 'User name is required';
    }
    if (this.authForm.get('password')?.hasError('required')) {
      return 'Password is required';
    }
    return '';
    //return this.username.hasError('email') ? 'Not a valid email' : '';
  }

  openWait(): void {
    this.wait = this._dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: "Signing In ..."
      }
    })
  }

  closeWait(): void {
    this.wait.close()
  }

  onRightClick(event: Event) {
    event.preventDefault();
  }

}
