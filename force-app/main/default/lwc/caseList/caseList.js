import { LightningElement, wire } from 'lwc';
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

        let newCases = [];

        this.draftValues.forEach((el) => {
            let row  = Number(el.id.substring(4));
            newCases.push({Id: this.openCases.data[row].Id, Subject: el.Subject});
        });

        updateCases({cases: newCases})
            .then((res) =>{
                this.message = 'Updated case'
                this.refreshList();
            })
            .catch((e) => {
                this.message = e.body.message;
            });

    }
}