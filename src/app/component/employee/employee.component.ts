import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Employee} from "../../model/employee";
import {EmployeeService} from "../../service/employee.service";
import {Department} from "../../model/department";
import {DepartmentService} from "../../service/department.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent  implements OnInit {

  empDetail !: FormGroup;
  empObject: Employee = new Employee();
  selectedEmployee: Employee= new Employee();
  empList: Employee[] = [];
  deptList: Department[] = [];
  dropdownSettings :IDropdownSettings = {
    singleSelection: false, // If you want multiple selections
    textField: "name",
    idField:"id",
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    enableCheckAll: true,
    allowSearchFilter: true,
    // Add any additional settings that are supported by the version you're using
  };

  constructor(private formBuilder: FormBuilder, private empService: EmployeeService, private depService: DepartmentService) {
  }

  ngOnInit(): void {
    this.getAllEmployee();
    this.getAllDepartments();
    this.empDetail = this.formBuilder.group({
        id: [''],
        nameFirst: [''],
        nameLast: [''],
        departments: []
      }
    );
  }

  createEmployee() {
    console.log(this.empDetail);
    this.empObject.id = this.empDetail.value.id;
    this.empObject.nameFirst = this.empDetail.value.nameFirst;
    this.empObject.nameLast = this.empDetail.value.nameLast;
    this.empObject.departments = this.empDetail.value.departments;
    this.empService.createEmployee(this.empObject).subscribe({
      next: (value) => {
        console.log('Employee created:', value);
        this.getAllEmployee();  // Refresh the list
      },
      error: (error) => {
        console.error('Error creating employee:', error);
      }
    });
  }

  getAllEmployee() {
    this.empService.getAllEmployee().subscribe({
      next: (res: Employee[]) => {
        this.empList = res;
      },
      error: (err: any) => {
        console.error("Error while fetching data:", err);
      }
    });
  }

  updateEmployee() {
    this.empObject.id =this.selectedEmployee.id;
    this.empObject.nameFirst = this.empDetail.value.nameFirst;
    this.empObject.nameLast = this.empDetail.value.nameLast;
    this.empObject.departments = this.empDetail.value.departments;
    this.empService.updateEmployee(this.empObject).subscribe({
      next: (res: Employee) => {
        console.log('Employee updated:', res);
        this.getAllEmployee();
        this.empDetail.reset();
        this.selectedEmployee=new Employee();

      },
      error: (err: any) => {
        console.error("Error updating employee:", err);
      }
    });
  }
  editEmployee( employee: Employee): void{
    this.empDetail.controls['nameFirst'].setValue(employee.nameFirst);
    this.empDetail.controls['nameLast'].setValue(employee.nameLast);
    this.empDetail.controls['departments'].setValue(employee.departments);
    this.selectedEmployee=employee;
  }

  deleteEmployee(emp: Employee) {
    this.empService.deleteEmployee(emp).subscribe({
      next: (res: any) => {
        console.log('Delete response:', res);
        alert('Employee deleted successfully');
        this.getAllEmployee();
        this.empDetail.reset();

      },
      error: (err: any) => {
        console.error("Error deleting employee:", err);
      }
    });
  }

  getAllDepartments() {
    this.depService.getAllDepartments().subscribe({
      next: (res: Department[]) => {
        this.deptList = res;
      },
      error: (err: any) => {
        console.error("Error fetching departments:", err);
      }
    });
  }

}
