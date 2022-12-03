import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { reduceErrors } from 'c/ldsUtils';

import getContacts from '@salesforce/apex/AccountSiblingFinderController.getAccountsWithPrimaryContacts';
import updateContactsStatus from '@salesforce/apex/AccountSiblingFinderController.updateContactsStatus';

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
    },
    {
        label: 'Status',
        fieldName: CONTACT_STATUS_FIELD.fieldApiName,
    },
    {
        label: 'Tax Id',
        fieldName: TAX_ID_FIELD.fieldApiName,
    }
];

export default class AccountSiblingFinderContainer extends LightningElement {
    @track data;
    @track error;

    searchString;
    columns = COLS;
    isLoading;
    showChangeStatusButton;
    resultsFound;

    get showRecords() {
        return this.resultsFound &&  this.data && this.data.length>0;
    }
    

    async handleSubmitSearch() {
        this.isLoading = true;
        await this.getSiblingAccounts();
        this.isLoading = false;
    }

    handleFormInputChange(event) {
        this.searchString = event.target.value;
    }

    handleSelectedRow(event) {
        const hasRowsSelected = event.detail.selectedRows.length>0;
        this.showChangeStatusButton = hasRowsSelected
    }

    getSiblingAccounts() {
        getContacts({ searchString: this.searchString})
            .then(result => {
                this.data = [...result];
            })
            .catch(error => {
                console.log('ERROR: ', error);
                this.error = error;
            })
            .finally(() =>{
                this.resultsFound = this.data.length>0;
            });
    }

    handleUpdateContactStatus() {
        const records = this.template.querySelector('lightning-datatable').getSelectedRows();

        if(records.length<=0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Opps!',
                    message: 'Please select a record to update.',
                    variant: 'neutral'
                })
            );
            return;
        }

        updateContactsStatus({ contactsToUpdate: records })
         .then(() => {
            // gets updated records
            this.getSiblingAccounts();
            this.resetSelectedRows();
            // success toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
         })
         .catch((error) => {
            // failure toast
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error Updating Contact Status',
                    message: error.body.message,
                    variant: 'error'
                })
            );

            this.error = reduceErrors(error);
            console.log(error);
         });
    }

    resetSelectedRows() {
        this.template.querySelector('lightning-datatable').selectedRows=[];
        this.showChangeStatusButton = false;
    }
}