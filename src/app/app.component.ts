import { Component, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { hospitalData, waitingList } from './data';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { extend, closest, remove,createElement, addClass,L10n } from '@syncfusion/ej2-base';
import {
  EventSettingsModel, View, GroupModel, TimelineViewsService, TimelineMonthService,PopupOpenEventArgs,AgendaService,
  ResizeService, WorkHoursModel, DragAndDropService, ResourceDetails, ScheduleComponent, ActionEventArgs, CellClickEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { Input } from '@syncfusion/ej2-inputs';
import { DragAndDropEventArgs } from '@syncfusion/ej2-navigations';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { DataManager, ODataV4Adaptor, Query, ReturnOption,UrlAdaptor} from '@syncfusion/ej2-data';
let SERVICE_URI =  'https://tanklinepro.com/commonapp/angular_data/';
L10n.load({
  'en-US': {
  'schedule': {
  'saveButton': 'add',
  'cancelButton': 'Close',
  'deleteButton': 'Remove',
  'newEvent': 'Delivery Schedule',
  },
}
});
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [TimelineViewsService, TimelineMonthService, ResizeService, DragAndDropService]
})
export class AppComponent {
  [x: string]: any;
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent | any ;
  @ViewChild('treeObj') public treeObj: TreeViewComponent | any;
  
  
  public categoryDataSource: Object[] | any ;
  public customer= [];
  public site=[];
  public material=[];
  public isTreeItemDropped = false;
  public draggedItemId = '';
  // public data: Record<string, any>[] = extend([], hospitalData, "", true) as Record<string, any>[];
  public selectedDate: Date = new Date(2021, 7, 2);
  public currentView: View = 'TimelineDay';
  public workHours: WorkHoursModel = { start: '08:00', end: '18:00' };
  public field: Object[] | any ;
  // public field: Record<string, any> = { dataSource: waitingList, id: 'Id', text: 'Name' };
  public ngOnInit(): void { 
    new DataManager({ url: SERVICE_URI, adaptor: new ODataV4Adaptor })
    .executeQuery(new Query().from('get_driver_data'))
    .then((e: ReturnOption) => {
    var data1 = e.result as object[] | any;
    this.categoryDataSource = data1['truck']; 
    // console.log(data1['customer']);
    this.customer = data1['customer'];
    this.site = data1['site'];
    this.field = { dataSource: data1['site'], id: 'Value', text: 'Text' };
    this.material = data1['material'];
  });  
  
}
    
 /* public departmentDataSource: Record<string, any>[] = [
    { Text: 'GENERAL', Id: 1, Color: '#bbdc00' },
    { Text: 'DENTAL', Id: 2, Color: '#9e5fff' }
  ];
  public consultantDataSource: Record<string, any>[] = [
    { Text: 'Alice', Id: 1, GroupId: 1, Color: '#bbdc00', Designation: 'Cardiologist' },
    { Text: 'Nancy', Id: 2, GroupId: 2, Color: '#9e5fff', Designation: 'Orthodontist' },
    { Text: 'Robert', Id: 3, GroupId: 1, Color: '#bbdc00', Designation: 'Optometrist' },
    { Text: 'Robson', Id: 4, GroupId: 2, Color: '#9e5fff', Designation: 'Periodontist' },
    { Text: 'Laura', Id: 5, GroupId: 1, Color: '#bbdc00', Designation: 'Orthopedic' },
    { Text: 'Margaret', Id: 6, GroupId: 2, Color: '#9e5fff', Designation: 'Endodontist' }
  ];*/
  public group: GroupModel = { enableCompactView: false, resources: ['Departments', 'Consultants'] };
  public allowMultiple = false;
  public showQuickInfo: Boolean =false;
 /* public eventSettings: EventSettingsModel = {
    dataSource: [],
    fields: {
      id: 'Id',
      subject: { name: 'Subject', title: 'Event Name' },
      location: { name: 'Location', title: 'Event Location'},
      description: { name: 'Description', title: 'Event Description' },
      startTime: { name: 'StartTime', title: 'Start Duration' },
      endTime: { name: 'EndTime', title: 'End Duration'  },
      followingID: { name: 'EndTime', title: 'End Duration'  }
  }
    // dataSource: this.data,
    // fields: {
    //   subject: { title: 'Patient Name', name: 'Name' },
    //   startTime: { title: 'From', name: 'StartTime' },
    //   endTime: { title: 'To', name: 'EndTime' },
    //   description: { title: 'ConsultantID', name: 'Description' }
    // }
  };*/
  private postdata: DataManager = new DataManager({ 
      url: ' https://tanklinepro.com/commonapp/angular_sch',
      crudUrl:' https://tanklinepro.com/commonapp/angular_sch', 
      crossDomain: true,
      adaptor: new UrlAdaptor,
    });
  public eventSettings: EventSettingsModel = {  
    dataSource:  this.postdata, query: this.datadriver,
    fields: {
      subject: { title: 'Patient Name', name: 'Name' },
      startTime: { title: 'From', name: 'StartTime' },
      endTime: { title: 'To', name: 'EndTime' },
      description: { title: 'Description', name: 'Description' },
      consultantid: { title: 'Trucks', name: 'Trucks' }
    }
  };

