import { State, Action, StateContext, Selector, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { Navigate, RouterNavigation, RouterState } from '@ngxs/router-plugin';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { SearchFilter } from 'src/app/models/SearchFilter';

export class AddSearchFilter {
  public static readonly type: string = '[Search State] Add Filter';
  constructor(public searchFilter: SearchFilter) {}
}
export class RemoveSearchFilter {
  public static readonly type: string = '[Search State] Remove Filter';
  constructor(public searchFilter: SearchFilter) {}
}
export class RemoveLastSearchFilter {
  public static readonly type: string = '[Search State] Remove Last Filter';
}
export class UpdateUrl {
  public static readonly type: string = '[Search State] Update Url';
  constructor(public update: { searchFilter?: SearchFilter[] }) {}
}
export class SetSearchFilters {
  public static readonly type: string = '[Search State] Set SearchFilters';
  constructor(public searchFilters: SearchFilter[], public updateUrl: boolean = true) {}
}
export class ResetSearch {
  public static readonly type: string = '[Search State] Reset';
  constructor(public shouldNavigate: boolean = true) {}
}

export interface SearchStateModel {
  searchFilters: SearchFilter[];
}

@State<SearchStateModel>({
  name: 'searchstate',
  defaults: {
    searchFilters: []
  }
})
export class SearchState {
  constructor(private store: Store, private actions$: Actions, private route: ActivatedRoute) {
    this.actions$.pipe(ofActionSuccessful(RouterNavigation)).subscribe(routeInfo => {
      const routeSnapshot: ActivatedRouteSnapshot = routeInfo.routerState.root;
      const pathSegment = routeSnapshot.firstChild;
      if (
        routeSnapshot.firstChild == null ||
        routeSnapshot.firstChild.url.length === 0 ||
        routeSnapshot.firstChild.url[0].path !== 'search'
      ) {
        return;
      }
      if (pathSegment != null) {
        // Get SearchFilters
        let searchFilter: SearchFilter[] = [];
        Object.keys(pathSegment.queryParams).forEach(key => {
          searchFilter.push({
            filterColumn: key,
            filterValue: pathSegment.queryParamMap.get(key) || ''
          });
          // Retrieve Search Filter if none are set in the URL
          if (searchFilter.length === 0) {
            searchFilter = this.store.selectSnapshot(SearchState.searchFilters);
          }
          this.store.dispatch(new SetSearchFilters(searchFilter, false));
        });
      }
    });
  }

  @Selector()
  public static searchFilters(state: SearchStateModel): SearchFilter[] {
    return state.searchFilters;
  }

  @Action(AddSearchFilter)
  public addSearchFilter(ctx: StateContext<SearchStateModel>, action: AddSearchFilter) {
    const state = ctx.getState();
    if (state.searchFilters.findIndex(filter => filter.filterColumn === action.searchFilter.filterColumn) >= 0) {
      return;
    }
    state.searchFilters.push(action.searchFilter);
    ctx.setState({ ...state });
    return ctx.dispatch(new UpdateUrl({ searchFilter: state.searchFilters }));
  }

  @Action(RemoveSearchFilter)
  public removeSearchFilter(ctx: StateContext<SearchStateModel>, action: RemoveSearchFilter) {
    const state = ctx.getState();
    const index = state.searchFilters.indexOf(action.searchFilter);
    if (index === -1) {
      return;
    }
    state.searchFilters.splice(index, 1);
    ctx.setState({ ...state });
    return ctx.dispatch(new UpdateUrl({ searchFilter: state.searchFilters }));
  }

  @Action(RemoveLastSearchFilter)
  public removeLastSearchFilter(ctx: StateContext<SearchStateModel>) {
    const state = ctx.getState();
    state.searchFilters.pop();
    ctx.setState({ ...state });
    return ctx.dispatch(new UpdateUrl({ searchFilter: state.searchFilters }));
  }

  @Action(ResetSearch)
  public resetSearch(ctx: StateContext<SearchStateModel>, action: ResetSearch) {
    ctx.patchState({
      searchFilters: []
    });
    if (action.shouldNavigate) {
      return ctx.dispatch(new UpdateUrl({ searchFilter: [] }));
    }
  }
  @Action(SetSearchFilters)
  public setSearchFilterAndSearchTerm(ctx: StateContext<SearchStateModel>, action: SetSearchFilters) {
    const state = ctx.getState();
    state.searchFilters = action.searchFilters;
    ctx.setState({ ...state });
    if (action.updateUrl) {
      return ctx.dispatch(new UpdateUrl({ searchFilter: state.searchFilters }));
    }
  }

  @Action(UpdateUrl)
  private updateURL(ctx: StateContext<SearchStateModel>, action: UpdateUrl) {
    const update = action.update;
    const params: { [key: string]: string | null } = {};
    const routeSnapshot: ActivatedRouteSnapshot = this.route.snapshot;
    if (update.searchFilter != null) {
      update.searchFilter.forEach(filter => {
        params[filter.filterColumn] = filter.filterValue;
      });
      // Remove Query Params that are not used anymore by setting them 'null' explicitly
      if (routeSnapshot.firstChild != null) {
        const queryParams = routeSnapshot.firstChild.queryParams;
        Object.keys(queryParams).forEach(queryParamKey => {
          if (params[queryParamKey] == null) {
            params[queryParamKey] = null;
          }
        });
      }
    }
    return this.store.dispatch(
      new Navigate([''], params, {
        queryParamsHandling: 'merge'
      })
    );
  }
}
