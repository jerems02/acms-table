(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/platform-browser'), require('ng2-translate/index'), require('acms-switch')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/platform-browser', 'ng2-translate/index', 'acms-switch'], factory) :
	(factory((global['acms-table'] = {}),global._angular_core,global._angular_common,global._angular_platformBrowser,global.ng2Translate_index,global.acmsSwitch));
}(this, (function (exports,_angular_core,_angular_common,_angular_platformBrowser,ng2Translate_index,acmsSwitch) { 'use strict';

var Item = (function () {
    /**
     * @param {?} data
     */
    function Item(data) {
        this.isResponsive = false;
        this.isTranslatable = false;
        this.actions = [];
        this.type = 'text'; // svg, img, url, html, function or text
        this.config = null;
        this.classRow = null;
        this.translatableRow = false;
        this.multirows = [];
        this.data = data;
    }
    return Item;
}());

var AcmsTableComponent = (function () {
    /**
     * @param {?} _ref
     * @param {?} _sanitizer
     */
    function AcmsTableComponent(_ref, _sanitizer) {
        this._ref = _ref;
        this._sanitizer = _sanitizer;
        this.rowSelected = new _angular_core.EventEmitter();
        this.emptyTableEvt = new _angular_core.EventEmitter();
        this.configRow = [];
        this.results = [];
        this.filteredResults = [];
        this.displayedResults = [];
        this.colsSearchable = [];
        this.pageCurrent = 1;
        this.selectedRowsList = [];
        this.viewportWidth = 0;
        this.isEmptyTable = true;
    }
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.ngOnInit = function () {
        this.eventResize = this.addResizeEvent();
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.ngOnChanges = function () {
        this.breakPoint = (this.config.global.responsiveViewBreakPoint) ? this.config.global.responsiveViewBreakPoint : 800;
        this.nbResultsByPage = (this.config.global.pagination && this.config.global.pagination.nbResultsByPage) ? this.config.global.pagination.nbResultsByPage : 10;
        this.nbPageBeforeAfter = (this.config.global.pagination && this.config.global.pagination.nbPageBeforeAfter) ? this.config.global.pagination.nbPageBeforeAfter : 3;
        this.prepareTable();
        this.applyFilter();
        this.applyPagination();
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.reinit = function () {
        this.headers = [];
        this.configRow = [];
        this.results = [];
        this.filteredResults = [];
        this.displayedResults = [];
    };
    /**
     * Find the value of an element with is target (ex: object.property1...)
     * It find through the element sent
     * Returns false if there is no match
     * @param {?} target
     * @param {?} el
     * @return {?}
     */
    AcmsTableComponent.prototype.findTargetThroughObject = function (target, el) {
        var /** @type {?} */ test = target.split('.').reduce(function (object, property) {
            if (object[property]) {
                return object[property];
            }
            else {
                return false;
            }
        }, el);
        return test;
    };
    /**
     * Find the value for prepare one cell
     * @param {?} cell
     * @param {?} el
     * @return {?}
     */
    AcmsTableComponent.prototype.prepareOneCell = function (cell, el) {
        var _this = this;
        var /** @type {?} */ translatable = cell.translatableRow;
        var /** @type {?} */ objectFound;
        //find object
        if (cell.target !== null && !cell.concat) {
            objectFound = this.findTargetThroughObject(cell.target, el);
            if (!objectFound) {
                objectFound = cell.messageIfEmpty;
                if (cell.isMessageIfEmptyTranslatable)
                    translatable = true;
                if (cell.type === 'html')
                    objectFound = this._sanitizer.sanitize(_angular_core.SecurityContext.HTML, objectFound);
                if (cell.type === 'img')
                    objectFound = this._sanitizer.sanitize(_angular_core.SecurityContext.URL, objectFound);
                if (cell.type === 'url')
                    objectFound = this._sanitizer.sanitize(_angular_core.SecurityContext.URL, objectFound);
                if (cell.type === 'svg')
                    objectFound = this._sanitizer.bypassSecurityTrustHtml(objectFound);
            }
        }
        
        if (!cell.target && cell.concat) {
            var /** @type {?} */ tempValues_1 = [];
            cell.concat.forEach(function (concatItem) {
                var /** @type {?} */ temp = _this.findTargetThroughObject(concatItem, el);
                if (temp)
                    tempValues_1.push(temp);
            });
            objectFound = tempValues_1.join(cell.concatSeparator);
        }
        return {
            'translatable': translatable,
            'objectFound': objectFound
        };
    };
    /**
     * Prepare the header and the config for each column
     * and populate the cell (td)
     * @return {?}
     */
    AcmsTableComponent.prototype.prepareTable = function () {
        var _this = this;
        this.reinit();
        /**
         * We map on the headers to get the target of each cols in the json conf
         * and we obtain if this col is responsive
         */
        this.headers = this.config.columns.map(function (el, index) {
            var /** @type {?} */ target = {
                target: el.target,
                concat: el.concat,
                concatSeparator: ((el.concatSeparator) ? el.concatSeparator : ' '),
                actions: el.actions,
                isResponsive: el.hideWithResponsiveView,
                type: el.type,
                config: el.config,
                key: (el.key) ? el.key : index,
                classRow: el.classRow,
                translatableRow: el.translatableRow,
                row: el.row,
                messageIfEmpty: el.messageIfEmpty,
                isMessageIfEmptyTranslatable: el.isMessageIfEmptyTranslatable,
                is_sortable: el.is_sortable,
                is_sortable_by: el.is_sortable_by
            };
            _this.configRow.push(target);
            //which column is searchable
            if (el.is_searchable) {
                _this.colsSearchable.push(index);
            }
            return el;
        });
        /**
         * we loop on collection to extract data on json, we use the configRow array installed before
         * to know for each item the target and if the element is responsive
         */
        this.collection.forEach(function (row, index) {
            var /** @type {?} */ tempRow = {}; // row formatted will be injected in results
            var /** @type {?} */ contextRow = row;
            var /** @type {?} */ dataSort; // property used to the sort the column of the table
            tempRow.items = [];
            // get the id for row
            tempRow.id = _this.findTargetThroughObject((_this.config.global.target_id) ? _this.config.global.target_id : '', row);
            if (!tempRow.id)
                tempRow.id = index;
            //get the class for the row (line)
            tempRow.classLine = _this.findTargetThroughObject((_this.config.global.target_classLine) ? _this.config.global.target_classLine : '', row);
            /**
             * we loop on the config of Row for each cell for the future td
             *
             */
            _this.configRow.forEach(function (cell) {
                var /** @type {?} */ cellData = _this.prepareOneCell(cell, contextRow);
                if (cell.is_sortable)
                    dataSort = cellData.objectFound;
                // multirows
                var /** @type {?} */ multirows = [];
                var /** @type {?} */ that = _this;
                var /** @type {?} */ recursiveRows = function (embeddedCell) {
                    var /** @type {?} */ tempCellData = that.prepareOneCell(embeddedCell, contextRow);
                    if (!tempCellData)
                        return;
                    var /** @type {?} */ row = {};
                    row.data = tempCellData.objectFound;
                    // we check if a sub row is the target for the sort column
                    if (cell.is_sortable_by && embeddedCell.target === cell.is_sortable_by)
                        dataSort = tempCellData.objectFound;
                    row.isTranslatable = tempCellData.translatable;
                    row.type = embeddedCell.type;
                    row.config = embeddedCell.config;
                    row.contextRow = contextRow;
                    multirows.push(row);
                    // recursive
                    if (embeddedCell.row)
                        recursiveRows(embeddedCell.row);
                };
                if (cell.row) {
                    recursiveRows(cell.row);
                }
                var /** @type {?} */ item = new Item((cellData.objectFound) ? cellData.objectFound : null);
                item.dataSort = dataSort;
                item.actions = cell.actions;
                item.isResponsive = cell.isResponsive;
                item.type = cell.type;
                item.config = cell.config;
                item.classRow = cell.classRow;
                item.isTranslatable = cellData.translatable;
                item.multirows = multirows;
                item.contextRow = contextRow;
                item.styleCell = contextRow.styleCell || null;
                item.target = cell.target;
                item.key = cell.key;
                tempRow.items.push(item);
            });
            _this.results.push(tempRow);
        });
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.applyFilter = function () {
        this.filteredResults = this.results;
        this.isEmpty();
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.isEmpty = function () {
        var /** @type {?} */ oldState = this.isEmptyTable;
        this.isEmptyTable = (this.filteredResults.length === 0);
        // only if there is a change we sent an event
        if (oldState !== this.isEmptyTable)
            this.emptyTableEvt.emit(this.isEmptyTable);
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.applyPagination = function () {
        if (!this.config.global.pagination) {
            this.displayedResults = this.filteredResults;
            return;
        }
        this.pageTotal = Math.ceil(this.filteredResults.length / this.nbResultsByPage);
        // check if we are in a page without result
        if (this.pageCurrent > this.pageTotal) {
            this.pageCurrent = 1;
        }
        var /** @type {?} */ start = Math.ceil((this.pageCurrent - 1) * this.nbResultsByPage);
        var /** @type {?} */ end = start + this.nbResultsByPage;
        this.displayedResults = this.filteredResults.slice(start, end);
        // page collection
        this.collectionPage = [];
        if (this.pageCurrent > 1) {
            this.collectionPage.push({
                'name': '<<',
                'number': 1
            });
        }
        if ((this.pageCurrent - 1) > 0) {
            this.collectionPage.push({
                'name': '<',
                'number': this.pageCurrent - 1
            });
        }
        start = (this.pageCurrent - this.nbPageBeforeAfter > 0) ? (this.pageCurrent - this.nbPageBeforeAfter) : 1;
        for (var /** @type {?} */ i = start; i < this.pageCurrent; i++) {
            this.collectionPage.push({
                'name': i,
                'number': i
            });
        }
        this.collectionPage.push({
            'name': this.pageCurrent,
            'number': this.pageCurrent,
            'current': true
        });
        end = (this.pageCurrent + this.nbPageBeforeAfter < this.pageTotal) ? (this.pageCurrent + this.nbPageBeforeAfter) : this.pageTotal;
        for (var /** @type {?} */ i = this.pageCurrent + 1; i <= end; i++) {
            this.collectionPage.push({
                'name': i,
                'number': i
            });
        }
        if ((this.pageCurrent) < this.pageTotal) {
            this.collectionPage.push({
                'name': '>',
                'number': this.pageCurrent + 1
            });
            this.collectionPage.push({
                'name': '>>',
                'number': this.pageTotal
            });
        }
    };
    /**
     * @param {?} page
     * @return {?}
     */
    AcmsTableComponent.prototype.changePage = function (page) {
        this.deselectAll();
        this.pageCurrent = page;
        this.applyPagination();
    };
    /**
     * @param {?} val
     * @return {?}
     */
    AcmsTableComponent.prototype.isNumeric = function (val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    };
    /**
     * @param {?} columnIndex
     * @param {?} type
     * @return {?}
     */
    AcmsTableComponent.prototype.sort = function (columnIndex, type) {
        var /** @type {?} */ that = this;
        var /** @type {?} */ compare = function (a, b) {
            a = a.items[columnIndex].dataSort;
            b = b.items[columnIndex].dataSort;
            if (!that.isNumeric(a)) {
                a.toLowerCase();
            }
            if (!that.isNumeric(b)) {
                b.toLowerCase();
            }
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        };
        this.filteredResults.sort(compare);
        if (type === 'ASC')
            this.filteredResults.reverse();
        this.applyPagination();
    };
    /**
     * @param {?} event
     * @param {?} el
     * @return {?}
     */
    AcmsTableComponent.prototype.searchWithTerms = function (event, el) {
        var _this = this;
        var /** @type {?} */ keyCode = event.keyCode;
        var /** @type {?} */ searchTerm = el.value;
        var /** @type {?} */ temp = [];
        this.results.forEach(function (el) {
            var /** @type {?} */ alreadyInList = false;
            el.items.forEach(function (item, index) {
                if (alreadyInList) {
                    return;
                }
                if (_this.colsSearchable.indexOf(index) > -1) {
                    var /** @type {?} */ data = item.data;
                    var /** @type {?} */ valueTemp = (!_this.isNumeric(data)) ? data.toLowerCase() : data;
                    valueTemp += '';
                    if (valueTemp.indexOf(searchTerm.toLowerCase()) > -1) {
                        alreadyInList = true;
                        temp.push(el);
                    }
                }
            });
        });
        this.filteredResults = temp;
        this.isEmpty();
        this.applyPagination();
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.addResizeEvent = function () {
        var /** @type {?} */ that = this;
        var /** @type {?} */ toDo = function (event) {
            that.viewportWidth = window.innerWidth;
        };
        window.addEventListener('resize', toDo, false);
        /**
         * @return {?}
         */
        function _killMe() {
            document.removeEventListener('resize', toDo, false);
        }
        return {
            'killMe': _killMe
        };
    };
    /**
     * @param {?} isResponsive
     * @return {?}
     */
    AcmsTableComponent.prototype.showColumn = function (isResponsive) {
        if (isResponsive && window.innerWidth < this.breakPoint) {
            return false;
        }
        return true;
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    AcmsTableComponent.prototype.selectGlobalAction = function (evt) {
        var /** @type {?} */ type = evt.target.value;
        this.sendEvent(evt, type + 'All', this.selectedRowsList);
        // reset select option
        var /** @type {?} */ copy = this.config.global.group_actions;
        this.config.global.group_actions = null;
        this._ref.detectChanges();
        this.config.global.group_actions = copy;
        this._ref.detectChanges();
    };
    /**
     * @param {?} evt
     * @param {?} type
     * @param {?} rowId
     * @return {?}
     */
    AcmsTableComponent.prototype.sendEvent = function (evt, type, rowId) {
        evt.stopPropagation();
        this.rowSelected.emit({ type: type, id: rowId });
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    AcmsTableComponent.prototype.updateSelectedRowsList = function (evt) {
        if (this.config.global.group_actions)
            this.resetMainSwitch();
        var /** @type {?} */ idRow = evt.id;
        var /** @type {?} */ state = evt.state;
        var /** @type {?} */ pos = this.selectedRowsList.indexOf(idRow);
        if (pos > -1 && !state) {
            this.selectedRowsList.splice(pos, 1);
        }
        else if (state) {
            this.selectedRowsList.push(idRow);
        }
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.resetMainSwitch = function () {
        document.getElementById('main-switch').querySelector('input').checked = false;
    };
    /**
     * @return {?}
     */
    AcmsTableComponent.prototype.deselectAll = function () {
        this.resetMainSwitch();
        this.selectDeselectAll({ state: false });
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    AcmsTableComponent.prototype.selectDeselectAll = function (evt) {
        var /** @type {?} */ state = evt.state;
        var /** @type {?} */ all = document.querySelectorAll('.item-switch');
        this.selectedRowsList = [];
        if (state) {
            this.selectedRowsList = this.displayedResults.map(function (el) {
                return el.id;
            });
        }
        [].forEach.call(all, function (el) {
            el.querySelector('input').checked = state;
        });
    };
    /**
     * Stop the propagation of event
     * @param {?} evt
     * @return {?}
     */
    AcmsTableComponent.prototype.stopPropagation = function (evt) {
        evt.stopPropagation();
    };
    return AcmsTableComponent;
}());
AcmsTableComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'acms-table',
                template: "<div *ngIf=\"config.global.search\"  class=\"tableSearchBox\" (keyup)=\"searchWithTerms($event, searchBox)\" > <span>{{ (config.global.isSearchLabelTranslatable) ? (config.global.searchLabel | translate) : (config.global.searchLabel) }}</span> <input type=\"text\" #searchBox placeholder=\"{{ (config.global.isPlaceHolderSearchTranslatable) ? (config.global.placeHolderSearch  | translate) : (config.global.placeHolderSearch) }}\" /> </div> <div *ngIf=\"config.global.group_actions && config.global.group_actions.length > 0\" class=\"tableGroupActions\"> <acms-switch [id]=\"main\" (switchEvent)=\"selectDeselectAll($event)\" id=\"main-switch\"></acms-switch> <select (change)=\"selectGlobalAction($event)\"> <option disabled select>Group Action</option> <option *ngFor=\"let action of config.global.group_actions\">{{ action }}</option> </select> </div> <table *ngIf=\"!isEmptyTable\"> <thead *ngIf=\"config.global.showHeaders\"> <tr> <ng-template ngFor let-header [ngForOf]=\"headers\" let-i=\"index\"> <th *ngIf=\"showColumn(header.hideWithResponsiveView)\"> {{ (header.is_translatable) ? (header.title  | translate) : (header.title) }} <span class=\"sortArrow\" *ngIf=\"header.is_sortable\"> <span class=\"sortArrowUp\" (click)=\"sort(i, 'ASC')\"> &#x25B2; </span> <span class=\"sortArrowDown\" (click)=\"sort(i, 'DESC')\"> &#x25BC; </span> </span> </th> </ng-template> </thead> <tbody> <tr *ngFor=\"let result of displayedResults\" (click)=\"(config.global.isEventOnRow) ? sendEvent($event,'onRow', result.id) : ''\" [ngClass]=\"result.classLine\"> <ng-template ngFor let-item [ngForOf]=\"result.items\"> <td *ngIf=\"item.actions && item.actions.length > 0\"> <ng-template ngFor let-action [ngForOf]=\"item.actions\"> <span *ngIf=\"action === 'select'\" class=\"actions action-select\"><span> <acms-switch [id]=\"result.id\" (switchEvent)=\"updateSelectedRowsList($event)\" class=\"item-switch\" (click)=\"stopPropagation($event)\"></acms-switch> </span></span> <span *ngIf=\"action === 'update'\" class=\"actions action-update\" (click)=\"sendEvent($event, 'update', result.id)\"><span>UPDATE</span></span> <span *ngIf=\"action === 'delete'\" class=\"actions action-delete\" (click)=\"sendEvent($event, 'delete', result.id)\"><span>DELETE</span></span> </ng-template> </td> <td *ngIf=\"!item.actions && showColumn(item.isResponsive)\" [ngClass]=\"(item.styleCell && item.styleCell[item.key] && item.styleCell[item.key].isApplied)?(item.styleCell[item.key].className):item.classRow\"> <acms-data [cell]=\"item\"></acms-data> <ng-template ngFor let-subrow [ngForOf]=\"item.multirows\"> <acms-data [cell]=\"subrow\"></acms-data> </ng-template> </td> </ng-template> </tr> </tbody> <caption *ngIf=\"config.global.legend\"> {{ (config.global.isLegendTranslatable) ? (config.global.legend | translate) : (config.global.legend) }} </caption> </table> <div class=\"tablePagination\" *ngIf=\"config.global.pagination && !isEmptyTable\"> <span *ngFor=\"let page of collectionPage\" [ngClass]=\"(page.current)?'currentLinkPagination':''\"> <a href=\"#\" (click)=\"changePage(page.number)\">{{ page.name }}</a> </span> </div> <div id=\"acms-table-empty-message\" *ngIf=\"isEmptyTable\"> <div>{{ (config.global.isMessageIfEmptyTableTranslatable) ? (config.global.messageIfEmptyTable | translate) : (config.global.messageIfEmptyTable) }}</div> </div> ",
                styles: [".currentLinkPagination a { font-weight: bold; } .actions { position: relative; top: -2px; } .action-update, .action-delete { display: inline-block; min-width: 16px ; height: 15px; margin-left: 10px; cursor: pointer; } /* .action-update span, .action-delete span { display: none; } .action-update:before { font-family: 'FontAwesome'; left: 0px; position: absolute; top: 2px; content: '\f040'; } .action-delete:before { font-family: 'FontAwesome'; left:0px; position: absolute; top: 2px; content: '\f1f8'; }*/ .multi-rows { display: flex; flex-direction: column; } acms-switch { position: relative; top: 4px; } "],
            },] },
];
/**
 * @nocollapse
 */
AcmsTableComponent.ctorParameters = function () { return [
    { type: _angular_core.ChangeDetectorRef, },
    { type: _angular_platformBrowser.DomSanitizer, },
]; };
AcmsTableComponent.propDecorators = {
    'config': [{ type: _angular_core.Input },],
    'collection': [{ type: _angular_core.Input },],
    'rowSelected': [{ type: _angular_core.Output },],
    'emptyTableEvt': [{ type: _angular_core.Output },],
};

var DataComponent = (function () {
    function DataComponent() {
    }
    /**
     * @return {?}
     */
    DataComponent.prototype.ngOnInit = function () {
    };
    /**
     * @return {?}
     */
    DataComponent.prototype.ngOnChanges = function () {
    };
    /**
     * Stop the propagation of event
    \@param evt
     * @param {?} evt
     * @return {?}
     */
    DataComponent.prototype.stopPropagation = function (evt) {
        evt.stopPropagation();
    };
    /**
     * Method called on svg/img by click event
    \@param evt
    \@param method
    \@param params
     * @param {?} evt
     * @param {?} method
     * @param {?} params
     * @param {?} context
     * @param {?} contextRow
     * @return {?}
     */
    DataComponent.prototype.genericClickMethod = function (evt, method, params, context, contextRow) {
        this.stopPropagation(evt);
        if (!params) {
            params = [];
        }
        var /** @type {?} */ newParams = params.slice();
        newParams.push(evt);
        newParams.push(contextRow);
        if (context) {
            method.call(context, newParams);
        }
        else {
            method(newParams);
        }
    };
    return DataComponent;
}());
DataComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'acms-data',
                template: "<ng-container [ngSwitch]=\"cell.type\" > <div *ngSwitchCase=\"'html'\" [innerHTML]=\"cell.data\"> </div> <div *ngSwitchCase=\"'img'\"> <img *ngIf=\"!cell.config.method && !cell.config.url\" [src]=\"cell.data\" [attr.height]=\"cell.config.height\" [attr.width]=\"cell.config.width\" /> <a class=\"imgClick\" *ngIf=\"cell.config.method && !cell.config.url\" (click)=\"genericClickMethod($event, cell.config.method, cell.config.params, cell.config.context, cell.contextRow)\" ><img [src]=\"cell.data\" [attr.height]=\"cell.config.height\" [attr.width]=\"cell.config.width\" /></a> <a class=\"imgURL\" *ngIf=\"!cell.config.method && cell.config.url\" [attr.href]=\"cell.config.url\" [attr.target]=\"cell.config.target\"><img [src]=\"cell.data\" [attr.height]=\"cell.config.height\" [attr.width]=\"cell.config.width\" /></a> </div> <div *ngSwitchCase=\"'svg'\"> <span *ngIf=\"!cell.config.method && !cell.config.url\" [innerHTML]=\"cell.data\"></span> <a class=\"svgClick\" *ngIf=\"cell.config.method && !cell.config.url\" (click)=\"genericClickMethod($event, cell.config.method, cell.config.params, cell.config.context, cell.contextRow)\" ><span [innerHTML]=\"cell.data\"></span></a> <a class=\"svgURL\" *ngIf=\"!cell.config.method && cell.config.url\" [attr.href]=\"cell.config.url\" [attr.target]=\"cell.config.target\"><span [innerHTML]=\"cell.data\"></span></a> </div> <div *ngSwitchCase=\"'url'\"> <a (click)=\"stopPropagation($event)\" [attr.href]=\"(cell.config.prefix) ? (cell.config.prefix+cell.data) : cell.data\" [attr.title]=\"cell.config.title\" [attr.target]=\"cell.config.target\">{{ (cell.config.content) ? ( ( cell.config.isContentTranslatable ) ? (cell.config.content | translate) : cell.config.content ) : ( (cell.config.prefix) ? (cell.config.prefix+cell.data) : cell.data ) }}</a> </div> <div *ngSwitchCase=\"'function'\"> <a *ngIf=\"!cell.isTranslatable\" class=\"functionClick\" (click)=\"genericClickMethod($event, cell.config.method, cell.config.params, cell.config.context, cell.contextRow)\" >{{ cell.data }}</a> <a *ngIf=\"cell.isTranslatable\" class=\"functionClick\" (click)=\"genericClickMethod($event, cell.config.method, cell.config.params, cell.config.context, cell.contextRow)\" >{{ cell.data | translate }}</a> </div> <div *ngSwitchDefault> {{ (cell.isTranslatable) ? (cell.data | translate) : cell.data }} </div> </ng-container>",
                styles: [""],
            },] },
];
/**
 * @nocollapse
 */
DataComponent.ctorParameters = function () { return []; };
DataComponent.propDecorators = {
    'cell': [{ type: _angular_core.Input },],
};

var AcmsTableModule = (function () {
    function AcmsTableModule() {
    }
    /**
     * @return {?}
     */
    AcmsTableModule.forRoot = function () {
        return {
            ngModule: AcmsTableModule,
            providers: []
        };
    };
    return AcmsTableModule;
}());
AcmsTableModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule,
                    ng2Translate_index.TranslateModule,
                    acmsSwitch.AcmsSwitchModule
                ],
                declarations: [
                    AcmsTableComponent,
                    DataComponent
                ],
                exports: [
                    AcmsTableComponent,
                    DataComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
AcmsTableModule.ctorParameters = function () { return []; };

exports.AcmsTableModule = AcmsTableModule;
exports.AcmsTableComponent = AcmsTableComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
