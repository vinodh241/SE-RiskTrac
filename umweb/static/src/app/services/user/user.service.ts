import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RestService } from '../rest/rest.service';


@Injectable({
    providedIn: 'root'
})
export class UserService extends RestService {

    getAllUsers() {
        return this.post("/user-management/user-management/get-users", {

        });
    }

    getUserDetails(userId: any, emailId: any) {
        return this.post("/user-management/user-management/get-user-details-from-ad", {
            "userMaster": {
                "userId": userId,
                "emailId": emailId
            }
        });
    }

    getAssignedUserInfo() {
        return this.post("/user-management/user-management/get-assigned-user-info", {

        });
    }

    addAssignUser(user: any, accGUID: string, modGUID: any): Observable<any> {

        console.log('user: ' + JSON.stringify(user))
        // console.log("user", user);
        let modules: any[] = [];
        user.Modules.forEach((module: any) => {
            if (module.IsSelected) {
                modules.push({
                    "ModuleGUID": modGUID,
                    "RoleID": module.RoleID,
                    "IsFunctionalAdmin": module.IsFunctionalAdmin
                });
            }
        });

        let units: any[] = [];
        user.Units.forEach((unit: any) => {
            units.push({ "UnitID": unit.UnitID });
        });
        console.log('user: 111' + JSON.stringify(user))
        var userMaster = {
            "adUserName": user.ADUserName ? user.ADUserName : "",
            "firstName": user.FirstName,
            "middleName": user.MiddleName,
            "lastName": user.LastName,
            "mobileNumber": user.MobileNumber,
            "emailID": user.EmailID,
            "defaultRoleID": user.IsUserManager ? user.UMRoleID : user.SURoleID,
            "isUserManager": user.IsUserManager,
            "assignedModules": "",
            "assignedGroupsUnits": "",
            "userGUID": user.UserGUID,
            "accountGUID": accGUID //"E5C48BA2-6FFE-4B1C-813A-432CE3A05FFF"
        }

        if (!userMaster.isUserManager) {
            userMaster.assignedModules = JSON.stringify(modGUID);
            userMaster.assignedGroupsUnits = JSON.stringify(units);
        }

        let postdata = {
            "userMaster": userMaster
        }
        return this.post("/user-management/user-management/add-assign-user", postdata);
    }

    deleteAssignedUser(user: any): Observable<any> {
        return this.post("/user-management/user-management/delete-user", {
            "userMaster": {
                "UserGUID": user.UserGUID
            }
        });
    }

}
