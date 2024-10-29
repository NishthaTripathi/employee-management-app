import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http'
import {Employee} from "../model/employee";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  endpoint: string;

  constructor(private http: HttpClient) {
    this.endpoint = "http://" +
      "localhost:8080/employee"

  }

  createEmployee(emp: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.endpoint, emp);
  }

  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.endpoint);
  }

  updateEmployee(emp: Employee): Observable<Employee> {
    return this.http.put<Employee>(this.endpoint, emp);
  }

  deleteEmployee(emp: Employee): Observable<Employee> {
    return this.http.delete<Employee>(this.endpoint + '/' + emp.id);
  }
}
