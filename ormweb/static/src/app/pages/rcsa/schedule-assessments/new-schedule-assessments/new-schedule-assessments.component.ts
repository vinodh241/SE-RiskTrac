import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from 'src/app/includes/utilities/popups/info/info.component';
import { ConfigScoreRatingService } from 'src/app/services/rcsa/master/common/config-score-rating.service';
import { OverAllInherentRiskRatingService } from 'src/app/services/rcsa/master/inherent-risk/over-all-inherent-risk-rating.service';
import { ScheduleAssessmentsService } from 'src/app/services/rcsa/schedule-assessments/schedule-assessments.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-new-schedule-assessments',
  templateUrl: './new-schedule-assessments.component.html',
  styleUrls: ['./new-schedule-assessments.component.scss']
})
export class NewScheduleAssessmentsComponent implements OnInit {
  copy: any;
  AssessmentPeriodDS: any;
  reviewerDS: any;
  saveerror: string = '';
  userSame: boolean = false;
  masterForm = new FormGroup({
    schedulePeriod: new FormControl<string | null>(null, Validators.required),
    txtProsessedStartDate: new FormControl<Date | null>(null, Validators.required),
    txtProsessedEndDate: new FormControl<Date | null>(null, Validators.required),
    ddlReviewer1: new FormControl<number | null>(null, Validators.required),
    ddlReviewer2: new FormControl<number | null>(null, Validators.required),
    txtRateId: new FormControl<string | null>(""),
    txtDescription: new FormControl<string | null>(""),
    reminderDate: new FormControl<Date | null>(null, Validators.required),
    isInternalReviewRequired: new FormControl<boolean>(false)
  });

  selectedPeriodYearValue: number = new Date().getFullYear();
  selectedPeriodQuarterValue: number = Math.floor(new Date().getMonth() / 3 + 1);
  minDate: Date | null = null;
  maxDate: Date | null = null;
  radioSelect: boolean = false
  ScheduleAssessStatusID: any;

  constructor(
    private service: ScheduleAssessmentsService,
    private configScoreRatingService: ConfigScoreRatingService,
    private overAllInherentRiskService: OverAllInherentRiskRatingService,
    public utils: UtilsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewScheduleAssessmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private _document: any
  ) {
    if (data) {
      this.copy = JSON.parse(JSON.stringify(data))
    }
  }

  ngOnInit(): void {
    this.getPageLoad();
    this.masterForm.get('schedulePeriod')?.valueChanges.subscribe(x => {
      let quarter = (x || '')?.split(',')[0].toString().trim();
      this.selectedPeriodYearValue = Number((x || '')?.split(',')[1].toString().trim());
      this.selectedPeriodQuarterValue = Number(quarter.substring(quarter.length - 1));
      this.masterForm.get('txtProsessedStartDate')?.reset();
      this.masterForm.get('txtProsessedEndDate')?.reset();
    })
    this.masterForm.get('txtProsessedStartDate')?.valueChanges.subscribe(() => this.onDateChange());
    this.masterForm.get('txtProsessedEndDate')?.valueChanges.subscribe(() => this.onDateChange());
  }

  getPageLoad(): void {
    let obj = { "scheduleYear": "0", "scheduleAssessmentID": this.copy.mode == "add" ? 0 : this.copy.ScheduleAssessmentID }
    this.configScoreRatingService.getDataForManageScheduleAssessmentScreen(obj).subscribe(data => {
      next: {
        this.processScheduleAssessmentPeriod(data);
        this.processReviewer(data);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.copy.mode == "edit") {
        this.setEditData();
      }
    }, 0);
  }

  onDateChange() {
    const start = this.masterForm.controls['txtProsessedStartDate'].value;
    const end = this.masterForm.controls['txtProsessedEndDate'].value;

    this.minDate = start || null;
    this.maxDate = end || null;

    const rem = this.masterForm.controls['reminderDate'].value;
    if (rem && ((this.minDate && rem < this.minDate) || (this.maxDate && rem > this.maxDate))) {
      this.masterForm.controls['reminderDate'].setValue(null, { emitEvent: false });
    }
  }


  valueChanged(event: any) {
    if (this.masterForm.controls['txtProsessedStartDate'].value !== null && this.masterForm.controls['txtProsessedEndDate'].value !== null) {
      this.minDate = this.masterForm.controls['txtProsessedStartDate'].value;
      this.maxDate = this.masterForm.controls['txtProsessedEndDate'].value;
    }
  }

  private asDate(v: any): Date | null {
    if (!v) return null;
    return v instanceof Date ? v : new Date(v);
  }

  setEditData(): void {
    const start = this.asDate(this.copy.ProposedStartDate);
    const end = this.asDate(this.copy.ProposedCompletionDate);
    const reminder = this.asDate(this.copy.ReminderDate);

    // Patch non-date fields without triggering valueChanges
    this.masterForm.patchValue({
      schedulePeriod: this.copy.SchedulePeriod,
      ddlReviewer1: this.copy.PrimaryReviewerID,
      ddlReviewer2: this.copy.SecondaryReviewerID,
      txtRateId: this.copy.ScheduleAssessmentID,
      txtDescription: this.copy.ScheduleAssessmentDescription,
      isInternalReviewRequired: !!this.copy.IsInternalReviewRequired
    }, { emitEvent: false });

    // Patch dates without emitting, then compute min/max, then set reminder
    this.masterForm.get('txtProsessedStartDate')!.setValue(start, { emitEvent: false });
    this.masterForm.get('txtProsessedEndDate')!.setValue(end, { emitEvent: false });

    // update the [min]/[max] bounds
    this.minDate = start;
    this.maxDate = end;

    // finally set reminder (still no emission)
    this.masterForm.get('reminderDate')!.setValue(reminder, { emitEvent: false });
  }



