# QualaSucursalesAng

**QualaSucursalesAng** es una aplicación web desarrollada en Angular para la gestión y visualización de sucursales, y estadísticas administrativas. Incluye autenticación de usuarios, panel administrativo, manejo de roles y visualización de datos mediante gráficos.

## Tecnologías principales
- **Angular** 19+
- **ng-zorro-antd** (componentes UI)
- **ng2-charts** (gráficas)
- **RxJS**

## Estructura general del proyecto
- `src/app/public`: Módulo público, incluye páginas de login y registro.
- `src/app/admin`: Panel administrativo, dashboard y gestión de sucursales.
- `src/app/_core`: Servicios, guardias, interceptores y lógica central.
- `src/app/models`: Modelos de datos y esquemas de tablas/formularios.
- `src/app/shared`: Componentes y módulos reutilizables.

## Funcionalidades principales

### 1. Autenticación de usuarios
- **Login**: Permite a los usuarios autenticarse con email y contraseña.
- **Registro**: Permite crear una nueva cuenta de usuario.
- Redirección según rol (admin o usuario público).

### 2. Panel administrativo
- **Dashboard**: Visualización de estadísticas con gráficos (distribución de monedas, roles, salud del sistema, etc.).
- **Gestión de sucursales**: Listado, búsqueda, paginación, creación, edición y eliminación de sucursales.
- **Acciones rápidas**: Exportar datos, agregar usuarios, editar/eliminar sucursales.

### 3. Seguridad y roles
- Acceso al panel admin protegido por guardias de rol.
- Navegación diferenciada para usuarios autenticados y no autenticados.

## Instalación y ejecución

1. Instala las dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo:

```bash
ng serve
```

3. Accede a la aplicación en [http://localhost:4200](http://localhost:4200)

## Scripts útiles
- `npm start`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm test`: Ejecuta los tests unitarios.

## Recursos adicionales
- [Documentación Angular CLI](https://angular.dev/tools/cli)
- [ng-zorro-antd](https://ng.ant.design/docs/introduce/es)
- [ng2-charts](https://valor-software.com/ng2-charts/)

---

Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli).
