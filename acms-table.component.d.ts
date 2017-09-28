import { OnInit, OnChanges, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
export declare class AcmsTableComponent implements OnInit, OnChanges {
    private _ref;
    private _sanitizer;
    constructor(_ref: ChangeDetectorRef, _sanitizer: DomSanitizer);
    config: any;
    collection: any[];
    rowSelected: EventEmitter<any>;
    emptyTableEvt: EventEmitter<boolean>;
    headers: any[];
    configRow: any[];
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
    reinit(): void;
    /**
     * Find the value of an element with is target (ex: object.property1...)
     * It find through the element sent
     * Returns false if there is no match
     * @param target
     * @param el
     * @returns {null}
     */
    findTargetThroughObject(target: any, el: any): any;
    /**
     * Find the value for prepare one cell
     */
    prepareOneCell(cell: any, el: any): {
        'translatable': any;
        'objectFound': any;
    };
    /**
     * Prepare the header and the config for each column
     * and populate the cell (td)
     */
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
    sendEvent(evt: any, type: any, rowId: any): void;
    updateSelectedRowsList(evt: any): void;
    resetMainSwitch(): void;
    deselectAll(): void;
    selectDeselectAll(evt: any): void;
    /**
     * Stop the propagation of event
     * @param evt
     */
    stopPropagation(evt: any): void;
}
