import { Router } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { Component ,OnInit,Inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit { username: string = ''; userEmail: string = '';
  constructor(  private http: HttpClient, private router: Router,
    private userService: UserService) {this.userService.user$.subscribe((user) => {
      console.log(user?.email)
      this.username = user?.name; 
      this.userEmail = user?.email;
      console.log(this.username);
    }); }
ngOnInit() {}
    



createTemplate() {
 this.router.navigate(['/code-editordashboard',{ queryParams: { templateName: 'Untitled' } }]);
}

    }



