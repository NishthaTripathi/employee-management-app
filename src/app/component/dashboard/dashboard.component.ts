import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms'
import {Employee} from "../../model/employee";
import {EmployeeService} from "../../service/employee.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  empDetail !: FormGroup;
  empObject: Employee = new Employee();


  constructor(private formBuilder: FormBuilder, private empService: EmployeeService) {
  }

  ngOnInit(): void {
    this.empDetail = this.formBuilder.group({
        id: [''],
        nameFirst: [''],
        nameLast: ['']
      }
    );
  }

  createEmployee() {
    console.log(this.empDetail);
    this.empObject.id = this.empDetail.value.id;
    this.empObject.nameFirst = this.empDetail.value.nameFirst;
    this.empObject.nameLast = this.empDetail.value.nameLast;
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
    this.empService.getAllEmployee().subscribe(res => {
      this.empList = res;
    }, err => {
      console.log("error while fetching data.")
    });
  }

  editEmployee(emp: Employee) {
    this.empDetail.controls['id'].setValue(emp.id);
    this.empDetail.controls['nameFirst'].setValue(emp.nameFirst);
    this.empDetail.controls['nameLast'].setValue(emp.nameLast);

  }

  updateEmployee() {

    this.empObject.id = this.empDetail.value.id;
    this.empObject.nameFirst = this.empDetail.value.nameFirst;
    this.empObject.nameLast = this.empDetail.value.nameLast;

    this.empService.updateEmployee(this.empObject).subscribe(res => {
      console.log(res);
      this.getAllEmployee();
    }, err => {
      console.log(err);
    })

  }

  deleteEmployee(emp: Employee) {

    this.empService.deleteEmployee(emp).subscribe(res => {
      console.log(res);
      alert('Employee deleted successfully');
      this.getAllEmployee();
    }, err => {
      console.log(err);
    });

  }
}
