import { LightningElement, track ,api} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getSearchData from '@salesforce/apex/ChatGPTController.getSearchData';

export default class GenAI extends LightningElement {
    @track conversation = [];
    @track messageInput = '';
    @track isLoading = false;
    @api recordId;

    handleChange(event) {
        this.messageInput = event.target.value;
    }

    handleKeyUp(event) {
        if (event.keyCode === 13) {
            this.handleSendMessage();
        }
    }

    async handleSendMessage() {
        this.isLoading = true;
        this.template.querySelector(".slds-chat").classList.add('parent');
        const userMessage = {
            id: 'user-' + this.conversation.length,
            role: 'user',
            text: this.messageInput,
            containerClass: 'slds-chat-message slds-chat-message__text_outbound user-message',
            textClass: 'slds-chat-message__text slds-chat-message__text_outbound',
            isBot: false
        };
        this.conversation = [...this.conversation, userMessage];
        this.messageInput = '';

      
            getSearchData({searchString:this.conversation[this.conversation.length - 1]?.text})
            .then(result=>{

                let responseBody = JSON.parse(JSON.stringify(JSON.parse(result)));
                this.isLoading = false;

                if (responseBody && responseBody.candidates[0].content.parts[0].text && responseBody.candidates[0].content.parts[0].text.length > 0) {
                    const assistantMessage = {
                        id: 'assistant-' + this.conversation.length,
                        role: 'assistant',
                        text: responseBody.candidates[0].content.parts[0].text,
                        containerClass: 'slds-chat-message slds-chat-message__text_inbound',
                        textClass: 'slds-chat-message__text slds-chat-message__text_inbound',
                        isBot: true
                    };
                    this.conversation = [...this.conversation, assistantMessage];
                } else {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'ERROR!!!',
                        message: 'Error generating ChatGPT response: Empty response',
                        variant: 'error'
                    }))
                }
            
            })
            .catch(error=>{
            this.showSpinner = false
            console.log('error is '+error)
            })
        
            this.isLoading = false;
        
    }
}