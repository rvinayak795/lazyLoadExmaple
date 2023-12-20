import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/layLoadExample.getAccounts';

const columns = [
    { label: 'Id', fieldName: 'Id', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text'},
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'text'}
  
];

export default class LazyLoadingLWC extends LightningElement {
    accounts=[];
    error;
    columns = columns;
    rowLimit =20;
    rowOffSet=0;
  
    connectedCallback() {
        this.loadData();
    }

    loadData(){
        return getAccounts({ recordLimit: this.rowLimit , offset : this.rowOffSet })
        .then(result => {
            //Updating the accounts array from result as well apart from updating the updatedRecords variable
            let updatedRecords = [...this.accounts, ...result];
            this.accounts = updatedRecords;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.accounts = undefined;
        });
    }

    loadMoreHandler(event) {
        const currentRecord = this.accounts;
        const { target } = event;
        target.isLoading = true;

        this.rowOffSet = this.rowOffSet + this.rowLimit;
        this.loadData()
            .then(()=> {
                target.isLoading = false;
            });   
    }
}