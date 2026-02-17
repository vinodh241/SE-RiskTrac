import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckboxControlValueAccessor, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/includes/utilities/popups/alert/alert.component';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { IncidentService } from 'src/app/services/incident/incident.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-incident-details',
    templateUrl: './incident-details.component.html',
    styleUrls: ['./incident-details.component.scss']
})
export class IncidentDetailsComponent implements OnInit, OnDestroy {
    @Output() close: EventEmitter<boolean> = new EventEmitter();
    maxDate!: Date;
    incidentForm = this.fb.group({
        groupName: ['', Validators.required],
        unitName: ['', Validators.required],
        locationType: ['', Validators.required],
        team: [''],
        incidentDate: ['', Validators.required],
        incidentDesc: ['', Validators.required],
        incidentTitle: ['', Validators.required],
        recommendedAction: ['', Validators.required],
        actionTaken: ['', Validators.required],
        rca: ['', Validators.required],
        DirectLoss: [0],
        IndirectLoss: [0],
        Recoveries: [0],
        lossAmount: [0],
        identificationDate: [''],
        partyDetails: [''],
        criticality: ['', Validators.required],
        units: [''],
        incidentSource: ['', Validators.required],
        lossCategory: ['']
    });
    reportingDate!: string;
    // incident: any = { "IncidentCode": "", "GroupID": -1 };
    incident: any = { DirectLoss: 0, IndirectLoss: 0, Recoveries: 0, lossAmount: 0, IncidentCode: "", GroupID: -1 };

    isUnitValid = true;
    isSaved: boolean = false
    currency: any = environment.currency || '';

    constructor(
        private fb: FormBuilder,
        public service: IncidentService,
        public utils: UtilsService,
        public dialog: MatDialog
    ) {
        this.maxDate = new Date();
        // this.incidentForm.controls['incidentDate'].setValidators(Validators.max(new Date()))

        service.gotInfo.subscribe(value => {
            if (value == true) {
                let units = service.info?.units.filter((unit: any) => unit.UnitID == service.info.currentUserData[0].UnitIDs[0])
                // console.log("🚀 ~ IncidentDetailsComponent ~ service.info:", service.info)
                if (this.incident.IncidentCode == "" && units.length > 0) {
                    this.incident.GroupID = units[0].GroupID
                    this.incident.UnitID = units[0].UnitID
                }
                // this.currency = environment.currency || ''
            }
        })
    }

    ngOnInit(): void {
        this.reportingDate = formatDate(Date.now(), 'dd-MMM-yyyy', 'en');
    }

    ngOnDestroy(): void {
        this.clean()
    }

    changeIncidentDate(type: string, date: MatDatepickerInputEvent<Date>) {
        this.incident.IncidentDate = this.utils.ignoreTimeZone(date.value)
    }

    changeIdentificationDate(type: string, date: MatDatepickerInputEvent<Date>) {
        this.incident.IdentificationDate = this.utils.ignoreTimeZone(date.value)
    }

    save() {
        this.isSaved = true
        let evidenceIDs: number[] = []
        if (!this.validateLossValue()) {
            this.popupInfo(`Please select the impacted units along with the loss percentage, Total Loss% should be 100`);;
        }
        else {
            if (this.service.incEvidences && this.service.incEvidences.data.length > 0) {
                this.service.incEvidences.data.forEach(evd => {
                    evidenceIDs.push(evd.EvidenceID)
                });
            }

            let impactedUnits: any[] = []
            this.service.info.units.filter((unit: any) => unit.checked).forEach((unit: any) => {
                impactedUnits.push({ "unitID": unit.UnitID, "lossValue": unit.LossValue })
            });

            let userguid = localStorage.getItem("userguid")
            const data = {
                "incidentCode": this.service.incident?.IncidentCode,
                "groupID": this.incidentForm.value.groupName,
                "unitID": this.incidentForm.value.unitName,
                "userGUID": this.incident.IncidentCode == "" ? userguid : this.incident.UserGUID,
                "locationTypeID": this.incidentForm.value.locationType,
                "incidentTeam": this.incidentForm.value.team,
                "incidentDate": this.incidentForm.value.incidentDate,
                "mobileNumber": this.incident.IncidentCode == "" ? this.service.info.currentUserData[0].MobileNumber : this.incident.MobileNumber,
                "emailID": this.incident.IncidentCode == "" ? this.service.info.currentUserData[0].EmailID : this.incident.EmailID,
                "incidentTitle": this.incidentForm.value.incidentTitle,
                "description": this.incidentForm.value.incidentDesc,
                "recommendation": this.incidentForm.value.recommendedAction,
                "action": this.incidentForm.value.actionTaken,
                "rca": this.incidentForm.value.rca,
                "incidentTypeIDs": this.service.info.incidentTypes.filter((type: any) => type.checked).map((type: any) => type.TypeID).toString() || null,
                "incidentSourceID": this.incidentForm.value.incidentSource,
                "DirectLoss": this.incidentForm.value.DirectLoss,
                "IndirectLoss": this.incidentForm.value.IndirectLoss,
                "Recoveries": this.incidentForm.value.Recoveries,
                "lossAmount": this.incidentForm.value.lossAmount,
                "identificationDate": this.incidentForm.value.identificationDate,
                "aggPartyDetails": this.incidentForm.value.partyDetails,
                "criticalityID": this.incidentForm.value.criticality,
                "impactedUnits": impactedUnits,
                "riskLossCategoryIDs": this.service.info.lossCatagories.filter((loss: any) => loss.checked).map((loss: any) => loss.CategoryID).toString() || null,
                "evidenceIDs": evidenceIDs.toString()
            };
            this.service.setIncident(data);
        }
    }

