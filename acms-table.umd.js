(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('ng2-translate/index'), require('acms-switch')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'ng2-translate/index', 'acms-switch'], factory) :
	(factory((global['acms-table'] = {}),global._angular_core,global._angular_common,global.ng2Translate_index,global.acmsSwitch));
}(this, (function (exports,_angular_core,_angular_common,ng2Translate_index,acmsSwitch) { 'use strict';

var Item = (function () {
    /**
     * @param {?} data
     */
    function Item(data) {
        this.isResponsive = false;
        this.isTranslatable = false;
        this.actions = [];
        this.data = data;
    }
    return Item;
}());
var AcmsTableComponent = (function () {
    /**
     * @param {?} _ref
     */
    function AcmsTableComponent(_ref) {
        this._ref = _ref;
        this.rowSelected = new _angular_core.EventEmitter();
        this.emptyTableEvt = new _angular_core.EventEmitter();
        this.targets = [];
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
        this.targets = [];
        this.results = [];
        this.filteredResults = [];
        this.displayedResults = [];
    };
    /**
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
                src: el.target,
                actions: el.actions,
                isResponsive: el.hideWithResponsiveView,
                messageIfEmpty: el.messageIfEmpty,
                isMessageIfEmptyTranslatable: el.isMessageIfEmptyTranslatable
            };
            _this.targets.push(target);
            //which column is searchable
            if (el.is_searchable) {
                _this.colsSearchable.push(index);
            }
            return el;
        });
        /**
         * we loop on collection to extract data on json, we use the targets array installed before
         * to know for each item the target and if the element is responsive
         */
        this.collection.forEach(function (el, index) {
            var /** @type {?} */ row = {};
            row.items = [];
            //we set a index if there is no id key defined in the config file for this row
            row.id = (el[_this.config.global.target_id]) ? el[_this.config.global.target_id] : index;
            _this.targets.forEach(function (target) {
                var /** @type {?} */ translatable = false;
                //find object
                if (target.src !== null) {
                    var /** @type {?} */ objectFound = target.src.split('.').reduce(function (object, property) {
                        if (!object[property] || object[property] === ' ') {
                            object[property] = target.messageIfEmpty;
                            if (target.isMessageIfEmptyTranslatable)
                                translatable = true;
                        }
                        return object[property];
                    }, el);
                    if (!objectFound) {
                        return;
                    }
                }
                
                var /** @type {?} */ item = new Item((objectFound) ? objectFound : null);
                item.actions = target.actions;
                item.isResponsive = target.isResponsive;
                item.isTranslatable = translatable;
                row.items.push(item);
            });
            _this.results.push(row);
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
            a = a.items[columnIndex].data;
            b = b.items[columnIndex].data;
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
        this.sendEvent(type + 'All', this.selectedRowsList);
        // reset select option
        var /** @type {?} */ copy = this.config.global.group_actions;
        this.config.global.group_actions = null;
        this._ref.detectChanges();
        this.config.global.group_actions = copy;
        this._ref.detectChanges();
    };
    /**
     * @param {?} type
     * @param {?} rowId
     * @return {?}
     */
    AcmsTableComponent.prototype.sendEvent = function (type, rowId) {
        this.rowSelected.emit({ type: type, id: rowId });
    };
    /**
     * @param {?} evt
     * @return {?}
     */
    AcmsTableComponent.prototype.updateSelectedRowsList = function (evt) {
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
    return AcmsTableComponent;
}());
AcmsTableComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'acms-table',
                template: "<div *ngIf=\"config.global.search\"  class=\"tableSearchBox\" (keyup)=\"searchWithTerms($event, searchBox)\" > <span>{{ (config.global.isSearchLabelTranslatable) ? (config.global.searchLabel | translate) : (config.global.searchLabel) }}</span> <input type=\"text\" #searchBox placeholder=\"{{ (config.global.isPlaceHolderSearchTranslatable) ? (config.global.placeHolderSearch  | translate) : (config.global.placeHolderSearch) }}\" /> </div> <div *ngIf=\"config.global.group_actions && config.global.group_actions.length > 0\" class=\"tableGroupActions\"> <acms-switch [id]=\"main\" (switchEvent)=\"selectDeselectAll($event)\" id=\"main-switch\"></acms-switch> <select (change)=\"selectGlobalAction($event)\"> <option disabled select>Group Action</option> <option *ngFor=\"let action of config.global.group_actions\">{{ action }}</option> </select> </div> <table *ngIf=\"!isEmptyTable\"> <thead *ngIf=\"config.global.showHeaders\"> <tr> <ng-template ngFor let-header [ngForOf]=\"headers\" let-i=\"index\"> <th *ngIf=\"showColumn(header.hideWithResponsiveView)\"> {{ (header.is_translatable) ? (header.title  | translate) : (header.title) }} <span class=\"sortArrow\" *ngIf=\"header.is_sortable\"> <span class=\"sortArrowUp\" (click)=\"sort(i, 'ASC')\"> &#x25B2; </span> <span class=\"sortArrowDown\" (click)=\"sort(i, 'DESC')\"> &#x25BC; </span> </span> </th> </ng-template> </thead> <tbody> <tr *ngFor=\"let result of displayedResults\"> <ng-template ngFor let-row [ngForOf]=\"result.items\"> <td *ngIf=\"row.actions && row.actions.length > 0\"> <ng-template ngFor let-action [ngForOf]=\"row.actions\"> <span *ngIf=\"action === 'select'\" class=\"actions action-select\"><span> <acms-switch [id]=\"result.id\" (switchEvent)=\"updateSelectedRowsList($event)\" class=\"item-switch\"></acms-switch> </span></span> <span *ngIf=\"action === 'update'\" class=\"actions action-update\" (click)=\"sendEvent('update', result.id)\"><span>UPDATE</span></span> <span *ngIf=\"action === 'delete'\" class=\"actions action-delete\" (click)=\"sendEvent('delete', result.id)\"><span>DELETE</span></span> </ng-template> </td> <td *ngIf=\"!row.actions && showColumn(row.isResponsive)\"> {{ (row.isTranslatable) ? (row.data | translate) : row.data }} </td> </ng-template> </tr> </tbody> <caption *ngIf=\"config.global.legend\"> {{ (config.global.isLegendTranslatable) ? (config.global.legend | translate) : (config.global.legend) }} </caption> </table> <div class=\"tablePagination\" *ngIf=\"config.global.pagination && !isEmptyTable\"> <span *ngFor=\"let page of collectionPage\" [ngClass]=\"(page.current)?'currentLinkPagination':''\"> <a href=\"#\" (click)=\"changePage(page.number)\">{{ page.name }}</a> </span> </div> <div id=\"acms-table-empty-message\" *ngIf=\"isEmptyTable\"> <div>{{ (config.global.isMessageIfEmptyTableTranslatable) ? (config.global.messageIfEmptyTable | translate) : (config.global.messageIfEmptyTable) }}</div> </div> ",
                styles: [".currentLinkPagination a { font-weight: bold; } .actions { position: relative; top: -2px; } .action-update, .action-delete { display: inline-block; min-width: 16px ; height: 15px; margin-left: 10px; cursor: pointer; } .action-update span, .action-delete span { display: none; } .action-update:before { font-family: 'FontAwesome'; left: 0px; position: absolute; top: 2px; content: '\\f040'; } .action-delete:before { font-family: 'FontAwesome'; left:0px; position: absolute; top: 2px; content: '\\f1f8'; } acms-switch { position: relative; top: 4px; } "],
            },] },
];
/**
 * @nocollapse
 */
AcmsTableComponent.ctorParameters = function () { return [
    { type: _angular_core.ChangeDetectorRef, },
]; };
AcmsTableComponent.propDecorators = {
    'config': [{ type: _angular_core.Input },],
    'collection': [{ type: _angular_core.Input },],
    'rowSelected': [{ type: _angular_core.Output },],
    'emptyTableEvt': [{ type: _angular_core.Output },],
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
                    AcmsTableComponent
                ],
                exports: [
                    AcmsTableComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
AcmsTableModule.ctorParameters = function () { return []; };

exports.AcmsTableModule = AcmsTableModule;
exports.Item = Item;
exports.AcmsTableComponent = AcmsTableComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
