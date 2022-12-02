import { LightningElement, wire, track } from 'lwc';

import getContacts from '@salesforce/apex/AccountSiblingFinderController.getAccountsWithPrimaryContacts';
import saveRecords from '@salesforce/apex/AccountSiblingFinderController.saveRecords';

import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.MobilePhone';
import CONTACT_STATUS_FIELD from '@salesforce/schema/Contact.Status__c';
import TAX_ID_FIELD from '@salesforce/schema/Contact.Tax_Id__c';

// Data Table Columns
const COLS = [
    {
        label: 'Account',
        fieldName: ACCOUNT_NAME_FIELD.fieldApiName
    },
    {
        label: 'Primary Conact',
        fieldName: CONTACT_NAME_FIELD.fieldApiName
    },
    { 
        label: 'Email', 
        fieldName: CONTACT_EMAIL_FIELD.fieldApiName, 
    },
    {
        label: 'Mobile',
        fieldName: CONTACT_PHONE_FIELD.fieldApiName,
        type: 'phone'
    },
    {
        label: 'Status',
        fieldName: CONTACT_STATUS_FIELD.fieldApiName,
        type: 'email'
    },
    {
        label: 'Tax Id',
        fieldName: TAX_ID_FIELD.fieldApiName,
        type: 'email'
    }
];

export default class AccountSiblingFinderContainer extends LightningElement {
    @track data;
    @track error;

    searchString;
    columns = COLS
    showRecords = false;

    handleFormInputChange(event) {
        console.log(event.target.value);
        this.data = undefined;
        this.searchString = event.target.value;
    }

    handleLoadSiblingAccounts() {
        console.log('InsidehandleLoadSiblingAccounts ');
        getContacts({ searchString: this.searchString})
            .then(result => {
                this.data = result;
            })
            .catch(error => {
                console.log('ERROR: ', error);
                this.error = error;
            });
    }

    handleUpdateContactStatus() {
        const records = this.template.querySelector('lightning-datatable').getSelectedRows();
            // .map( contact => contact.Status__c = "Contacted");

        console.log('HandleUpdate: records: ', records);
        saveRecords({ contactsToUpdate: records })
         .then((result) => {
            // success toast
             console.log(result);
         })
         .catch((error) => {
            // failure toast
             console.log(error);
         });
    }
}