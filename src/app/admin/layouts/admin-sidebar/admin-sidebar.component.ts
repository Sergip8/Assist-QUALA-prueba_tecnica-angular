import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { User } from '../../../models/user.model';

interface MenuItem {
  key: string;
  icon: string;
  title: string;
  route: string;
  children?: MenuItem[];
}


@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent implements OnInit, OnDestroy {
  // Subject para manejar la destrucción y evitar memory leaks
  private destroy$ = new Subject<void>();
  
  isCollapsed = false;
  userInfo: User | null = null;
  selectedMenuKey = '';
  
  @Output() isSicebarCollapsed = new EventEmitter<boolean>();
  
  // Usar readonly para arrays que no cambian
  readonly menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: 'dashboard',
      title: 'Dashboard',
      route: '/admin/dashboard'
    },
    {
      key: 'registros',
      icon: 'bank',
      title: 'Registros',
      route: '/admin/registros',
      children: [
        {
          key: 'sucursales',
          icon: 'unordered-list',
          title: 'Sucursales',
          route: '/admin/registros/sucursales'
        },
 
      ]
    },
    {
      key: 'monedas',
      icon: 'dollar',
      title: 'Monedas',
      route: '/monedas'
    },
    {
      key: 'usuarios',
      icon: 'user',
      title: 'Usuarios',
      route: '/usuarios'
    },
    {
      key: 'configuracion',
      icon: 'setting',
      title: 'Configuración',
      route: '/configuracion'
    }
  ];

  constructor(
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.setActiveMenu();
    this.setupRouteSubscription();
  }

  ngOnDestroy(): void {
    // Completar el Subject para cancelar todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRouteSubscription(): void {
    // Suscribirse a cambios de ruta para actualizar el menú activo automáticamente
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$) // Cancelar suscripción cuando se destruya el componente
      )
      .subscribe((event: NavigationEnd) => {
        this.selectedMenuKey = this.findActiveMenuKey(event.url);
      });
  }

  private loadUserInfo(): void {
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        this.userInfo = JSON.parse(userString) as User;
      }
    } catch (error) {
      console.error('Error parsing user info from localStorage:', error);
      // Limpiar localStorage si hay datos corruptos
      localStorage.removeItem('user');
    }
  }

  private setActiveMenu(): void {
    const currentRoute = this.router.url;
    this.selectedMenuKey = this.findActiveMenuKey(currentRoute);
  }

  private findActiveMenuKey(route: string): string {
    // Optimizar la búsqueda usando find en lugar de loops anidados
    for (const item of this.menuItems) {
      if (route.includes(item.route)) {
        if (item.children) {
          const activeChild = item.children.find(child => route === child.route);
          if (activeChild) {
            return activeChild.key;
          }
        }
        return item.key;
      }
    }
    return '';
  }

  navigateTo(route: string): void {
    // Verificar que la ruta sea válida antes de navegar
    if (route && route.trim()) {
      this.router.navigate([route]);
    }
  }

  logout(): void {
    try {
      // Limpiar todos los datos del localStorage relacionados con la sesión
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken'); // Si usas refresh tokens
      
      this.message.success('Sesión cerrada exitosamente');
      
      // Navegar al login y reemplazar la historia para prevenir volver atrás
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error during logout:', error);
      this.message.error('Error al cerrar sesión');
    }
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.isSicebarCollapsed.emit(this.isCollapsed);
  }
}