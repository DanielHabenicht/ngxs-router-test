import { Component, ViewChild, ElementRef } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SearchFilter } from 'src/app/models/SearchFilter';
import { SearchState, ResetSearch, RemoveSearchFilter, AddSearchFilter } from 'src/app/states/Search.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Select(SearchState.searchFilters)
  public searchFilters$: Observable<SearchFilter[]>;
  private containsFilterMarker: RegExp = new RegExp(':');

  @ViewChild('input')
  public input: ElementRef;
  constructor(private store: Store) {}

  public reset(e: Event) {
    this.store.dispatch(new ResetSearch());
  }

  public removeFilter(filter: SearchFilter) {
    this.store.dispatch(new RemoveSearchFilter(filter));
  }

  public checkForNewFilter(event: Event) {
    const filterString = (event.target as HTMLInputElement).value;
    if (this.containsFilterMarker.test(filterString)) {
      event.preventDefault();
      const keyvalue = filterString.split(':');
      this.store.dispatch(new AddSearchFilter({ filterColumn: keyvalue[0], filterValue: keyvalue[1] }));
      (event.target as HTMLInputElement).value = '';
    }
  }
}
