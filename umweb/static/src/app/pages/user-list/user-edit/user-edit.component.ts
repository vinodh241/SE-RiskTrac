import { DOCUMENT } from '@angular/common';
import { ExpressionType, jsDocComment } from '@angular/compiler';
import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, Form, NgModel } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLinkWithHref } from '@angular/router';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { UserService } from '../../../services/user/user.service';

export interface UserData {
  id: string;
  user: string;
  unit: string;
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class EditUser implements OnInit {
  // @ts-ignore
  searchForm: FormGroup;

  // message: string = "";
  // cancelButtonText = "Cancel";

  dcModules: string[] = ['module', 'role', 'admin'];
  dcUnits: string[] = ['id', 'group', 'unit', 'action'];

  accounts: any;
  modules: any;
  groups: any;
  units: any;
  copy: any;

  searcherror = "";
  saveerror = "";
  uniterror = "";
  fullName: string = '';
  moduleerror = "";

  // @ts-ignore
  @ViewChild('FirstName') FirstName: NgModel
  // @ts-ignore
  @ViewChild('MobileNumber') MobileNumber: NgModel
  // @ts-ignore
  @ViewChild('EmailID') EmailID: NgModel
  selectedModule: any[] = [];
    headerRowColor = 'rgb(152 207 223)'
  existingModule: any;
  dupUnitIDs : Set<number> = new Set()

  
  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private _utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditUser>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any) {
    if (data) {
      // this.message = data.message || this.message;
      // if (data.buttonText) {
      //     this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      // }
      this.copy = JSON.parse(JSON.stringify(data));
      this.refreshUnits();
   
    }

    this.dialogRef.updateSize('67vw', '89vh');
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      userid: [''],
      emailid: ['']
    });

    this.userService.getAssignedUserInfo().subscribe(res => {
      next:
      if (res.success == 1) {
        if (res.result[0].length > 0) {
          this.accounts = res.result[0];
        }
        if (res.result[1].length > 0) {
          this.modules = res.result[1];
        }
        if (res.result[2].length > 0) {
          this.groups = res.result[2];
        }
        if (res.result[3].length > 0) {
          this.units = res.result[3];
        }
        if (this.copy.Modules.length == 0) {
          this.copy.Modules.push({ "ModuleAbbreviation": "ORM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false }, { "ModuleAbbreviation": "BCM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false });
          this.copy.Modules = [...this.copy.Modules];
        }
        else if (this.copy.Modules.length == 1) {
          if (this.copy.Modules[0].ModuleAbbreviation === "ORM") {
            this.copy.Modules.push({ "ModuleAbbreviation": "BCM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false });
          } else {
            this.copy.Modules.push({ "ModuleAbbreviation": "ORM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false });
          }
          this.copy.Modules = [...this.copy.Modules];
        }
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
      }
      error:
      console.log("err::", "error");
    });
    this.selectedModule = this.copy.Modules.filter((x:any)=> x.IsSelected === true)
    console.log("this.existingModule", this.selectedModule);
  }

  public onSubmit(): void {
    this.copy.FirstName = "";
    this.copy.LastName = "";
    this.copy.MobileNumber = "";
    this.clearErrors();
    //if (this.searchForm.valid) {
    this.userService.getUserDetails(this.searchForm.value.userid, this.searchForm.value.emailid).subscribe(res => {
      next:
      if (res.success == 1) {
        if (res.result[0].length > 0) {
          this.copy.ADUserName = res.result[0][0].adUserName;
          this.copy.FirstName = res.result[0][0].firstName;
          this.copy.MiddleName = res.result[0][0].middleName ? res.result[0][0].middleName : "";
          this.copy.LastName = res.result[0][0].lastName ? res.result[0][0].lastName : "";
          this.copy.MobileNumber = res.result[0][0].mobileNumber;
          this.copy.EmailID = res.result[0][0].userEmail;
          this.getUserFullName(res.result[0][0])
        }
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
        else
          this.searcherror = res.error.errorMessage;
      }
      error:
      console.log("err::", "error");
    });
    //}
  }

  assignUnit(): void {
    this.clearErrors();
    this.copy.Units.push({ "id": (this.copy.Units.length + 1), "UnitID": -1 });
    this.copy.Units = [...this.copy.Units];
    if(this.dupUnitIDs.size) {
      return;
    }
    // const table = document.getElementById('tblunit');
    // if (table) {
    //     table.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    // }
  }

  refreshUnits(): void {
    let id = 0;
    this.copy.Units.forEach((unit: any) => {
      id++;
      unit.id = id;
    });
    this.copy.Units = [...this.copy.Units];
  }

  deleteUnit(row: any): void {
    this.clearErrors();
    let ob: any = {}

    if (!this.copy.IsUserManager) {
      let idx = this.copy.Units.indexOf(row);
      this.copy.Units.splice(idx, 1);
      this.copy.Units = [...this.copy.Units];
      this.refreshUnits();

      console.log(ob)
      this.dupUnitIDs.clear();

      this.copy.Units.forEach((n: any) => {
        ob[n.UnitID] = ob[n.UnitID] ? ob[n.UnitID] + 1 : 1;
      })
      
      for (let key in ob) {
        if (ob[key] > 1) {
          this.dupUnitIDs.add(parseInt(key));
        }
      }

    }
  }


  filteredUnits(groupId: any) {
    const table = document.getElementById('tblunit');
    if (table) {
      table.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    return this.units.filter((unit: any) => unit.GroupID === groupId);
  }

  changeUserManager(): void {
    this.copy.IsUserManager = !this.copy.IsUserManager;
    if (this.copy.IsUserManager) {
      this.copy.Modules = [];
      this.copy.Modules.push({ "ModuleAbbreviation": "ORM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false },
        { "ModuleAbbreviation": "BCM", "RoleID": 5, "IsFunctionalAdmin": false, "IsSelected": false });
      this.copy.Units = [];
      this.copy.Modules = [...this.copy.Modules];
      this.copy.Units = [...this.copy.Units];
    }
  }

  changeModule(module: any): void {
      this.selectedModule.push(module);
      console.log("this.selectedModule",this.selectedModule)
      this.clearErrors();
      module.IsSelected = !module.IsSelected
      if (!module.IsSelected) {
          module.RoleID = 5;
          module.IsFunctionalAdmin = false;
      }
      // Remove duplicate modules based on ModuleAbbreviation
      this.selectedModule = this.selectedModule.filter((m, index, self) =>
          index === self.findIndex((t) => t.ModuleAbbreviation === m.ModuleAbbreviation)
      );
  }

  changeRole(module: any): void {
    if (module.RoleID == 4) {
      module.RoleID = 5;
      module.IsFunctionalAdmin = false;
    } else {
      module.RoleID = 4;
    }
  }

  validateSave(): void {
    let blank: boolean = false;
    let units: any[] = [];
    this.clearErrors();

    this.FirstName.control.markAllAsTouched()
    this.MobileNumber.control.markAsTouched()
    this.EmailID.control.markAsTouched()

    let hasError: boolean =
      this.FirstName.control.hasError("required") ||
      this.MobileNumber.control.hasError("required") ||
      this.EmailID.control.hasError("required") ||
      this.EmailID.control.hasError("email")

    // let isRequiredFilled: boolean = !(
    //     !this.copy.FirstName || this.copy.FirstName == "" ||
    //     !this.copy.MobileNumber || this.copy.MobileNumber == "" ||
    //     !this.copy.EmailID || this.copy.EmailID == "" || this.EmailID.control.hasError
    // )

    this.copy.Units.forEach((unit: any) => {
      if (unit.UnitID == -1)
        blank = true;
      units.push(unit.UnitID);
    });

    let modules = 0;
    this.copy.Modules.forEach((module: any) => {
      if (module.IsSelected)
        modules++;
    });

    if (!hasError) {
      if (!this.copy.IsUserManager) {
        if (modules == 0)
          this.moduleerror = "Atleast one module is required.";
        if (blank)
          this.uniterror = "Blank unit(s) found.";
        else {
          if (units.length == 0)
            this.uniterror = "Atleast one unit is required."
          else if ((new Set(units)).size !== units.length)
            this.uniterror = "Duplicate units found.";
        }

        if (this.moduleerror == "" && this.uniterror == "")
          this.saveUserDetails();
      } else
        this.saveUserDetails();
    }
  }

  saveUserDetails(): void {
    this.clearErrors();
    let accGUID = "";
    this.accounts.forEach((account: any) => {
      if (account.Abbreviation == "AMLAK") {
        accGUID = account.AccountGUID;
      }
    });
    let modGUID = "";

    let selectedModulesWithParameters = this.selectedModule.filter(module => module.IsSelected).map(selected => {
      const matchingModule = this.modules.find((module: any) => module.Abbreviation === selected.ModuleAbbreviation);
      return {
        ModuleGUID: matchingModule ? matchingModule.ModuleGUID : null,
        RoleID: selected.RoleID,
        IsFunctionalAdmin: selected.IsFunctionalAdmin
      };
    });

    this.userService.addAssignUser(this.copy, accGUID, selectedModulesWithParameters).subscribe(res => {
      next:
      if (res.success == 1) {
        this.dialogRef.close(true);
        this.saveSuccess();
      } else {
        if (res.error.errorCode && res.error.errorCode == "TOKEN_EXPIRED")
          this._utils.relogin(this._document);
        else
          this.saveerror = res.error.errorMessage;
      }

      error:
      console.log("err::", "error");
    });

  }

  saveSuccess(): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      disableClose: true,
      minWidth: "300px",
      panelClass: "success",
      data: {
        title: "Success",
        content: "User details saved successfully."
      }
    });

    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
        this.router.navigate(['user-list']);
      }, timeout)
    });
  }

  clearErrors(): void {
    this.searcherror = "";
    this.saveerror = "";
    this.uniterror = "";
    this.moduleerror = "";
  }

  duplicateUnits(unitid: any) :any {
    let ob: any = {}
    this.dupUnitIDs.clear();

    this.copy.Units.forEach((n: any) => {
      ob[n.UnitID] = ob[n.UnitID] ? ob[n.UnitID] + 1 : 1;
    })

    for (let key in ob) {
      if (ob[key] > 1) {
        this.dupUnitIDs.add(parseInt(key));
      }
    }
    if(ob[unitid] > 1) {
      this.uniterror = "Please remove the duplicate units.";
      return unitid
    } else {
      this.uniterror = "";
      return 0
    }
  }

  
  onGroupChange(row: any): void {
    if (row.UnitID && this.dupUnitIDs.has(row.UnitID)) {
      this.dupUnitIDs.delete(row.UnitID);
    }
    this.dupUnitIDs.delete(row.UnitID);
    this.clearErrors();
  }

  getUserFullName(res: any) {
    let name = ((res?.firstName != null && res?.firstName != undefined) ? res?.firstName : '') + " " +
      ((res?.middleName != null && res?.middleName != undefined) ? res?.middleName : '') + " " +
      ((res?.lastName != null && res?.lastName != undefined) ? res?.lastName : '');
    this.fullName = name.length > 25 ? name.substring(0, 25) + '...' : name
  }
  
  updateFullADName() {
    const firstName = this.copy.FirstName || '';
    const middleName = this.copy.MiddleName || '';
    const lastName = this.copy.LastName || '';
    let fullName = `${firstName} ${middleName} ${lastName}`.trim();
    this.fullName = fullName //.length > 25 ? fullName.substring(0, 25) + '...' : fullName;
  }
}
