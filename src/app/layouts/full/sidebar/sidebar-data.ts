import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Inicio',
  },
  {
    displayName: 'Panel de información',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    navCap: 'Ventas',
  },
  {
    displayName: 'Registrar venta',
    iconName: 'credit-card',
    route: '/ventas/agregar-venta',
  },
  {
    displayName: 'Ver ventas',
    iconName: 'notes',
    route: '/ventas/ver-ventas', ///****** */
  },
  {
    navCap: 'Compras',
  },
  {
    displayName: 'Registrar compra',
    iconName: 'shopping-cart',
    route: '/compras/agregar-compra',
  }, 
  {
    displayName: 'Editar compra',
    iconName: 'shopping-cart-cog',
    route: '/compras/editar-compra',
  },
  {
    displayName: 'Ver compras',
    iconName: 'list',
    route: '/compras/ver-compra',
  },
  {
    navCap: 'Inventario',
  },
  {
    displayName: 'Ver inventario',
    iconName: 'building-warehouse',
    route: '/inventario/ver-inventario',
  },
  {
    navCap: 'Clientes',
  },
  {
    displayName: 'Registrar cliente',
    iconName: 'user-plus',
    route: '/clientes/agregar-cliente',
  },
  {
    displayName: 'Editar cliente',
    iconName: 'edit',
    route: '/clientes/editar-cliente',
  },
  {
    displayName: 'Ver clientes',
    iconName: 'users',
    route: '/clientes/ver-clientes', 
  },
  {
    navCap: 'Perfiles',
  },

  {
    displayName: 'calculo de costo',
    iconName: 'list',
    route: '/ui-components/lists',
  },

  {
    displayName: 'Chips',
    iconName: 'poker-chip',
    route: '/ui-components/chips',
  },
  
  {
    displayName: 'Menu',
    iconName: 'layout-navbar-expand',
    route: '/ui-components/menu',
  },
  {
    displayName: 'Tooltips',
    iconName: 'tooltip',
    route: '/ui-components/tooltips',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    route: '/authentication/login',
  },
  {
    displayName: 'Registro',
    iconName: 'user-plus',
    route: '/authentication/register',
  },
  {
    displayName: 'Icons',
    iconName: 'mood-smile',
    route: '/extra/icons',
  },
  {
    displayName: 'Sample Page',
    iconName: 'aperture',
    route: '/extra/sample-page',
  },
];
