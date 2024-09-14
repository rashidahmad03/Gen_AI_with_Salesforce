import { LightningElement, track, api, wire } from 'lwc';
import getSearchData from '@salesforce/apex/ChatGPTController.getSearchData';
import { getRecord } from "lightning/uiRecordApi";

const FIELDS = ["fields"];

export default class GenGPT extends LightningElement {

    @track searchTerm = '';
    @api imageUrl;
    @track showSpace = true;
    @track showSpinner = false
    @track responseData;
    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields: FIELDS })
    quotedata;
    handleSendMessage(event) {
        this.isemailsection=false
        // Perform search when the Enter key is pressed and pass fields value
        this.searchTerm = "Can you please write quote summarization in html response using below details of quotes: Name: " 
        this.searchTerm = this.searchTerm + " Task Number:" +this.quotedata ;
        this.searchTerm = this.searchTerm + " Task Location:" +this.quotedata  ;
        this.searchTerm = this.searchTerm + " Task Status:" + this.quotedata ;
        this.searchTerm = this.searchTerm + " Internal Operation Notes:" + this.quotedata
        this.searchTerm = this.searchTerm + " PI Title:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Quote Title:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Terms Conditions :" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Start Date:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " End Date:" + this.quotedata.data.fields;

        this.showSpinner = true
        console.log('quotedata:' + JSON.stringify(this.quotedata));
        console.log('query:' + JSON.stringify(this.searchTerm));
        getSearchData({ searchString: this.searchTerm })
            .then(result => {
                this.showSpinner = false
                let response = JSON.parse(JSON.stringify(JSON.parse(result)));
                if (response.error) {
                    this.responseData = response.error.message;
                } else if (response.candidates[0].content.parts[0].text) {
                    console.log('orignal' + JSON.stringify(response.candidates[0].content.parts[0].text));
                    this.responseData = (response.candidates[0].content.parts[0].text).replace('html', "");
                }

                console.log('response  ' + this.responseData);
            })
            .catch(error => {
                this.showSpinner = false
                console.log('error is ' + error)
            })


    }
    isemailsection = false;
    emailbody = '';
    draftemail() {
        // Perform search when the Enter key is pressed
        this.searchTerm = "draft email for quote in html response using below details of quotes: Name: " + this.quotedata.data.fields.Name.value + " Quote Status: " + this.quotedata.data.fields+ " Approver: " + this.quotedata.data.fields+ " Balance Due SYN  :" + this.quotedata.data.fields + " Region :" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Task Number:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Task Location:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Task Status:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Internal Operation Notes:" + this.quotedata.data;
        this.searchTerm = this.searchTerm + " PI Title:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Quote Title:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Terms Conditions :" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " Start Date:" + this.quotedata.data.fields;
        this.searchTerm = this.searchTerm + " End Date:" + this.quotedata.data.fields;

        this.showSpinner = true
        console.log('quotedata:' + JSON.stringify(this.quotedata));
        console.log('query:' + JSON.stringify(this.searchTerm));
        getSearchData({ searchString: this.searchTerm })
            .then(result => {
                this.showSpinner = false
                let response = JSON.parse(JSON.stringify(JSON.parse(result)));
                if (response.candidates[0].content.parts[0].text) {
                    console.log('orignal' + JSON.stringify(response.candidates[0].content.parts[0].text));
                    this.emailbody = (response.candidates[0].content.parts[0].text).replace('html', "");


                    console.log('response  ' + this.emailbody);
                }
            })
            .catch(error => {
                this.showSpinner = false
                console.log('error is ' + error)
            })
        this.isemailsection = true;
    }
}