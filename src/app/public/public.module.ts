import { NgModule } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { PublicComponent } from "./public.component";
import { PublicRoutingModule } from "./public-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { LoginComponent } from "./page/auth/login/login.component";
import { NgZorroModule } from "../shared/layout.module";
import { HomeHeaderComponent } from "./components/home-header/home-header.component";
import { RegisterComponent } from "./page/auth/register/register.component";

@NgModule({
    declarations: [PublicComponent, LoginComponent, RegisterComponent],
    imports: [
      HomeHeaderComponent,
    PublicRoutingModule,
    RouterOutlet,
    ReactiveFormsModule,
    CommonModule,
    NgZorroModule,
    ReactiveFormsModule

]
  })
  export class PublicModule {}