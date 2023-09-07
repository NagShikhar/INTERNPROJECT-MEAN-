import { Component, AfterViewInit, ViewChild, ElementRef ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as ace from 'ace-builds';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user.service';
import { TemplateService } from 'src/app/template.service';
@Component({
  selector: 'app-codeeditor',
  templateUrl: './codeeditor.component.html',
  styleUrls: ['./codeeditor.component.css']
})
export class CodeeditorComponent implements AfterViewInit, OnInit {
  @ViewChild('editorContainer') editorContainer!: ElementRef<HTMLElement>;

  editor!: ace.Ace.Editor;
  renderedHTML: string = '';
  TemplateName: string = 'Untitled';
  isTemplateNameEmpty: boolean = false;
  username: string = '';
  isNewTemplate: boolean = true; // Flag to track if it's a new template or an existing one
  currentFilename: string = '';
  templateNameToFileMap: { [key: string]: string } = {}; // Mapping to store template name to filename correspondence
  code: string = ''; // Assuming the code is stored in this variable
  output: string = ''; // Assuming the output is stored in this variable


  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private templateService: TemplateService
  ) {
    this.userService.user$.subscribe((user) => {
      this.username = user?.name;
    });
  }

  ngAfterViewInit(): void {
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');

    this.editor = ace.edit(this.editorContainer.nativeElement);
    this.editor.setTheme('ace/theme/twilight');
    this.editor.getSession().setMode('ace/mode/html');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const templateName = params['templateName'];
      if (templateName) {
        // Editing an existing template, load its content
        this.TemplateName = templateName;
        this.isNewTemplate = false;
        this.loadTemplate(templateName); // Load the content of the existing template
      } else {
        // New template, reset content and name
       
        this.renderedHTML = '';
        this.TemplateName = 'Untitled';
        this.isNewTemplate = true;
        
      }
    });
  }

 
// To Save Locally  
  saveTemplate() {
    if (this.TemplateName.trim() === '') {
      this.isTemplateNameEmpty = true;
      return;
    }

    const htmlCode = this.editor.getValue();
    this.renderedHTML = htmlCode;

    const postData: { name: string; html: string; oldName?: string; currentFilename?: string } = {
      name: this.TemplateName,
      html: this.renderedHTML
    };

    // If it's not a new template (renaming an existing template)
    if (!this.isNewTemplate) {
      // Send the current template name and the new template name to the backend for renaming the file
      postData.oldName = this.route.snapshot.queryParams['templateName'];
      // Add the current filename after renaming
      postData.currentFilename = this.currentFilename;
    }

    this.http.post<any>('http://localhost:3000/saveTemplate', postData).subscribe(
      (data) => {
        console.log(`Template '${this.TemplateName}' saved locally with filename: ${data.filename}`);
        alert('TEMPLATE SAVED SUCCESSFULLY');
        this.isTemplateNameEmpty = false; // Reset the flag after a successful save

        // Update the template name with the new name returned from the backend
        this.TemplateName = data.name;

        // If it's a new template, update the flag and navigate to the new URL with the template name
        if (this.isNewTemplate) {
          this.isNewTemplate = false;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { templateName: this.TemplateName },
            queryParamsHandling: 'merge'
          });
        }

        // Update the current filename to the new filename (for consecutive renaming)
        this.currentFilename = data.filename;
      },
      (error) => {
        console.error('Error saving template:', error);
      }
    );
  }
   loadTemplate(templateName: string) {
    this.http.get<any>(`http://localhost:3000/loadTemplate/${templateName}`).subscribe(
      (data) => {
        this.editor.setValue(data.html);
        this.renderedHTML = data.html;
      },
      (error) => {
        console.error('Error loading template:', error);
      }
    );
  }
//Previewrun
Previewrun() {
  const htmlCode = this.editor.getValue();
  this.renderedHTML = htmlCode;
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(this.renderedHTML);
    newWindow.document.close();
  } else {
    // Handle the case when the window is blocked by the pop-up blocker
    console.error('Unable to open a new window. Please disable your pop-up blocker.');
  }
  
}
//PUBLISH
publishTemplate() {
  // Get the logged-in user's email from UserService
 
  const userEmail = this.userService.getUser()?.email;
  console.log("this is the userEmail", userEmail);
  // Get the HTML code from the editor
  const htmlCode = this.editor.getValue();
  this.renderedHTML = htmlCode

  console.log("this is the htmlCode", htmlCode);
  

  // Set the code and output values for templateData
  const templateData = {
    userEmail: userEmail,
    code: htmlCode,
    output: this.renderedHTML, // Use this.renderedHTML as the output
    templateName: this.TemplateName
  };

  // Save the template to MongoDB and send an email to the logged-in user
  this.templateService.publishTemplate(templateData).subscribe(
    (response) => {
      console.log('Template published successfully!', response);
     
    },
    (error) => {
      console.error('Error publishing template:', error);
     
    }
  );
}

//LOGOUT
  logout() {
    
    this.userService.clearUser();
    this.router.navigate(['/home']);
  }
}
