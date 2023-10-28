/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prefer-const */
import BaseController from "./BaseController";
import formatter from "../utils/formatter";
import { EmployeeEntity } from "../entity/EmployeeEntity";
import { EmployeeService } from "../service/EmployeeService";
import { ReportData } from "../entity/ReportData";
import { ListRequestItem, QuestionData } from "../entity/ListRequestItem";

import JSONModel from "sap/ui/model/json/JSONModel";
import { EvalQuestReturn } from "../entity/EvalQuestReturn";
import Int32 from "sap/ui/model/odata/type/Int32";

/**
 * @namespace mozos.rating.controller
 */

interface LocalState {
    isbusy: boolean;
    reportData: ReportData[];
    questionData: QuestionData[];
}

export default class Main extends BaseController<LocalState> {
    public formatter = formatter;

    public onInit(): void {
        super.onInit.apply(this, []); // Base deki verilere erişmek için Base onInit ini çalıştırmamız lazım

        this.viewState = {
            isbusy: false,

        };
        this.RefreshViewState();

        const oRouter = this.getRouter();
        oRouter.getRoute("Detailed").attachPatternMatched(this._onRouteMatched, this);
        this.viewState = {
            isbusy: false,
            reportData: [],
            questionData: []

        };

    }
    public async _onRouteMatched(oEvent: any) {
        var oArguments = oEvent.getParameter("arguments");
        this.oArguments = oArguments;
        var awref = oArguments.awref;


        let pernr = oArguments.pernr;



        let reportData = await this.genericService.Request<ReportData[]>("MasterData", {
            pernr: pernr,
            awref: awref,
        });

      
     

        this.getView().getModel("viewModel").setProperty("/reportData", reportData);

      
        
    
        var report = reportData;
      
        report.bgtrm = this.datumToDottedDate(reportData.bgtrm);
        report.entrm = this.datumToDottedDate(reportData.entrm);

        report.image = this.getImageUrlOfPersonnel(reportData.pernr)
            



        console.log(reportData);
       
    

        let questionDatas = await this.genericService.Request<EvalQuestReturn>("EvalQuest", {
            awref: awref,
        });

        this.getView().getModel("viewModel").setProperty("/questionDatas", questionDatas);
        console.log(questionDatas)
        // let validatorData = this.oMainModel.getProperty("/validatorData");
        let questionData = questionDatas.tList;
        questionData.forEach((element, i, arr) => {
            arr[i].rate = Number.parseInt(element.value)+1;
        });
      
        this.getView().getModel("viewModel").setProperty("/validatorData", questionData);

        

        let manager2 = await this.genericService.Request<Manager2>("Manager2", {
            awref: awref,
        });

        this.getView().getModel("viewModel").setProperty("/manager2", manager2);
        console.log(manager2);


    }


}
