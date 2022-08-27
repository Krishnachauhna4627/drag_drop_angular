import { ToastAllModule } from '@syncfusion/ej2-angular-notifications';

import { DropDownButtonAllModule } from '@syncfusion/ej2-angular-splitbuttons';

import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';

import { DropDownListAllModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { MaskedTextBoxModule, UploaderAllModule } from '@syncfusion/ej2-angular-inputs';

import { ToolbarAllModule, ContextMenuAllModule } from '@syncfusion/ej2-angular-navigations';

import { ButtonAllModule, CheckBoxAllModule, SwitchAllModule } from '@syncfusion/ej2-angular-buttons';

import { DatePickerAllModule, TimePickerAllModule, DateTimePickerAllModule } from '@syncfusion/ej2-angular-calendars';

import { NumericTextBoxAllModule, TextBoxAllModule } from '@syncfusion/ej2-angular-inputs';

import { ScheduleAllModule, RecurrenceEditorAllModule } from '@syncfusion/ej2-angular-schedule';

// import { HttpModule } from '@angular/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
@NgModule({ declarations: [ AppComponent ], 
  imports: [ CommonModule, ScheduleAllModule, RecurrenceEditorAllModule,
       NumericTextBoxAllModule, TextBoxAllModule, DatePickerAllModule, 
       TimePickerAllModule, DateTimePickerAllModule, CheckBoxAllModule, 
         ToolbarAllModule, DropDownListAllModule, ContextMenuAllModule, 
         MaskedTextBoxModule, UploaderAllModule, MultiSelectAllModule, 
           TreeViewModule, ButtonAllModule, DropDownButtonAllModule, SwitchAllModule,
            BrowserModule, ToastAllModule], providers: [], bootstrap: [AppComponent]
})
export class AppModule { }
