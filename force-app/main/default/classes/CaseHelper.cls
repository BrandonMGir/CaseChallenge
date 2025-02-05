public with sharing class CaseHelper {
    public CaseHelper() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getOpenCases(){
        try {
            return [SELECT CaseNumber, Subject FROM Case WHERE Status != 'Closed'];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createCase(String subject, String origin){
        try {
            Case newCase = new Case(Subject = subject, Origin = origin, Status = 'New');
            insert newCase;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateCases(List<Case> cases){
        try {
            update cases;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}