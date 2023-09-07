import { Component ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  email: string=""
  password: string="";
  

  constructor(  private http: HttpClient, private router: Router,
    private userService: UserService,private formBuilder: FormBuilder) { }

    ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]]
      });
    }
    

  login() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/login', loginData)
      .subscribe(
        (response: any) => {
          console.log(response.message);
          console.log(response);
          const username = response.username;
          const email=response.email;
      this.userService.setUser({ name: username,email: email });
      

      // Redirect to the code editor page after successful login
      this.router.navigate(['/dashboard']);
          // Handle successful login here, such as redirecting to another page
        },
        (error) => {
          console.log(error);
          // Handle login error here, display error message to the user
        }
      );

      
  }
}
