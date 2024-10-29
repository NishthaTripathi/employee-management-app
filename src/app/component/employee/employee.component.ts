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
export class EmployeeComponent implements OnInit {

  empDetail!: FormGroup;
  empObject: Employee = new Employee();
  selectedEmployee: Employee = new Employee();
  empList: Employee[] = [];
  deptList: Department[] = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    textField: "name",
    idField: "id",
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    enableCheckAll: true,
    allowSearchFilter: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private empService: EmployeeService,
    private depService: DepartmentService
  ) {
    this.handleError = this.handleError.bind(this)
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getAllEmployee();
    this.getAllDepartments();
  }

  initializeForm(): void {
    this.empDetail = this.formBuilder.group({
      id: [''],
      nameFirst: [''],
      nameLast: [''],
      departments: [[]]
    });
  }

  handleError(error: any): void {
    console.error("An error occurred:", error);
    this.refreshListAndResetForm();
    throw error;
  }

  populateEmployeeData(): void {
    const {id, nameFirst, nameLast, departments = []} = this.empDetail.value;
    Object.assign(this.empObject, {id, nameFirst, nameLast, departments});
  }

  createEmployee(): void {
    this.populateEmployeeData();
    this.empService.createEmployee(this.empObject).subscribe({
      next: (newEmployee: Employee) => {
        console.log('Employee created:', newEmployee);
        this.refreshListAndResetForm();
      },
      error: this.handleError
    });
  }

  getAllEmployee(): void {
    this.empService.getAllEmployee().subscribe({
      next: (employees: Employee[]) => {
        this.empList = employees;
      },
      error: this.handleError
    });
  }

  updateEmployee(): void {
    this.populateEmployeeData();
    this.empObject.id = this.selectedEmployee.id;  // Retain original ID for update
    this.empService.updateEmployee(this.empObject).subscribe({
      next: (updatedEmployee: Employee) => {
        console.log('Employee updated:', updatedEmployee);
        this.refreshListAndResetForm();
      },
      error: this.handleError
    });
  }

  editEmployee(employee: Employee): void {
    this.setFormValues(employee);
    this.selectedEmployee = employee;
  }

  deleteEmployee(employee: Employee): void {
    this.empService.deleteEmployee(employee).subscribe({
      next: () => {
        console.log('Employee deleted successfully');
        alert('Employee deleted successfully');
        this.refreshListAndResetForm();
      },
      error: this.handleError
    });
  }

  setFormValues(employee: Employee): void {
    this.empDetail.patchValue({
      nameFirst: employee.nameFirst,
      nameLast: employee.nameLast,
      departments: employee.departments
    });
  }

  getAllDepartments(): void {
    this.depService.getAllDepartments().subscribe({
      next: (departments: Department[]) => {
        this.deptList = departments;
      },
      error: this.handleError
    });
  }

  refreshListAndResetForm(): void {
    this.getAllEmployee();
    this.empDetail.reset({
      id: '',
      nameFirst: '',
      nameLast: '',
      departments: []
    });
    this.empObject = new Employee();
    this.selectedEmployee = new Employee();
  }
}
