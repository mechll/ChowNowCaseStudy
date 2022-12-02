import { LightningElement, wire, api } from 'lwc';

import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.MobilePhone';
import CONTACT_STATUS_FIELD from '@salesforce/schema/Contact.Status__c';
import TAX_ID_FIELD from '@salesforce/schema/Contact.Tax_Id__c';

export default class AccountSiblingFinderContainer extends LightningElement {


    handleFormInputChange(event) {}

    handleGetSiblingAccounts(event) {}
}