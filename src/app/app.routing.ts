import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NoLoginGuard } from './guards/nologin.guard';
 
const AppRoutes: Routes = [
    { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule', canActivate: [NoLoginGuard] },
    { path: '', loadChildren: 'app/home/home.module#HomeModule', canActivate: [NoLoginGuard] },
    //{ path: 'agent', loadChildren: 'app/agent/agent.module#AgentModule', canActivate: [AuthGuard] }
    //{ path: '**', component: PageNotFoundComponent }
];

export const AppRouting = RouterModule.forRoot(AppRoutes);