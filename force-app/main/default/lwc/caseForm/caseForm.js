import { LightningElement } from 'lwc';
import createCase from '@salesforce/apex/CaseHelper.createCase';

export default class CaseForm extends LightningElement {

    origin = '--None--';

    responseMessage = '';

    get originOptions(){
        return [
            {label: '--None--', value: '--None--'},
            {label: 'Phone', value: 'Phone'},
            {label: 'Email', value: 'Email'},
            {label: 'Web', value: 'Web'},
        ];
    }


    createCase(){

        createCase({subject: this.refs.subject.value, origin: this.origin})
        .then((res) => {
            this.responseMessage = 'Created new Case';
            this.dispatchEvent(new CustomEvent('createevent'));
            console.log('RESPONSE: ' + res);
        })
        .catch((e) => {
            console.log(e);
            this.responseMessage = e.body.message;
        })
    }

    handleOriginChange(event) {
        this.origin = event.detail.value;
    }
}