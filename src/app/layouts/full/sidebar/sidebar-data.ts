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
    iconName: 'rosette',
    route: '/ui-components/badge',
  },
  {
    displayName: 'Ver ventas',
    iconName: 'poker-chip',
    route: '/ui-components/chips',
  },
  {
    displayName: 'Lists',
    iconName: 'list',
    route: '/ui-components/lists',
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
    navCap: 'Compras',
  },
  {
    displayName: 'Registrar compra',
    iconName: 'lock',
    route: '/authentication/login',
  },
  {
    displayName: 'Ver compras',
    iconName: 'user-plus',
    route: '/authentication/register',
  },
  {
    navCap: 'Clientes',
  },
  {
    displayName: 'Registrar cliente',
    iconName: 'mood-smile',
    route: '/extra/icons',
  },
  {
    displayName: 'Ver clientes',
    iconName: 'aperture',
    route: '/extra/sample-page',
  },
  {
    navCap: 'Inventario',
  },
  {
    displayName: 'Ver inventario',
    iconName: 'mood-smile',
    route: '/extra/icons',
  }
];
