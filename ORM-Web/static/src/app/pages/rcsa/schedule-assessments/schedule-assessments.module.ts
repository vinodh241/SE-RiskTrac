import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleAssessmentsRoutingModule } from './schedule-assessments-routing.module';
import { MatModule } from 'src/app/modules/mat/mat.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { ScheduleAssessmentsComponent } from './schedule-assessments.component';
import { NewScheduleAssessmentsComponent } from './new-schedule-assessments/new-schedule-assessments.component';
import { InprogressScheduleAssessmentsComponent } from './inprogress-schedule-assessments/inprogress-schedule-assessments.component';
import { CompletedScheduleAssessmentsComponent } from './completed-schedule-assessments/completed-schedule-assessments.component';
import { ScheduleAssessmentsDetailsComponent } from './schedule-assessments-details/schedule-assessments-details.component';
import { MatPaginator } from '@angular/material/paginator';


@NgModule({
  declarations: [
    ScheduleAssessmentsComponent,
    NewScheduleAssessmentsComponent,
    InprogressScheduleAssessmentsComponent,
    CompletedScheduleAssessmentsComponent,
    ScheduleAssessmentsDetailsComponent    
  ],
  imports: [
    CommonModule,
    ScheduleAssessmentsRoutingModule,
    MatModule,
    MatGridListModule,
    FlexLayoutModule,
    ColorPickerModule,
    
  ],
  exports:[
    ScheduleAssessmentsComponent,
    NewScheduleAssessmentsComponent,
    InprogressScheduleAssessmentsComponent,
    CompletedScheduleAssessmentsComponent,
    MatPaginator
  ]
})
export class ScheduleAssessmentsModule { }
