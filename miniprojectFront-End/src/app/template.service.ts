import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http:  HttpClient, private userService: UserService) { }
  private backendUrl = 'http://localhost:3000';

  // Modify the function to accept templateData as an argument
  publishTemplate(templateData: { userEmail: string; code: string; output: string; templateName: string }) {
    const endpoint = `${this.backendUrl}/publish`;
    return this.http.post<any>(endpoint, templateData);
  }
}

