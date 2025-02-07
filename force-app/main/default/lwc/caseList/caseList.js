import { api, LightningElement, wire } from 'lwc';
import getOpenCases from '@salesforce/apex/CaseHelper.getOpenCases';
import updateCases from '@salesforce/apex/CaseHelper.updateCases';
import {refreshApex} from '@salesforce/apex';

export default class CaseList extends LightningElement {

    @wire(getOpenCases)
    openCases;

    draftValues = [];

    message = '';

    columns = [
        { label: 'Case Number', fieldName: 'CaseNumber', type:'text' },
        { label: 'Subject', fieldName: 'Subject', type: 'text', editable: true }
    ];

    refreshList(){
        refreshApex(this.openCases);
        this.draftValues = [];
        this.template.querySelector("lightning-datatable").draftValues = [];
    }

    save(event){
        this.draftValues = event.detail.draftValues;
        //console.log('UPDATE: ' + JSON.stringify(this.draftValues));
        let newCases = [];

        updateCases({cases: this.draftValues})
            .then((res) =>{
                this.message = 'Updated case'
                this.refreshList();
            })
            .catch((e) => {
                this.message = e.body.message;
            });

    }
}