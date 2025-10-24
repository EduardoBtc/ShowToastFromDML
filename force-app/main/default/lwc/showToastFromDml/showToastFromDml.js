import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import { refreshApex } from '@salesforce/apex';
import { RefreshEvent } from 'lightning/refresh';
 
export default class ShowToastFromDml extends LightningElement {
    // Required properties
    @api recordId;
    @api objectApiName;
    @api fieldMonitoringApiName;
    
    // Toast title properties
    @api toastTitle = 'Notification';
    
    // Toast message properties
    @api toastMessage = 'Field has been updated';
    
    // Toast appearance properties
    @api toastVariant = 'info';
    @api toastMode = 'dismissable';
    
    // View refresh properties
    @api forceRefreshView = false;
    @api refreshDelayMs = 1000;
    
    // Advanced properties
    @api showOnlyOnce = false;
    @api debugMode = false;
    
    // Help properties
    @api helpVariables = '';
    @api helpExamples = '';
    @api helpTip = '';
    
    // Internal variables
    lastSeenModified;
    oldValue;
    hasShownToast = false;
    subscription = null;
    _wiredRecord = null;
   
    get fields() {
        return this.objectApiName ? [`${this.objectApiName}.${this.fieldMonitoringApiName}`] : [];
    }
    
   
    @wire(getRecord, { recordId: '$recordId', fields: '$fields' })
    wireRecord(value) {
        this._wiredRecord = value;
        const { data, error } = value;
        
        if (error) {
            this.logDebug('Error getting record for monitoring:', error);
            return;
        }
        
        // Check if wire recordId matches page recordId
        if (data && data.id && this.recordId && data.id !== this.recordId) {
            return;
        }
        
        if (data && data.fields && data.fields[this.fieldMonitoringApiName]) {
            const current = data.fields[this.fieldMonitoringApiName].value;
            this.logDebug('Valid wire record for recordId:', this.recordId, 'Field:', this.fieldMonitoringApiName, 'Value:', current);
            
            // First load - just store value
            if (this.lastSeenModified === undefined) {
                this.lastSeenModified = current;
                this.oldValue = current;
                this.logDebug('Initial field value:', current);
                return;
            }
            
            // Field changed - check if should show toast
            if (current !== this.lastSeenModified) {
                this.logDebug('Field changed from', this.lastSeenModified, 'to', current);
                
                // Check if should show only once
                if (this.showOnlyOnce && this.hasShownToast) {
                    this.logDebug('Toast already shown and showOnlyOnce is active');
                    return;
                }
                
                // Store values for merge fields
                this.oldValue = this.lastSeenModified;
                this.lastSeenModified = current;
                
                // Process and show toast
                this.processAndShowToast(current);
                
                // Mark that toast was shown
                this.hasShownToast = true;
            }
        }
    }
   
    /**
     * Processes merge fields and shows the toast
     */
    processAndShowToast(fieldValue) {
        try {
            // Process title (automatic if merge fields exist)
            let processedTitle = this.hasMergeFields(this.toastTitle) 
                ? this.processMergeFields(this.toastTitle, fieldValue)
                : this.toastTitle;
            
            // Process message (automatic if merge fields exist)
            let processedMessage = this.hasMergeFields(this.toastMessage)
                ? this.processMergeFields(this.toastMessage, fieldValue)
                : this.toastMessage;
            
            this.logDebug('Showing toast:', {
                title: processedTitle,
                message: processedMessage,
                variant: this.toastVariant,
                mode: this.toastMode
            });
            
            // Show toast
            this.showToast(processedTitle, processedMessage, this.toastVariant, this.toastMode);
            
            // Refresh view if configured
            if (this.forceRefreshView) {
                this.scheduleRefresh();
            }
            
        } catch (error) {
            this.logDebug('Error processing toast:', error);
        }
    }
    
    /**
     * Processes merge fields in strings
     */
    processMergeFields(template, fieldValue) {
        if (!template || typeof template !== 'string') {
            return template;
        }
        
        const mergeData = {
            oldValue: this.formatValue(this.oldValue),
            newValue: this.formatValue(fieldValue),
            recordId: this.recordId || '',
            objectName: this.objectApiName || ''
        };
        
        let result = template;
        
        // Replace all tokens
        Object.keys(mergeData).forEach(key => {
            const token = `{${key}}`;
            const value = mergeData[key];
            result = result.replace(new RegExp(token, 'g'), value);
        });
        
        this.logDebug('Merge fields processed:', { template, result, mergeData });
        return result;
    }
    
