import { OnInit, AfterViewInit, Component, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user/user.service';
import { ConfirmDialogComponent } from '../../includes/utilities/popups/confirm/confirm-dialog.component';
import { EditUser } from './user-edit/user-edit.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils/utils.service';


export interface UserData {
  Index: string;
  Name: string;
  UnitNames: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['Index', 'Name', 'UnitNames', 'ORMRole', 'ORMAdmin', 'BCMRole', 'BCMAdmin', 'Action'];

  // @ts-ignore
  dataSource: MatTableDataSource<UserData>;
  data: any;

  saRoleID = "";
  umRoleID = "";
  suRoleID = "";
  inputSearch: any = "";

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _utils: UtilsService,
    private userService: UserService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private _document: any
  ) {
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter() {
    this.dataSource.filter = this.inputSearch.trim().toLocaleLowerCase()
    console.log("this.dataSource.filter", this.dataSource.filter)
    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage()
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe(res => {
      next:
      if (res.success == 1) {
        res.result.Roles.forEach((role: any) => {
          if (role.Abbreviation == 'SA') this.saRoleID = role.RoleID;
          if (role.Abbreviation == 'UM') this.umRoleID = role.RoleID;
          if (role.Abbreviation == 'SU') this.suRoleID = role.RoleID;
        });

        if (res.result.Users.length > 0) {
          this.data = res.result.Users;
          console.log("this.data", this.data)
          if (this.data) {
            let id = 0;
            let userguid = localStorage.getItem("userguid")
            this.data.forEach((user: any) => {
              id++
              user.Index = id
              user.UMRoleID = this.umRoleID
              user.SURoleID = this.suRoleID
              user.IsUserManager = false
              user.IsUserSelf = user.UserGUID == userguid
              user.Name = user.FirstName ? user.FirstName : ""
              user.Name += user.MiddleName ? (user.Name == "" ? "" : " ") + user.MiddleName : ""
              user.Name += user.LastName ? (user.Name == "" ? "" : " ") + user.LastName : ""
              if (user.DefaultRoleID == this.umRoleID) {
                user.IsUserManager = true;
              }
              if (user.Modules) {
                user.Modules.forEach((module: any) => {
                  console.log(module)
                  module.IsSelected = true;
                });
              }

              user.UnitNames = "";
              if (user.Units) {
                user.Units.forEach((unit: any) => {
                  if (user.UnitNames != "")
                    user.UnitNames += " | ";
                  user.UnitNames += unit.UnitName;
                });
              }
            });
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.dataSource.filterPredicate = function (data, filter: string): boolean {
              return data.Name.toLowerCase().includes(filter) ||
                data.UnitNames.toLowerCase().includes(filter)
            };

            if (this.inputSearch != "") {
              this.applyFilter()
            }
          }
        }
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
      }
      error:
      console.log("err::", "error");
    });
  }

  addUser(): void {
    const editUser = this.dialog.open(EditUser, {
      disableClose: true,
      data: {
        "mode": "add",
        "UMRoleID": this.umRoleID,
        "SURoleID": this.suRoleID,
        "LirstName": "",
        "LastName": "",
        "MobileNumber": "",
        "IsUserManager": false,
        "Modules": [{ "ModuleAbbreviation": "ORM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false },
        { "ModuleAbbreviation": "BCM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false }],
        "Units": []
      }
    });

    editUser.afterClosed().subscribe(result => {
      if (result)
        this.getUsers();
    });
  }

  editUser(row: any): void {
    if (row.IsUserSelf) return
    row.mode = "edit";
    const editUser = this.dialog.open(EditUser, {
      disableClose: true,
      data: row
    });

    editUser.afterClosed().subscribe(result => {
      if (result)
        this.getUsers();
    });
  }

  deleteUser(row: any): void {
    if (row.IsUserSelf) return
    const confirm = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "dark",
      data: {
        title: "Confirm Deletion",
        content: "This action will permanently delete the record.\nYou may not be able to retrieve it.\n\nDo you still want to delete it?"
      }
    });

    confirm.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteAssignedUser(row).subscribe(res => {
          next:
          this.deleteSuccess();
          error:
          console.log("err::", "error");
        });
      }
    });
  }

  deleteSuccess(): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      data: {
        title: "Success",
        content: "User deleted successfully."
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.getUsers();
      }, timeout)
    });
  }

  changeRole(user: any) {
    if (user.Modules[0].RoleID == 4) {
      user.Modules[0].RoleID = 5;
      user.Modules[0].IsFunctionalAdmin = false;
    } else {
      user.Modules[0].RoleID = 4;
    }
  }

  roleCheck(mod: any, selectdMod: any): boolean{
    let isPower = false
    for(let i=0; i<=mod.Modules.length-1; i++){
      if ((mod.Modules[i].RoleID === 4 && mod.Modules[i].ModuleAbbreviation === selectdMod)) {
        isPower = true;
        break;
      }
    }
    return isPower;
}

isFunctionalAdmin(fun: any, selectdMod: any): boolean{
  let isFunctional = false
  for(let i=0; i<=fun.Modules.length-1; i++){
    if (fun.Modules[i].IsFunctionalAdmin === true && fun.Modules[i].ModuleAbbreviation === selectdMod) {
      isFunctional = true;
      break;
    }
  }
  return isFunctional;
}

funCheck(fun: any, selectdMod: any){
  for(let i=0; i<=fun.Modules.length-1; i++){
    if ((fun.Modules[i].ModuleAbbreviation === selectdMod && fun.Modules[i].IsFunctionalAdmin === true)) {
      fun.Modules[i].ModuleAbbreviation === selectdMod && fun.Modules[i].IsFunctionalAdmin === true != fun.Modules[i].ModuleAbbreviation === selectdMod && fun.Modules[i].IsFunctionalAdmin === true
    }
  }
}

}
