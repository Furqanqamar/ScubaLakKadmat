import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((module) => module.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then((module) => module.AboutComponent)
  },
  {
    path: 'lakshadweep',
    loadComponent: () => import('./pages/lakshadweep/lakshadweep.component').then((module) => module.LakshadweepComponent)
  },
  {
    path: 'kadmat',
    loadComponent: () => import('./pages/kadmat/kadmat.component').then((module) => module.KadmatComponent)
  },
  {
    path: 'experiences',
    loadComponent: () => import('./pages/services/services.component').then((module) => module.ServicesComponent)
  },
  {
    path: 'experiences/:serviceId',
    loadComponent: () => import('./pages/service-detail/service-detail.component').then((module) => module.ServiceDetailComponent)
  },
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/courses.component').then((module) => module.CoursesComponent)
  },
  {
    path: 'courses/:courseId',
    loadComponent: () => import('./pages/course-detail/course-detail.component').then((module) => module.CourseDetailComponent)
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then((module) => module.GalleryComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then((module) => module.ContactComponent)
  },
  { path: '**', redirectTo: '' }
];