    /**
     * Formats values for display
     */
    formatValue(value) {
        if (value === null || value === undefined || value === '') {
            return 'empty';
        }
        return String(value);
    }
    
    /**
     * Detects if text contains known merge fields
     */
    hasMergeFields(text) {
        if (!text || typeof text !== 'string') return false;
        const knownFields = ['oldValue', 'newValue', 'recordId', 'objectName'];
        return knownFields.some(field => text.includes(`{${field}}`));
    }
    
    /**
     * Shows the toast with all configured properties
     */
    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({ 
            title, 
            message, 
            variant,
            mode
        });
        
        this.dispatchEvent(event);
    }
    
    /**
     * Schedules view refresh with delay
     */
    scheduleRefresh() {
        if (this.refreshDelayMs > 0) {
            this.logDebug(`Scheduling refresh in ${this.refreshDelayMs}ms`);
            setTimeout(() => {
                this.logDebug('Executing view refresh');
                this.dispatchEvent(new RefreshEvent());
            }, this.refreshDelayMs);
        } else {
            this.logDebug('Executing immediate view refresh');
            this.dispatchEvent(new RefreshEvent());
        }
    }
    
    /**
     * Conditional debug log
     */
    logDebug(...args) {
        if (this.debugMode) {
            console.log('[ShowToastFromDml]', ...args);
        }
    }
 
    connectedCallback() {
        this.logDebug('Component connected for recordId:', this.recordId, 'Object:', this.objectApiName, 'Field:', this.fieldMonitoringApiName);
        this.initializeCdcSubscription();
    }
 
    disconnectedCallback() {
        this.logDebug('Component disconnected for recordId:', this.recordId, 'cleaning up subscription');
        if (this.subscription) {
            try {
                unsubscribe(this.subscription, () => {});
                this.logDebug('CDC subscription cancelled successfully');
            } catch (e) {
                this.logDebug('Error cancelling subscription:', e);
            }
            this.subscription = null;
        }
    }
 
    get cdcChannel() {
        if (!this.objectApiName) {
            return null;
        }
        const apiName = this.objectApiName;
        if (apiName.endsWith('__c')) {
            return `/data/${apiName.replace('__c', '__ChangeEvent')}`;
        }
        return `/data/${apiName}ChangeEvent`;
    }
 
    initializeCdcSubscription() {
        const channel = this.cdcChannel;
        if (!channel || !this.recordId) {
            this.logDebug('CDC not initialized - channel:', channel, 'recordId:', this.recordId);
            return;
        }

        this.logDebug('Initializing CDC subscription for channel:', channel, 'recordId:', this.recordId);

        onError((error) => {
            this.logDebug('empApi error:', error);
        });

        const replayId = -1; // only new events
        subscribe(channel, replayId, (message) => this.handleCdcMessage(message))
            .then((response) => {
                this.subscription = response;
                this.logDebug('CDC subscription created successfully for recordId:', this.recordId);
            })
            .catch((err) => {
                this.logDebug('Failed to subscribe to CDC:', err);
            });
    }

    handleCdcMessage(message) {
        try {
            this.logDebug('CDC message received:', message);
            
            // Ensure this.recordId is defined
            if (!this.recordId) {
                this.logDebug('recordId not defined, ignoring CDC event');
                return;
            }
            
            const recordIds = message?.data?.payload?.ChangeEventHeader?.recordIds || [];
            this.logDebug('CDC event recordIds:', recordIds, 'Current page recordId:', this.recordId);
            
            // Check if page recordId is in the list of affected recordIds
            if (Array.isArray(recordIds) && recordIds.includes(this.recordId)) {
                this.logDebug('Change detected for current page recordId:', this.recordId);
                
                if (this._wiredRecord) {
                    this.logDebug('Updating wire adapter via refreshApex');
                    refreshApex(this._wiredRecord);
                } else {
                    this.logDebug('Wire adapter not available for refresh');
                }
            } else {
                this.logDebug('CDC event is not for current page recordId. Ignoring.');
            }
        } catch (e) {
            this.logDebug('Error processing CDC message:', e);
        }
    }
}