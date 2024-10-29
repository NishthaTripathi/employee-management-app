import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Department } from "../../model/department";
import { DepartmentService } from "../../service/department.service";

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departmentForm: FormGroup;
  department: Department = new Department();
  departments: Department[] = [];
  selectedDepartment: Department | null = null;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.createDepartmentForm();
  }

  ngOnInit(): void {
    this.getAllDepartments();
  }

  createDepartmentForm(): FormGroup {
    return this.fb.group({
      id: [''],
      name: [''],
      readOnly: [false],
      mandatory: [false]
    });
  }

  private handleError(error: any): void {
    console.error("An error occurred:", error);
    throw error;
  }

  getAllDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments: Department[]) => {
        this.departments = departments;
      },
      error: this.handleError
    });
  }

  prepareDepartmentForm(department: Department = new Department()): void {
    this.departmentForm.patchValue({
      id: department.id,
      name: department.name,
      readOnly: department.readOnly,
      mandatory: department.mandatory
    });
    this.department = { ...department };
  }

  createDepartment(): void {
    this.populateDept();
    this.departmentService.createDepartment(this.department).subscribe({
      next: (newDepartment: Department) => {
        console.log("Department created:", newDepartment);
        this.refreshListAndResetForm();
      },
      error: this.handleError
    });
  }

  editDepartment(dept: Department): void {
    this.prepareDepartmentForm(dept);
    this.selectedDepartment = dept;
  }

  populateDept(): void {
    const { id, name,readOnly, mandatory } = this.departmentForm.value;
    Object.assign(this.department, { id, name,readOnly, mandatory});
  }

  updateDepartment(): void {
    this.populateDept();
    this.departmentService.updateDepartment(this.department).subscribe({
      next: (updatedDepartment: Department) => {
        console.log("Department updated:", updatedDepartment);
        this.refreshListAndResetForm();
      },
      error: this.handleError
    });
  }

  deleteDepartment(departmentId: number): void {
    this.departmentService.deleteDepartment(departmentId).subscribe({
      next: () => {
        console.log("Department deleted successfully");
        this.getAllDepartments(); // Refresh the list
      },
      error: this.handleError
    });
  }

  private refreshListAndResetForm(): void {
    this.getAllDepartments();
    this.departmentForm.reset();
    this.department = new Department();
    this.selectedDepartment = null;
  }
}

