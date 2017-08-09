import { OnInit, OnChanges, ChangeDetectorRef, EventEmitter } from '@angular/core';
export declare class Item {
    data: string;
    isResponsive: boolean;
    isTranslatable: boolean;
    actions: any[];
    constructor(data: any);
}
export declare class AcmsTableComponent implements OnInit, OnChanges {
    private _ref;
    constructor(_ref: ChangeDetectorRef);
    config: any;
    collection: any[];
    rowSelected: EventEmitter<any>;
    emptyTableEvt: EventEmitter<boolean>;
    headers: any[];
    targets: any[];
    results: any[];
    filteredResults: any[];
    displayedResults: any[];
    colsSearchable: number[];
    pageCurrent: number;
    nbResultsByPage: number;
    pageTotal: number;
    collectionPage: any[];
    nbPageBeforeAfter: number;
    eventResize: any;
    breakPoint: number;
    selectedRowsList: string[];
    viewportWidth: number;
    isEmptyTable: boolean;
    ngOnInit(): void;
    ngOnChanges(): void;
    prepareTable(): void;
    applyFilter(): void;
    isEmpty(): void;
    applyPagination(): void;
    changePage(page: any): void;
    isNumeric(val: any): boolean;
    sort(columnIndex: any, type: any): void;
    searchWithTerms(event: any, el: any): void;
    addResizeEvent(): {
        'killMe': () => void;
    };
    showColumn(isResponsive: any): boolean;
    selectGlobalAction(evt: any): void;
    sendEvent(type: any, rowId: any): void;
    updateSelectedRowsList(evt: any): void;
    resetMainSwitch(): void;
    deselectAll(): void;
    selectDeselectAll(evt: any): void;
}
