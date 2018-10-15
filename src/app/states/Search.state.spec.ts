import { Store, NgxsModule } from '@ngxs/store';
import { TestBed, async } from '@angular/core/testing';
import {
  SearchState,
  AddSearchFilter,
  RemoveSearchFilter,
  RemoveLastSearchFilter,
  ResetSearch,
  SetSearchFilters
} from './Search.state';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('[States] Search - Problem 1', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [RouterTestingModule, NgxsModule.forRoot([SearchState])]
    }).compileComponents();
    store = TestBed.get(Store);
    store.reset({
      searchstate: {
        searchFilters: []
      }
    });
  }));

  it('stub', () => {
    expect(
      SearchState.searchFilters({
        searchFilters: []
      })
    ).toEqual([]);
    expect(
      SearchState.searchFilters({
        searchFilters: [
          { filterColumn: 'city', filterValue: 'testValueCity' },
          { filterColumn: 'mail', filterValue: 'testValueEmail' }
        ]
      })
    ).toEqual([
      { filterColumn: 'city', filterValue: 'testValueCity' },
      { filterColumn: 'mail', filterValue: 'testValueEmail' }
    ]);
  });

  it('it adds Search Filter', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    const filter2 = { filterColumn: 'mail', filterValue: 'testValueEmail' };
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([]);
    store.dispatch(new AddSearchFilter(filter1));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([filter1]);
    store.dispatch(new AddSearchFilter(filter1));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([filter1]);
    store.dispatch(new AddSearchFilter(filter2));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([filter1, filter2]);
  });

  it('it removes Search Filter', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    store.reset({
      searchstate: {
        searchFilters: [filter1]
      }
    });
    store.dispatch(new RemoveSearchFilter(filter1));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([]);
  });

  it('it removes Search Filter - independently', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    const filter2 = { filterColumn: 'mail', filterValue: 'testValueEmail' };
    const filter3 = { filterColumn: 'test3', filterValue: 'testValueTest3' };
    store.reset({
      searchstate: {
        searchFilters: [filter1, filter2, filter3]
      }
    });
    store.dispatch(new RemoveSearchFilter(filter2));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([filter1, filter3]);
  });

  it('it removes Search Filter - no Filter existing', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    store.reset({
      searchstate: {
        searchFilters: []
      }
    });
    store.dispatch(new RemoveSearchFilter(filter1));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([]);
  });

  it('it removes Search Filter - Filter not existing', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    const filter2 = { filterColumn: 'mail', filterValue: 'testValueEmail' };
    const filter3 = { filterColumn: 'test3', filterValue: 'testValueTest3' };
    store.reset({
      searchstate: {
        searchFilters: [filter1, filter3]
      }
    });
    store.dispatch(new RemoveSearchFilter(filter2));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([filter1, filter3]);
  });

  it('it remove last Search Filter', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    const filter2 = { filterColumn: 'mail', filterValue: 'testValueEmail' };
    const filter3 = { filterColumn: 'test3', filterValue: 'testValueTest3' };
    store.reset({
      searchstate: {
        searchFilters: [filter1, filter2, filter3]
      }
    });
    store.dispatch(new RemoveLastSearchFilter());
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate.searchFilters)).toEqual([filter1, filter2]);
  });

  it('it resets Search', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    store.reset({
      searchstate: {
        searchFilters: [filter1]
      }
    });
    store.dispatch(new ResetSearch());
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate)).toEqual({
      searchFilters: []
    });
  });

  it('it sets SearchFilters', () => {
    const filter1 = { filterColumn: 'city', filterValue: 'testValueCity' };
    store.dispatch(new SetSearchFilters([filter1]));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate)).toEqual({
      searchFilters: [filter1]
    });
    store.dispatch(new SetSearchFilters([]));
    expect(store.selectSnapshot(storeSnapshot => storeSnapshot.searchstate)).toEqual({
      searchFilters: []
    });
  });
});