  // public field: Record<string, any> = { dataSource: waitingList, id: 'Id', text: 'Name' };
  public allowDragAndDrop = true;

  constructor() {
    
  }
  // public eventAdded: boolean = false; 

  public getConsultantName(value: ResourceDetails): string {
    return (value as ResourceDetails).resourceData.Text as string;
    // return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
  }

  public getConsultantStatus(value: ResourceDetails): boolean {
    const resourceName: string = this.getConsultantName(value);
    return !(resourceName === 'GENERAL' || resourceName === 'DENTAL');
  }

  public getConsultantDesignation(value: ResourceDetails): string {
    const resourceName: string = this.getConsultantName(value);
    if (resourceName === 'GENERAL' || resourceName === 'DENTAL') {
      return '';
    } else {
      return (value as ResourceDetails).resourceData.Designation as string;
    }
  }

  public getConsultantImageName(value: ResourceDetails): string {
    return this.getConsultantName(value).toLowerCase();
  }

  public onItemDrag(event: any): void {
    if (this.scheduleObj.isAdaptive) {
      const classElement: HTMLElement = this.scheduleObj.element.querySelector('.e-device-hover');
      if (classElement) {
        classElement.classList.remove('e-device-hover');
      }
      if (event.event.target.classList.contains('e-work-cells')) {
        addClass([event.event.target], 'e-device-hover');
      }
    }
    if (document.body.style.cursor === 'not-allowed') {
      document.body.style.cursor = '';
    }
    if (event.name === 'nodeDragging') {
      const dragElementIcon: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag .e-icon-expandable');
      for (const icon of [].slice.call(dragElementIcon)) {
        // icon.style.display = 'none';
      }
    }
  }

  public onActionBegin(event: ActionEventArgs): void {
    console.log(event);
    console.log(event.data);
    let savedetail = event.data
    // console.log(savedetail[0]);
    /*if(args.data[0].CustomerName===null){     
      alert("Select Customer Name");
      this.scheduleObj.uiStateValues.isBlock = true;
      args.cancel = true;
      return  ;
      }
      else if(args.data[0].SiteName===null){
      alert("Select Site Name");
      this.scheduleObj.uiStateValues.isBlock = true;
      args.cancel = true;
      return ;
      }*/
    if (event.requestType === 'eventCreate' && this.isTreeItemDropped) {
      const treeViewData: Record<string, any>[] = this.treeObj.fields.dataSource as Record<string, any>[];
      const filteredPeople: Record<string, any>[] = treeViewData.filter((item: any) => item.Id !== parseInt(this.draggedItemId, 10));
      this.treeObj.fields.dataSource = filteredPeople;
      const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.e-drag-item.treeview-external-drag');
      for (const element of [].slice.call(elements)) {
        remove(element);
      }
    }
  }

