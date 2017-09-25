import { OnInit, OnChanges } from "@angular/core";
export declare class DataComponent implements OnInit, OnChanges {
    row: any;
    constructor();
    ngOnInit(): void;
    ngOnChanges(): void;
    /**
     * Stop the propagation of event
     * @param evt
     */
    stopPropagation(evt: any): void;
    /**
     * Method called on svg/img by click event
     * @param evt
     * @param method
     * @param params
     */
    genericClickMethod(evt: any, method: any, params: any, context: any): void;
}
