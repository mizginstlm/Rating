/* eslint-disable prefer-const */
import BaseController from "./BaseController";
import formatter from "../utils/formatter";
import { EmployeeEntity } from "../entity/EmployeeEntity";
import { EmployeeService } from "../service/EmployeeService";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ReportData } from "../entity/ReportData";
import Event from "sap/ui/base/Event";


/**
 * @namespace mozos.rating.controller
 */

interface LocalState {
  isbusy: boolean;
  reportData: ReportData[];

}
export default class Report extends BaseController<LocalState> {
  //Formatter Tanımlama
  private formatter = formatter;

  public onInit(): void {
  
    

    super.onInit.apply(this, []); //Base deki verilere erişmek için Base onInit ini çalıştırmamız lazım

    this.viewState = {
      isbusy: false,
      reportData: []

    }
   
    this.GetReport();

  }
  public async GetReport() {

   
    this.viewState.reportData = await this.genericService.Request<ReportData[]>("ReportData", {
      begda: "20230101",
      endda: "20231201",
    });
    

    var report = this.viewState.reportData;
    report.forEach((element, i, arr) => {
      arr[i].bgtrm = this.datumToDottedDate(element.bgtrm);
      arr[i].entrm = this.datumToDottedDate(element.entrm);
    });
 


    this.RefreshViewState();
    console.log(this.viewState.reportData);
    this.onDemandsRouteMatch();
  }
  async editClick(awref: any,Pernr :any) {

      let data    = await this.genericService.Request<ReportData[]>("MasterData", {
      pernr: Pernr,
      awref: awref,
    });
    console.log(data);
    this.getRouter().navTo("Detailed", {
      awref: awref,
      pernr: Pernr,
      data: JSON.stringify(data),
    });
 
  }


   
  async onDemandsRouteMatch():Promise <void>{

    var beginOfYear = new Date(); //BUgünün tarihini verir
    beginOfYear.setDate(1); //Gün ayarı // 1
    beginOfYear.setMonth(0); //Ay ayarı index gibi 0 dan başlıyor //OCak

    var endOfYear = new Date();//BUgünün tarihini verir
    endOfYear.setMonth(11); // İndex olduğu için Aralık 11 e denk geliyor
    endOfYear.setDate(31); //Aralık ın son günü

    this.oMainModel.setProperty("/SelectedBegda", beginOfYear);
    this.oMainModel.setProperty("/SelectedEndda", endOfYear);
    this.onDateRangeChange();

  }

  
  async onDateRangeChange(): Promise<void> {
    let begda: Date = this.oMainModel.getProperty("/SelectedBegda");
    let endda: Date = this.oMainModel.getProperty("/SelectedEndda");
  
    if (begda) {
      begda.setHours(12);
    }
  
    if (endda) {
      endda.setHours(12);
    }
 

    let trbegda = this.getSapDateFormat(begda);
    let trendda = this.getSapDateFormat(endda);
    


    this.viewState.reportData = await this.genericService.Request<ReportData[]>("ReportData", {
     
      begda: trbegda,
      endda: trendda,
      
      // begda: begda,
      // endda: endda,
    });
    

    var report = this.viewState.reportData;
    report.forEach((element, i, arr) => {
      arr[i].bgtrm = this.datumToDottedDate(element.bgtrm);
      arr[i].entrm = this.datumToDottedDate(element.entrm);
    });
 


    this.RefreshViewState();
    console.log(this.viewState.reportData);

    
    // Rest of the code...
  }
  

}
