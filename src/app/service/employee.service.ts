import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  createEmpUrl: string;

  constructor(private http: HttpClient) {
    this.createEmpUrl = "http:localhost:8080/employee"
  }

  createEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.createEmpUrl, emp);
  }

  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.getEmpURL);
  }

  updateEmployee(emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.updateEmpUrl, emp);
  }

  deleteEmployee(emp: Employee): Observable<Employee> {
    return this.http.delete<Employee>(this.deleteEmpUrl + '/' + emp.id);
  }
}
