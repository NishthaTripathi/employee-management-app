import {Department} from "./department";

export class Employee {
  id: number=0;
  nameFirst : string='';
  nameLast: string='';
  departments:Department[]=[];
}
