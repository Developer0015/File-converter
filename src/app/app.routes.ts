import { Routes } from '@angular/router';

// Clean file paths and clean class names
import { Home } from './home/home'; 
import { History } from './history/history';
import { Images } from './images/images';
import { About } from './about/about';

export const routes: Routes = [
  { path: '', component: Home }, 
  { path: 'home', component: Home },
  { path: 'history', component: History },
  { path: 'images', component: Images },
  { path: 'about', component: About },
  { path: '**', redirectTo: '' }
];