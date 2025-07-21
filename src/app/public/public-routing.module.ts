import { RouterModule, Routes } from "@angular/router";

import { PublicRoutes } from "./public.routes";
import { NgModule } from "@angular/core";
import { LoginComponent } from "./page/auth/login/login.component";
import { RegisterComponent } from "./page/auth/register/register.component";
import { HomeComponent } from "./page/home/home.component";



const routes: Routes = [

    {
      path: PublicRoutes.Home,
     title: 'Home',
     component: HomeComponent,
    },
    // {
    //   path: PublicRoutes.Services,
    //   title: 'Home',
    //   component: HomeServicesComponent,
    // },
    // {
    //   path: PublicRoutes.Contact,
    //   title: 'Home',
    //   component: HomeContactComponent,
    // },
    {
      path: PublicRoutes.Login,
      title: 'Login',
      component: LoginComponent,
    },
    {
      path: PublicRoutes.Register,
      title: 'Register',
      component: RegisterComponent,
    },
    // {
    //   path: PublicRoutes.Profile,
    //   title: 'Profile',
    //   component: HomeProfileComponent,
    // },
    //   {
    //   path: PublicRoutes.Vehicles,
    //   title: 'Vehicles',
    //   component: HomeVehiclesComponent,
    // },
    // {
    //   path: PublicRoutes.Appointments,
    //   title: 'Appointments',
    //   component: HomeAppointmentComponent,
    // },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
export class PublicRoutingModule {}