import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EmployeeComponent} from './employee.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {EmployeeService} from '../../service/employee.service';
import {DepartmentService} from '../../service/department.service';
import {of, throwError} from 'rxjs';
import {Employee} from '../../model/employee';
import {Department} from '../../model/department';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let departmentService: jasmine.SpyObj<DepartmentService>;

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getAllEmployee',
      'createEmployee',
      'updateEmployee',
      'deleteEmployee'
    ]);

    const departmentServiceSpy = jasmine.createSpyObj('DepartmentService', ['getAllDepartments']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeComponent],
      imports: [ReactiveFormsModule, NgMultiSelectDropDownModule.forRoot()],
      providers: [
        FormBuilder,
        {provide: EmployeeService, useValue: employeeServiceSpy},
        {provide: DepartmentService, useValue: departmentServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;

    employeeService.getAllEmployee.and.returnValue(of([]));
    employeeService.createEmployee.and.returnValue(of(new Employee()));
    employeeService.updateEmployee.and.returnValue(of(new Employee()));
    employeeService.deleteEmployee.and.returnValue(of(new Employee()));
    departmentService.getAllDepartments.and.returnValue(of([]));

    fixture.detectChanges();
  })

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load employees and departments on init', () => {
    spyOn(component, 'getAllEmployee');
    spyOn(component, 'getAllDepartments');

    component.ngOnInit();

    expect(component.getAllEmployee).toHaveBeenCalled();
    expect(component.getAllDepartments).toHaveBeenCalled();
    expect(component.empDetail).toBeDefined();
  });

  it('should call createEmployee with populated employee data', () => {
    const newEmployee = {id: 1, nameFirst: 'John', nameLast: 'Doe', departments: []};
    employeeService.createEmployee.and.returnValue(of(newEmployee));

    component.empDetail.patchValue({
      id: 1,
      nameFirst: 'John',
      nameLast: 'Doe',
      departments: []
    });

    component.createEmployee();

    expect(employeeService.createEmployee).toHaveBeenCalledWith(jasmine.any(Employee));
  });

  it('should call updateEmployee with existing employee data', () => {
    const updatedEmployee = {id: 1, nameFirst: 'Jane', nameLast: 'Smith', departments: []};
    component.selectedEmployee = {id: 1, nameFirst: 'Jane', nameLast: 'Smith', departments: []};
    employeeService.updateEmployee.and.returnValue(of(updatedEmployee));

    component.empDetail.patchValue({
      id: 1,
      nameFirst: 'Jane',
      nameLast: 'Smith',
      departments: []
    });

    component.updateEmployee();

    expect(employeeService.updateEmployee).toHaveBeenCalledWith(jasmine.any(Employee));
  });

  it('should populate form with employee data for editing', () => {
    const employee = {id: 2, nameFirst: 'Alice', nameLast: 'Brown', departments: []};

    component.editEmployee(employee);


    expect(component.selectedEmployee).toEqual(employee);
  });

  it('should delete an employee and refresh the list', () => {
    const employee = {id: 2, nameFirst: 'Alice', nameLast: 'Brown', departments: []};

    spyOn(component, 'refreshListAndResetForm');
    employeeService.deleteEmployee.and.returnValue(of(new Employee()));

    component.deleteEmployee(employee);

    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(employee);
    expect(component.refreshListAndResetForm).toHaveBeenCalled();
  });

  it('should handle errors in createEmployee', () => {
    spyOn(console, 'error');
    employeeService.createEmployee.and.returnValue(throwError('error'));

    component.createEmployee();

    expect(console.error).toHaveBeenCalledWith('An error occurred:', 'error');
  });

  it('should handle errors in getAllDepartments', () => {
    spyOn(console, 'error');
    departmentService.getAllDepartments.and.returnValue(throwError('error'));

    component.getAllDepartments();

    expect(console.error).toHaveBeenCalledWith('An error occurred:', 'error');
  });

});