  public onTreeDragStop(event: DragAndDropEventArgs): void {
    const treeElement: Element = closest(event.target, '.e-treeview') as Element;
    const classElement: HTMLElement = this.scheduleObj.element.querySelector('.e-device-hover');
    if (classElement) {
      classElement.classList.remove('e-device-hover');
    }
    if (!treeElement) {
      event.cancel = true;
      const scheduleElement: Element = closest(event.target, '.e-content-wrap') as Element;
      if (scheduleElement) {
        const treeviewData: Record<string, any>[] = this.treeObj.fields.dataSource as Record<string, any>[];
        if (event.target.classList.contains('e-work-cells')) {
          const filteredData: Record<string, any>[] = treeviewData.filter((item: any) =>          
            item.Value == parseInt(event.draggedNodeData.id as string, 10));
          const cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(event.target);
          const resourceDetails: ResourceDetails = this.scheduleObj.getResourcesByIndex(cellData.groupIndex);
          const eventData: Record<string, any> = {
            SiteName: filteredData[0].Value,
            StartTime: cellData.startTime,
            EndTime: cellData.endTime,
            IsAllDay: cellData.isAllDay,
            Description: filteredData[0].Description,
            DepartmentID: resourceDetails.resourceData.GroupId,
            ConsultantID: resourceDetails.resourceData.Id
          };
          this.scheduleObj.openEditor(eventData, 'Add', true);
          this.isTreeItemDropped = true;
          this.draggedItemId = event.draggedNodeData.id as string;
        }
      }
    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
     // console.log(args.element.querySelector('.e-title-location-row'));
    if (args.type === 'Editor') {  
      if(args.element.querySelector('.e-title-location-row')!= null){
        let locationhtml: HTMLElement = <HTMLElement>args.element.querySelector('.e-title-location-row');
        locationhtml.remove();
      }
      if(args.element.querySelector('.custom-field-row')!= null){
        let locationhtml: HTMLElement = <HTMLElement>args.element.querySelector('.custom-field-row');
        locationhtml.remove();
      }
        // Create required custom elements in initial time
        if (!args.element.querySelector('.e-title-location-row')) {
      let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
      let formElement: HTMLElement = <HTMLElement>args.element.querySelector('.e-schedule-form') ;
            // console.log(formElement);
          formElement.insertBefore(<HTMLElement>row, args.element.querySelector('.e-dialog-parent'));
          formElement.insertBefore(<HTMLElement>row, args.element.querySelector('.e-dialog-parent'));

      let container: HTMLElement = createElement('div', { className: 'custom-field-container' });
      let containersite: HTMLElement = createElement('div', { className: 'custom-field-container' });

      let inputEle: HTMLInputElement = createElement('input', {
                className: 'e-field', attrs: { name: 'CustomerName '}
            }) as HTMLInputElement;
      let inputElestite: HTMLInputElement = createElement('input', {
              className: 'e-field', attrs: { name: 'SiteName' }
          }) as HTMLInputElement;
        
            container.appendChild(inputEle);
            containersite.appendChild(inputElestite);

            row.appendChild(container);
            row.appendChild(containersite);
            
      let dropDownList: DropDownList = new DropDownList({
            dataSource: this.customer,
            change: () =>{
              let customer_id="";
              if(dropDownListSite.value!=null){
                    for (var i = 0; i < this.site.length; i++) {
                      if(this.site[i]['Value']===dropDownListSite.value){
                        customer_id=this.site[i]['customer'];
                      }
                  }
              }
              if(dropDownList.value!=null && dropDownListSite.value==null || dropDownList.value!=customer_id  ){
                dropDownListSite.query = new Query().where('customer', 'equal', dropDownList.value);
                dropDownListSite.enabled = true;
                // dropDownListSite.text = null;
                dropDownListSite.dataBind();
              }else if(dropDownListSite.value==null){
                dropDownListSite.query = new Query();
                dropDownListSite.enabled = true;
                // dropDownListSite.text = null;
                dropDownListSite.dataBind();
              }
              this.remove_custerrorlabel(); 
                },
              allowFiltering: true,
              fields: { text: 'Text', value: 'Value'  },
              value: (<{ [key: string]: Object }>(args.data)).CustomerName as string,
              floatLabelType: 'Always', placeholder: 'Customer Name'
                });

      let dropDownListSite: DropDownList = new DropDownList({
              dataSource:  this.site,
              change: () => {
              let customer_id="";
              if(dropDownListSite.value!=null && dropDownList.value==null ){
              for (var i = 0; i < this.site.length; i++) {
              if(this.site[i]['Value']===dropDownListSite.value){
                  customer_id=this.site[i]['customer'];
                  }
                }
              dropDownList.value=customer_id;
              } 
                else if(dropDownList.value!=null){
                for (var i = 0; i < this.site.length; i++) {
                if(this.site[i]['Value']===dropDownListSite.value){
                    customer_id=this.site[i]['customer'];
                }
              }
                  dropDownList.value=customer_id;
                  }
              else{
                  dropDownListSite.query = new Query();
                  dropDownListSite.enabled = true;
                  // dropDownListSite.text = null;
                  dropDownListSite.dataBind();
              }
              this.remove_sitelabel();
                  },
              allowFiltering: true,
              fields: { text: 'Text', value: 'Value' },
              value: (<{ [key: string]: Object }>(args.data)).SiteName as string,
              floatLabelType: 'Always', placeholder: 'Site Name'
              });
              dropDownList.appendTo(inputEle);
              dropDownListSite.appendTo(inputElestite);
              inputEle.setAttribute('name', 'CustomerName');
              inputElestite.setAttribute('name', 'SiteName');
              // let eresourcesrow: HTMLElement = <HTMLElement>args.element.querySelector('.e-resources-row') ;
            // let fuelrow: HTMLElement = createElement('div', { className: 'fuel-row' });
            formElement.insertBefore(<HTMLElement>row, args.element.querySelector('.e-dialog-parent'));
            let material_cont: HTMLElement = createElement('div', { className: 'e-title-location-row' });
            let quanity_cont: HTMLElement = createElement('div', { className: 'e-title-location-row' });
            let inputmaterial: HTMLInputElement = createElement('input', {
                  className: 'e-field', attrs: { name: 'material'}
              }) as HTMLInputElement;
            let inputQuantity: HTMLInputElement = createElement('input', {
                    className: 'e-field e-input', attrs: { name: 'Quantity' }
                }) as HTMLInputElement;
                material_cont.appendChild(inputmaterial);
                quanity_cont.appendChild(inputQuantity);
                
                row.appendChild(material_cont);
                row.appendChild(quanity_cont);
            let dropDownListmaterial: DropDownList = new DropDownList({
              dataSource: this.material,
              fields: { text: 'text', value: 'value' },
              value: (<{ [key: string]: Object }>(args.data)).EventType as string,
              floatLabelType: 'Always', placeholder: 'Material'
            });
            dropDownListmaterial.appendTo(inputmaterial);
            inputmaterial.setAttribute('name', 'Material');
            Input.createInput ({
              element: inputQuantity,
              floatLabelType: "Always",
              properties: {
                  placeholder:'Quantity'
              }
            });
           
            // console.log(args.element.querySelector('#label_ConsultantID'));
            }    
          }
        }
        public remove_custerrorlabel(){
          let customererr=document.querySelector('#CustomerName_Error');
          if(customererr!=null){
          customererr.setAttribute('style', 'display:none;');
          }
      } 
      public remove_sitelabel(){
        let siteerr=document.querySelector('#SiteName_Error');
        if(siteerr!=null){
        siteerr.setAttribute('style', 'display:none;');        
        }
          } 
      

}