    clean() {
        this.service.info.lossCatagories.forEach((loss: any) => {
            loss.checked = false
        })
        this.service.info.incidentTypes.forEach((type: any) => {
            type.checked = false
        })
        this.service.info.units.forEach((unit: any) => {
            unit.checked = false
            unit.LossValue = null
        })
    }

    edit() {
        if (this.service.incident.IncidentCode && this.service.incident.IncidentCode != "")
            this.reportingDate = formatDate(this.service.incident.ReportingDate, "dd-MMM-yyyy", "en")

        this.service.info.lossCatagories.forEach((loss: any) => {
            loss.checked = this.service.riskLossCategories.map((elm: any) => elm.RiskLossCategoryID).includes(loss.CategoryID)
        })
        this.service.info.incidentTypes.forEach((type: any) => {
            type.checked = this.service.incidentTypes.map((elm: any) => elm.TypeID).includes(type.TypeID)
        })
        this.service.info.units.forEach((unit: any) => {
            unit.checked = false
            this.service.impactedUnits.forEach((data: any) => {
                if (unit.UnitID == data.UnitID) {
                    unit.checked = true
                    unit.LossValue = data.LossValue
                }
            })
        })
        this.incident = JSON.parse(JSON.stringify(this.service.incident))
      //  // console.log('edit-this.incident::', this.incident);
        this.service.isIncidentEditable = true
    }

    getLossTotal(): number {
        let lossTotal = 0
        if (this.service.info) {
            let losses = this.service.info.units.map((loss: any) => Number(loss.LossValue) || 0)
            lossTotal = losses.reduce((sum: number, val: number) => sum + val, 0)
        }
        return lossTotal
    }

    filteredUnits(groupID: any) {
        // // console.log('groupID: ', groupID);
        // // console.log("this.incidentForm.value.unitName",this.incidentForm.value.unitName)
        return this.service.info?.units.filter((unit: any) => unit.GroupID == groupID)
    }

    areAllChecked(): boolean {
        return this.service.info?.incidentTypes.some((type: any) => type.checked)
    }

    findInvalidControlsRecursive(formToInvestigate: FormGroup): string[] {
        var invalidControls: string[] = [];
        let recursiveFunc = (form: FormGroup) => {
            Object.keys(form.controls).forEach(field => {
                const control = form.get(field);
                if (control?.invalid) invalidControls.push(field);
                if (control instanceof FormGroup) {
                    recursiveFunc(control);
                }
            });
        }
        recursiveFunc(formToInvestigate);
        return invalidControls;
    }
    closeDialog() {
        this.close.emit(true);
    }

    onChangeSAR(changedField?: string) {
        // Ensure values are non-negative
        let direct = this._clampToNonNegative(Number(this.incidentForm.value.DirectLoss || 0));
        let indirect = this._clampToNonNegative(Number(this.incidentForm.value.IndirectLoss || 0));
        let recoveries = this._clampToNonNegative(Number(this.incidentForm.value.Recoveries || 0));
        let manualLoss = this._clampToNonNegative(Number(this.incidentForm.value.lossAmount || 0));

        // Clamp negative → 0 and sync form values
        this._syncField('DirectLoss', direct);
        this._syncField('IndirectLoss', indirect);
        this._syncField('Recoveries', recoveries);
        this._syncField('lossAmount', manualLoss);

        // Recoveries should not exceed Direct + Indirect
        const sum = direct + indirect;
        if (recoveries > sum) {
            recoveries = sum;
            this._syncField('Recoveries', recoveries);
            this.popupInfo(`Recoveries cannot exceed Direct + Indirect Loss (${sum}). Value adjusted.`);
        }

        // Recalculate LossAmount
        let calculatedLoss = sum - recoveries;
        if (calculatedLoss < 0) calculatedLoss = 0;

        // If user changed lossAmount manually, validate
        if (changedField === 'lossAmount') {
            if (manualLoss !== calculatedLoss) {
                this.popupInfo(`Loss Amount must equal (Direct + Indirect) - Recoveries. Adjusted from ${manualLoss} to ${calculatedLoss}.`);
            }
        }

        // Always update to calculatedLoss
        this._syncField('lossAmount', calculatedLoss);

        // Keep unit % validation
        if (!this.validateLossValue()) {
            this.popupInfo(`Please select the impacted units along with the loss percentage, Total Loss% should be 100`);
        }
    }

    /** Helper to clamp negative values to zero */
    private _clampToNonNegative(val: number): number {
        return val < 0 || isNaN(val) ? 0 : val;
    }

    /** Helper to sync form + incident object */
    private _syncField(field: string, value: number) {
        this.incident[field] = value;
        if (this.incidentForm.get(field)) {
            this.incidentForm.get(field)!.setValue(value, { emitEvent: false });
        }
    }


    validateLossValue(): boolean {
        let checks = []
        let vLossValue: boolean;
        let lossTotal = 0
        if (this.service.info) {
            checks = this.service.info.units.filter((loss: any) => loss.checked)
            let losses = this.service.info.units.map((loss: any) => Number(loss.LossValue) || 0)
            lossTotal = losses.reduce((sum: number, val: number) => sum + val, 0)
        }
        if (this.incident.LossAmount && Number(this.incident.LossAmount) > 0)
            vLossValue = lossTotal == 100
        else {
            vLossValue = true
        }
        return vLossValue
    }

    popupInfo(content: string) {
        const dialogRef = this.dialog.open(AlertComponent, {
            width: '250px',
            panelClass: "dark",
            data: {
                title: '',
                content: content
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
        });
    }
    selectedUnit(event: any, incident: any) {
        // console.log("Clicked mat-select", event, incident);
        incident.UnitID = ""
    }
}
