public with sharing class ChatGPTController {
    public ChatGPTController() {

    }
    //https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=
    private static final String ENDPOINT ='';
             @AuraEnabled
    public static String getSearchData(String searchString){
                      try{
                        String reso='';
                           String seachQueryEscaped = (searchString).trim();
                           Http http = new Http();
                           String reqBody = '{"contents":[{"parts":[{"text":"'+searchString+'"}]}]}';
                        // System.debug('Query '+seachQueryEscaped+' '+reqBody);
                          HttpRequest request = new HttpRequest();
                          request.setEndpoint(ENDPOINT);
                          request.setMethod('POST');
                          request.setHeader('Content-Type', 'application/json');
                          request.setHeader('Authorization', '{"web":{"client_id":"KEY","project_id":"gen-lang-client-0892588700","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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"}}');
                          request.setBody(reqBody);
                          HttpResponse response = http.send(request);
                          reso=response.getBody();
                          System.debug('response'+reso);
                          if(response.getStatusCode() != 200) {
                          System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' +reso);
                         
                        
                          return reso;
                          }
                          return reso;
                     }catch(Exception ex){
                          System.debug('Exception in Catch of Server-Side Controller '+ex);
                          throw new AuraHandledException(ex.getMessage());
                     }
         }

         @AuraEnabled 
         public static void sendEmailController(String emailDetailStr) { 
             EmailWrapper emailDetails = (EmailWrapper) JSON.deserialize(emailDetailStr, EmailWrapper.class); 
             Messaging.reserveSingleEmailCapacity(1); 
             try { 
                 messaging.SingleEmailMessage mail = new messaging.SingleEmailMessage(); 
                 mail.setToAddresses(emailDetails.toAddress); 
                 mail.setCcAddresses(emailDetails.ccAddress); 
                 mail.setReplyTo('test.k@xyz.com'); 
                 mail.setSenderDisplayName('Test'); 
                 mail.setSubject(emailDetails.subject); 
                 mail.setHtmlBody(emailDetails.body); 
                 mail.setEntityAttachments(emailDetails.files); 
                 Messaging.sendEmail(new List<messaging.SingleEmailMessage>{ mail }); 
             } catch (exception e) { 
                 throw new AuraHandledException(e.getMessage()); 
             } 
         } 
         Class EmailWrapper { 
             public List<String> toAddress; 
             public List<String> ccAddress; 
             public String subject; 
             public String body; 
             public List<String> files; 
         } 

         @AuraEnabled 
         public static List<SObject> search(String searchString) { 
             List<SObject> searchList = new List<SObject>(); 
             try { 
                 String searchStr = '*' + searchString + '*'; 
                 String searchquery = 
                     'FIND\'' + 
                     searchStr + 
                     '\'IN ALL FIELDS RETURNING Contact(id, name, email where email != null), User(id, name, email where email != null AND isActive = true) LIMIT 10'; 
                 List<List<SObject>> searchResult = search.query(searchquery); 
                 for (List<SObject> curList : searchResult) { 
                     searchList.addAll(curList); 
                 } 
                 system.debug('searchList:::' + searchList.size()); 
             } catch (Exception e) { 
                 throw new AuraHandledException(e.getMessage()); 
             } 
             return searchList; 
         } 
}