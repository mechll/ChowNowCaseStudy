public with sharing class AccountSiblingFinderController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAccountsWithPrimaryContacts(String searchString) {
        List<Contact> primaryContacts = new List<Contact>();

        String fuzzyMatchString = '%' + searchString + '%';

        List<Account> accountSearchResults = [SELECT Id,
                                                     ParentId 
                                                FROM Account 
                                               WHERE Id=:searchString  
                                                  OR Name LIKE :fuzzyMatchString 
                                                WITH SECURITY_ENFORCED LIMIT 1];

        if(accountSearchResults.isEmpty()) {
            // no search results found
            return primaryContacts;
        }

        Account targetedAccount = accountSearchResults[0];
        
        // Not all accounts may have a primary contact role set, those will be excluded
        List<AccountContactRole> accountContactRoles = new List<AccountContactRole>();

        // In Case None of the accounts have contact roles set
        accountContactRoles = [SELECT ContactId, 
                                        AccountId 
                                    FROM AccountContactRole 
                                WHERE IsPrimary=true 
                                    AND AccountId IN (SELECT Id FROM Account WHERE ParentId=:targetedAccount.ParentId)
                                WITH SECURITY_ENFORCED];

        // extract primary contact Ids
        Set<Id> contactIds = new Set<Id>();
        for(AccountContactRole acr : accountContactRoles) {
            contactIds.add(acr.ContactId);
        }

        primaryContacts = [SELECT Account.Id, 
                                    Account.Name, 
                                    Name, 
                                    Email,
                                    MobilePhone,
                                    Status__c,
                                    Tax_Id__c
                                FROM Contact 
                            WHERE Id IN :contactIds WITH SECURITY_ENFORCED];

        return primaryContacts;
    }

   @AuraEnabled
   public static void updateContactsStatus(List<Contact> contactsToUpdate){
        try {
            for(Contact cont : contactsToUpdate) {
                cont.Status__c = 'Contacted';
            }
           update contactsToUpdate;

        } catch(DmlException e) {
            System.debug('An error occured while updating Primary Contact Status to \'Contacted\'' + e.getStackTraceString());
        }
         
   }
}
