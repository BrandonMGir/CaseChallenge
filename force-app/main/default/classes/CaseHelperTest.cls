@isTest
public class CaseHelperTest {

    @TestSetup
    static void makeData(){
        List<Case> cases = new List<Case>();


            Case cp1 = new Case(Subject = 'test Phone New', Origin = 'Phone', Status = 'New');
            Case cp2 = new Case(Subject = 'test Phone Closed', Origin = 'Phone', Status = 'Closed');

            Case cw1 = new Case(Subject = 'test Web New', Origin = 'Web', Status = 'New');
            Case cw2 = new Case(Subject = 'test Web Closed', Origin = 'Web', Status = 'Closed');

            Case ce1 = new Case(Subject = 'test Email New', Origin = 'Email', Status = 'New');
            Case ce2 = new Case(Subject = 'test Email Closed', Origin = 'Email', Status = 'Closed');

            cases.add(cp1);
            cases.add(cp2);
            cases.add(cw1);
            cases.add(cw2);
            cases.add(ce1);
            cases.add(ce2);
    
        insert cases;
    }

    @isTest
    static void checkOpenCaseCount_Positive() {
        List<Case> cases = CaseHelper.getOpenCases();
        Integer count = [SELECT COUNT() FROM Case WHERE Status != 'Closed'];

        Assert.areEqual(count, cases.size());
    }

    @isTest
    static void createCase_Positive() {
        String origin = 'Phone';
        String subject = 'test subject';

        CaseHelper.createCase(subject, origin);
        
        List<Case> cases = [SELECT Origin, Status FROM Case WHERE Origin = :origin AND Subject = :subject];

        Assert.areEqual(1, cases.size());
    }


    @isTest
    static void updateCases_Positive() {
        String subject = 'test subject';

        List<Case> cases = new List<Case>();

        Case toUpdate = [SELECT Id FROM Case WHERE Subject = :'test Phone New' LIMIT 1];
        Id cId = toUpdate.Id;
        toUpdate.Subject = subject;
        cases.add(toUpdate);

        CaseHelper.updateCases(cases);
        
        Case updated = [SELECT Subject FROM CASE WHERE Id = :cId LIMIT 1];

        Assert.areEqual(subject, updated.Subject);
    }


}