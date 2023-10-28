/* eslint-disable prefer-const */
import BaseController from "./BaseController";
import formatter from "../utils/formatter";
import { EmployeeEntity } from "../entity/EmployeeEntity";
import { EmployeeService } from "../service/EmployeeService";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace mozos.rating.controller
 */
interface LocalState {
  isbusy: boolean;
}
export default class Main extends BaseController<LocalState> {
  //Formatter Tanımlama
  private formatter = formatter;

  public onInit(): void {
    super.onInit.apply(this, []); //Base deki verilere erişmek için Base onInit ini çalıştırmamız lazım
  }


}
