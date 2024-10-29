import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DepartmentComponent} from './department.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {DepartmentService} from '../../service/department.service';
import {of, throwError} from 'rxjs';
import {Department} from '../../model/department';

describe('DepartmentComponent', () => {
  let component: DepartmentComponent;
  let fixture: ComponentFixture<DepartmentComponent>;
  let departmentService: jasmine.SpyObj<DepartmentService>;

  beforeEach(async () => {
    const departmentServiceSpy = jasmine.createSpyObj('DepartmentService', [
      'getAllDepartments',
      'createDepartment',
      'updateDepartment',
      'deleteDepartment'
    ]);

    await TestBed.configureTestingModule({
      declarations: [DepartmentComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {provide: DepartmentService, useValue: departmentServiceSpy}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentComponent);
    component = fixture.componentInstance;
    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;

    departmentService.getAllDepartments.and.returnValue(of([]));
    departmentService.createDepartment.and.returnValue(of(new Department()));
    departmentService.updateDepartment.and.returnValue(of(new Department()));
    departmentService.deleteDepartment.and.returnValue(of(undefined));

    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize departments on ngOnInit', () => {
    const mockDepartments: Department[] = [{id: 1, name: 'HR', readOnly: false, mandatory: false}];
    departmentService.getAllDepartments.and.returnValue(of(mockDepartments));

    component.ngOnInit();

    expect(departmentService.getAllDepartments).toHaveBeenCalled();
  });

  it('should create a new department', () => {
    const newDepartment: Department = {id: 2, name: 'IT', readOnly: false, mandatory: true};
    departmentService.createDepartment.and.returnValue(of(newDepartment));

    component.createDepartment();
    expect(departmentService.createDepartment).toHaveBeenCalledWith(component.department);
  });

  it('should update an existing department', () => {
    const selectedDepartment: Department = {id: 1, name: 'Finance', readOnly: false, mandatory: false};
    component.department = selectedDepartment;
    departmentService.updateDepartment.and.returnValue(of(selectedDepartment));

    component.updateDepartment();

    expect(departmentService.updateDepartment).toHaveBeenCalledWith(selectedDepartment);
  });

  it('should delete a department', () => {
    const departmentId = 1;
    departmentService.deleteDepartment.and.returnValue(of(undefined));

    component.deleteDepartment(departmentId);

    expect(departmentService.deleteDepartment).toHaveBeenCalledWith(departmentId);

  });


  it('should handle error in getAllDepartments', () => {
    spyOn(console, 'error');
    departmentService.getAllDepartments.and.returnValue(throwError('error'));

    component.getAllDepartments();

    expect(console.error).toHaveBeenCalledWith('An error occurred:', 'error');
  });
});
