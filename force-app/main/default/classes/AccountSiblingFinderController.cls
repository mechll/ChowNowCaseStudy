public with sharing class AccountSiblingFinderController {


    @AuraEnabled(cacheable=true)
    public static List<Contact> getAccountsWithPrimaryContacts(String searchString) {
        System.debug('Inside GetAccountsWithPrimaryContacts: searchString: ' + searchString);

        String searchQueryText = '%' + searchString + '%';
        Account searchedAccount = [SELECT Id,ParentId FROM Account WHERE Id=:searchString  OR Name LIKE :searchQueryText LIMIT 1];
        System.debug('searchedAccount: ' +searchedAccount );
        // Includes the main account above
        Map<Id,Account> siblingAccounts = new Map<Id,Account>([SELECT Id, Name FROM Account WHERE ParentId=:searchedAccount.ParentId LIMIT 1000]);
        System.debug('siblingAccounts: ' + siblingAccounts);
        List<AccountContactRole> accountContactRoles = [SELECT ContactId, AccountId FROM AccountContactRole WHERE IsPrimary=true AND AccountId IN :siblingAccounts.keySet()];
        System.debug('accountContactRoles: ' + accountContactRoles);
        Set<Id> contactIds = new Set<Id>();
        for(AccountContactRole acr : accountContactRoles) {
            contactIds.add(acr.ContactId);
        }
        System.debug('contactIds: ' + contactIds);

        List<Contact> primaryContacts = [SELECT Account.Id, Account.Name, Name, Email, MobilePhone, Status__c,Tax_Id__c FROM Contact WHERE Id IN :contactIds];
        System.debug('Returning primaryContacts: ' + primaryContacts);

        return primaryContacts;
    }
}
