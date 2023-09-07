import { Component ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';





@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class REGISTRATIONComponent implements OnInit {
  username: string="";
  email: string="";
  password: string="";
  confirmpassword: string="";
  registrationForm!: FormGroup;
  constructor(private http: HttpClient,private formBuilder: FormBuilder ) {
    
  }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmpassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmpassword');

    if (passwordControl && confirmPasswordControl) {
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

  register() {
    if (this.registrationForm.invalid) {
      return;
    }
  
    // Get the form values from the FormGroup
    const { username, email, password, confirmpassword } = this.registrationForm.value;
  
    const registrationData = {
      username: username,
      email: email,
      password: password,
      confirmpassword: confirmpassword
    };
  
    console.log(registrationData); // Add this line to log the registrationData before making the HTTP request
  
    this.http.post("http://localhost:3000/registration", registrationData).subscribe(
      (data) => {
        console.log(data);
        alert("USER REGISTER SUCCESSFULLY");
  
        this.username = "";
        this.email = "";
        this.password = "";
        this.confirmpassword = '';
      },
      (error) => {
        console.error(error);
        alert("Error registering user.");
      }
    );
  }
  
}
