import { LightningElement, wire, track } from 'lwc';

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
        editable: true },
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
    columns = COLS

    handleFormInputChange(event) {}

    handleGetSiblingAccounts(event) {}
}