import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaselayoutComponent } from './pages/common/components/baselayout/baselayout.component';
import { AuthComponent } from './pages/auth/components/auth/auth.component';
import { RegisterationComponent } from './pages/auth/components/registeration/registeration.component';

const routes: Routes = [
  {
    path:'',
    component: AuthComponent,
  },
  {
    path:'register',
    component: RegisterationComponent,
  },
  {
    path: 'hw4',
    component: BaselayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () => import('./pages/main/main.module').then((x) => x.MainModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then((x) => x.ProfileModule),
      },
    ],
  },
  // {
  //   path: "**",
  //   redirectTo: "error-page/404",
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
