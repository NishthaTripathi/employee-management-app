import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Department} from "../../model/department";
import {DepartmentService} from "../../service/department.service";


@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departmentForm: FormGroup;
  department: Department = new Department();
  departments: Department[] = [];
  selectedDepartment: Department = new Department();


  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {

    this.departmentForm = this.fb.group({
      id: [''],
      name: [''],
      readOnly: [false],
      mandatory: [false]
    });
  }

  ngOnInit(): void {
    this.getAllDepartments();
  }

  getAllDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments: Department[]) => {
        this.departments = departments;
      },
      error: (error: any) => {
        console.error("Error fetching departments:", error);
      }
    });
  }


  createDepartment(): void {
    this.department.name = this.departmentForm.value.name;
    this.department.readOnly = this.departmentForm.value.readOnly;
    this.department.mandatory = this.departmentForm.value.mandatory;
    this.departmentService.createDepartment(this.department).subscribe({
      next: (newDepartment: Department) => {
        console.log("Department created:", newDepartment);
        this.getAllDepartments();
        this.departmentForm.reset();
      },
      error: (error: any) => {
        console.error("Error creating department:", error);
      }
    });
  }

  editDepartment( dept: Department): void{
    this.departmentForm.controls['name'].setValue(dept.name);
    this.departmentForm.controls['readOnly'].setValue(dept.readOnly);
    this.departmentForm.controls['mandatory'].setValue(dept.mandatory);
    this.selectedDepartment=dept;
  }

  updateDepartment(): void {
    this.department.id=this.selectedDepartment.id;
    this.department.name = this.departmentForm.value.name;
    this.department.readOnly = this.departmentForm.value.readOnly;
    this.department.mandatory = this.departmentForm.value.mandatory;
    this.departmentService.updateDepartment(this.department).subscribe({
      next: (updatedDepartment: Department) => {
        console.log("Department updated:", updatedDepartment);
        this.getAllDepartments(); // Refresh the list
        this.departmentForm.reset(); // Clear form
      this.department= new Department();
      this.selectedDepartment=new Department();
      },
      error: (error: any) => {
        console.error("Error updating department:", error);
      }
    });
  }

  deleteDepartment(departmentId: number): void {
    this.departmentService.deleteDepartment(departmentId).subscribe({
      next: () => {
        console.log("Department deleted successfully");
        this.getAllDepartments(); // Refresh the list
      },
      error: (error: any) => {
        console.error("Error deleting department:", error);
      }
    });
  }
}
