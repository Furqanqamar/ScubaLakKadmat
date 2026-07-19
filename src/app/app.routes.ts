import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Scuba Lak, Kadmat Lakshadweep | Dive into the untouched',
    loadComponent: () => import('./pages/home/home.component').then((module) => module.HomeComponent)
  },
  {
    path: 'about',
    title: 'About Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/about/about.component').then((module) => module.AboutComponent)
  },
  {
    path: 'lakshadweep',
    title: 'Lakshadweep | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/lakshadweep/lakshadweep.component').then((module) => module.LakshadweepComponent)
  },
  {
    path: 'kadmat',
    title: 'Kadmat Island | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/kadmat/kadmat.component').then((module) => module.KadmatComponent)
  },
  {
    path: 'experiences',
    title: 'Diving & Water Sports | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/services/services.component').then((module) => module.ServicesComponent)
  },
  {
    path: 'experiences/:serviceId',
    title: 'Experience details | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/service-detail/service-detail.component').then((module) => module.ServiceDetailComponent)
  },
  {
    path: 'courses',
    title: 'PADI Courses | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/courses/courses.component').then((module) => module.CoursesComponent)
  },
  {
    path: 'courses/:courseId',
    title: 'PADI course details | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/course-detail/course-detail.component').then((module) => module.CourseDetailComponent)
  },
  {
    path: 'gallery',
    title: 'Kadmat gallery | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/gallery/gallery.component').then((module) => module.GalleryComponent)
  },
  {
    path: 'contact',
    title: 'Contact the dive desk | Scuba Lak, Kadmat Lakshadweep',
    loadComponent: () => import('./pages/contact/contact.component').then((module) => module.ContactComponent)
  },
  { path: '**', redirectTo: '' }
];
