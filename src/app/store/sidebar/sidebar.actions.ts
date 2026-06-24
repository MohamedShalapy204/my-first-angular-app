import { createAction } from '@ngrx/store';

export const toggleSidebar = createAction('[Sidebar] Toggle');
export const openSidebar = createAction('[Sidebar] Open');
export const closeSidebar = createAction('[Sidebar] Close');
