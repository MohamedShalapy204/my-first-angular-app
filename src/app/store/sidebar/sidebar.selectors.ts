import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { SidebarState } from './sidebar.reducer';

export const selectSidebarState = createFeatureSelector<SidebarState>('sidebar');
export const selectSidebarIsOpen = createSelector(selectSidebarState, (state) => state.isOpen);