  getScheduleAssessmentPeriod() {
    let obj = { "scheduleYear": "0", "scheduleAssessmentID": this.copy.ScheduleAssessmentID };
    this.configScoreRatingService.getScheduleAssessmentScreen(obj).subscribe(res => {
      next:
      this.processScheduleAssessmentPeriod(res);
    });
  }

  processScheduleAssessmentPeriod(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.ScheduleAssessmentInfo.length) {
        this.ScheduleAssessStatusID = data.result.recordset.ScheduleAssessmentInfo[0].ScheduleAssessmentStatusID;
        const info = data.result.recordset.ScheduleAssessmentInfo[0];
        if (this.copy?.mode === 'edit' && info?.IsInternalReviewRequired !== undefined) {
          this.masterForm.patchValue({
            isInternalReviewRequired: !!info.IsInternalReviewRequired
          });
        }
      }
      if (data.result.recordset.SchedeuleAssessmentPeriod.length > 0) {
        this.AssessmentPeriodDS = data.result.recordset.SchedeuleAssessmentPeriod;
        if (this.copy.mode == 'edit') {
          let period = this.AssessmentPeriodDS.find((s: any) => s.SchedulePeriod == this.copy.SchedulePeriod);
          if (period == undefined) {
            this.AssessmentPeriodDS.push({ SchedulePeriod: this.copy.SchedulePeriod });
          }
        }
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }


  getReviewer(): void {
    this.service.getActiveReviewer().subscribe(res => {
      next:
      this.processReviewer(res);
    });
  }

  processReviewer(data: any): void {
    if (data.success == 1) {
      if (data.result.recordset.Reviewer.length > 0) {
        this.reviewerDS = data.result.recordset.Reviewer;
      }
    } else {
      if (data.error.errorCode == "TOKEN_EXPIRED")
        this.utils.relogin(this._document);
    }
  }

  getError(): any {
    if (this.masterForm.get('ddlReviewer1')?.touched || this.masterForm.get('ddlReviewer2')?.touched) {
      if (this.masterForm.get('ddlReviewer1')?.value === this.masterForm.get('ddlReviewer2')?.value) {
        this.userSame = true;
        console.log('this.saveerror: ' + this.userSame)
        return "Reviewer(s) cannot be same";
      } else {
        this.userSame = false;
      }
    }
  }

  validateSave(): void {
    let obj: any = {
      "schedulePeriod": this.masterForm.get('schedulePeriod')?.value,
      "proposedStartDate": this.utils.ignoreTimeZone(this.masterForm.get('txtProsessedStartDate')?.value),
      "proposedCompletionDate": this.utils.ignoreTimeZone(this.masterForm.get('txtProsessedEndDate')?.value),
      "primaryReviewerID": this.masterForm.get('ddlReviewer1')?.value,
      "secondaryReviewerID": this.masterForm.get('ddlReviewer2')?.value,
      "scheduleAssessmentDescription": this.masterForm.get('txtDescription')?.value,
      "reminderDate": this.utils.ignoreTimeZone(this.masterForm.get('reminderDate')?.value),
      "isInternalReviewRequired": this.masterForm.get('isInternalReviewRequired')?.value
    };

    if (this.masterForm.get('txtRateId')?.value == "" || this.masterForm.get('txtRateId')?.value == null) {
      this.service.addNew(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
        error:
        console.log("err::", "error");
      });
    }
    else {
      obj.id = this.masterForm.get('txtRateId')?.value;
      this.service.updateData(obj).subscribe(res => {
        next:
        if (res.success == 1) {
          this.dialogRef.close(true);
          this.saveSuccess(res.message);
        } else {
          if (res.error.errorCode == "TOKEN_EXPIRED")
            this.utils.relogin(this._document);
          else
            this.saveerror = res.error.errorMessage;
        }
        error:
        console.log("err::", "error");
      });
    }
  }

  saveSuccess(content: string): void {
    const timeout = 3000; // 3 Seconds
    const confirm = this.dialog.open(InfoComponent, {
      id: "InfoComponent",
      disableClose: true,
      minWidth: "5vh",
      panelClass: "success",
      data: {
        title: "Success",
        content: content
      }
    });
    confirm.afterOpened().subscribe(result => {
      setTimeout(() => {
        confirm.close();
      }, timeout)
    });
  }

  quaterDetailsData(): any {
    let year = this.selectedPeriodYearValue;
    let quarterValue = this.selectedPeriodQuarterValue;
    if (quarterValue === 1) {
      return {
        startQuaterDate: new Date(year, 0, 1),
        endQuaterDate: new Date(year, 3, 0)
      }
    }
    if (quarterValue === 2) {
      return {
        startQuaterDate: new Date(year, 3, 1),
        endQuaterDate: new Date(year, 6, 0)
      }
    }
    if (quarterValue === 3) {
      return {
        startQuaterDate: new Date(year, 6, 1),
        endQuaterDate: new Date(year, 9, 0)
      }
    }
    if (quarterValue === 4) {
      return {
        startQuaterDate: new Date(year, 9, 1),
        endQuaterDate: new Date(year, 12, 0)
      }
    }
  }

  selectRadio() {
    this.radioSelect = true
  }
}