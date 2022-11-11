import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../main.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  signupFG: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    repassword: ['', Validators.required]
  })
  
  error:any = null;
  ngOnInit(): void {
    let username = this.route.snapshot.paramMap.get('username')
    if(!username) {
      this.router.navigate(['/login'])
      return
    }
    username = String(username)
    let password = String(username)

    this.mainService.login(username, password).subscribe((data:any) => {
      if(data.err) {
        this.error = "Card Invalid Contact 9717130893"
      } else {
        if(data.isActivated) {
          this.error = null;
          localStorage.setItem("token", data.key)
          localStorage.setItem("username", String(username))
          this.router.navigate([`/${username}`])
        } else {
          console.log("Reaching here")
          localStorage.setItem("token", data.key)
          localStorage.setItem("username", String(username))
          // this.router.navigate([`/setup`])
        }
      }
    })
  }

  signup() {

    if(!this.signupFG.valid) {
      this.error = "All fields are mandatory"
      return
    }

    let username = this.signupFG.value.username
    let password = this.signupFG.value.password
    let repassword = this.signupFG.value.repassword
    
    if(password != repassword) {
      this.error = "Password do not match"
      return
    }

    this.mainService.signup(username, password).subscribe((data:any)=>{
      this.error = null
      if(data.err) {
        this.error = data.message
      } else {
        localStorage.setItem("token", data.key)
        localStorage.setItem("username", String(username))
        this.router.navigate([`/setting`])
      }
    })


  }

}
