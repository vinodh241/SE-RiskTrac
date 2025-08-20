import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WaitComponent } from 'src/app/includes/utilities/popups/wait/wait.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  mods: any[] = [];
  year:any
  // @ts-ignore
  wait;

  constructor(
    private router: Router,
    private _dialog: MatDialog,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
    let mods = localStorage.getItem("mods") || ""
    this.mods = mods?.split(",")
    
    this.year = new Date().getFullYear()

    if (this.mods.length == 1) {
      this.openWait()
    }
  }

  navigateUserManagement(): void {
    //this.router.navigate(['user-management']);
    this.document.location.href = environment.userManagementUrl + "/";
  }

  navigateORM(): void {
    localStorage.setItem("AssessmentFilter", "Submitted");
    this.document.location.href = environment.ormUrl + "/";
  }

  navigateBCM(): void {
    this.document.location.href = environment.bcmUrl + "/";
  }

  navigateDMS(): void{
    localStorage.setItem("language", "en")
    this.document.location.href = environment.dmsUrl + "/";
  }

  openWait(): void {
    this.wait = this._dialog.open(WaitComponent, {
      disableClose: true,
      panelClass: "dark",
      data: {
        text: "Redirecting ..."
      }
    })

    this.wait.afterOpened().subscribe((result: any) => {
      setTimeout(() => {
        this.wait.close();
        switch (this.mods[0]) {
          case 'ORM':
            this.navigateORM()
            break
          case 'UM':
            this.navigateUserManagement()
            break
          case 'BCM':
            this.navigateBCM()
            break
        }
      }, 1000)
    });
  }

  closeWait(): void {
    this.wait.close()
  }
}
