import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { subscribe, unsubscribe, onError } from 'lightning/empApi';
import { refreshApex } from '@salesforce/apex';
import { RefreshEvent } from 'lightning/refresh';
 
export default class ShowToastFromDml extends LightningElement {
    // Propriedades obrigatórias
    @api recordId;
    @api objectApiName;
    @api fieldMonitoringApiName;
    
    // Propriedades de título do toast
    @api toastTitle = 'Notificação';
    
    // Propriedades de mensagem do toast
    @api toastMessage = 'O campo foi atualizado';
    
    // Propriedades de aparência do toast
    @api toastVariant = 'info';
    @api toastMode = 'dismissable';
    
    // Propriedades de refresh da view
    @api forceRefreshView = false;
    @api refreshDelayMs = 1000;
    
    // Propriedades avançadas
    @api showOnlyOnce = false;
    @api debugMode = false;
    
    // Propriedades de ajuda
    @api helpVariables = '';
    @api helpExamples = '';
    @api helpTip = '';
    
    // Variáveis internas
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
            this.logDebug('Erro ao obter registro para monitoramento:', error);
            return;
        }
        
        //verificar se o recordId do wire corresponde ao recordId da página
        if (data && data.id && this.recordId && data.id !== this.recordId) {
            return;
        }
        
        if (data && data.fields && data.fields[this.fieldMonitoringApiName]) {
            const current = data.fields[this.fieldMonitoringApiName].value;
            this.logDebug('Wire record válido para recordId:', this.recordId, 'Campo:', this.fieldMonitoringApiName, 'Valor:', current);
            
            // Primeira carga - apenas armazenar valor
            if (this.lastSeenModified === undefined) {
                this.lastSeenModified = current;
                this.oldValue = current;
                this.logDebug('Valor inicial do campo:', current);
                return;
            }
            
            // Campo mudou - verificar se deve exibir toast
            if (current !== this.lastSeenModified) {
                this.logDebug('Campo alterado de', this.lastSeenModified, 'para', current);
                
                // Verificar se deve exibir apenas uma vez
                if (this.showOnlyOnce && this.hasShownToast) {
                    this.logDebug('Toast já foi exibido e showOnlyOnce está ativo');
                    return;
                }
                
                // Armazenar valores para merge fields
                this.oldValue = this.lastSeenModified;
                this.lastSeenModified = current;
                
                // Processar e exibir toast
                this.processAndShowToast(current);
                
                // Marcar que toast foi exibido
                this.hasShownToast = true;
            }
        }
    }
   
    /**
     * Processa campos de mesclagem e exibe o toast
     */
    processAndShowToast(fieldValue) {
        try {
            // Processar título (automático se houver campos de mesclagem)
            let processedTitle = this.hasMergeFields(this.toastTitle) 
                ? this.processMergeFields(this.toastTitle, fieldValue)
                : this.toastTitle;
            
            // Processar mensagem (automático se houver campos de mesclagem)
            let processedMessage = this.hasMergeFields(this.toastMessage)
                ? this.processMergeFields(this.toastMessage, fieldValue)
                : this.toastMessage;
            
            this.logDebug('Exibindo toast:', {
                title: processedTitle,
                message: processedMessage,
                variant: this.toastVariant,
                mode: this.toastMode
            });
            
            // Exibir toast
            this.showToast(processedTitle, processedMessage, this.toastVariant, this.toastMode);
            
            // Atualizar a view se configurado
            if (this.forceRefreshView) {
                this.scheduleRefresh();
            }
            
        } catch (error) {
            this.logDebug('Erro ao processar toast:', error);
        }
    }
    
    /**
     * Processa campos de mesclagem em strings
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
        
        // Substituir todos os tokens
        Object.keys(mergeData).forEach(key => {
            const token = `{${key}}`;
            const value = mergeData[key];
            result = result.replace(new RegExp(token, 'g'), value);
        });
        
        this.logDebug('Campos de mesclagem processados:', { template, result, mergeData });
        return result;
    }
    
    /**
     * Formata valores para exibição
     */
    formatValue(value) {
        if (value === null || value === undefined || value === '') {
            return 'vazio';
        }
        return String(value);
    }
    
    /**
     * Detecta se o texto contém campos de mesclagem conhecidos
     */
    hasMergeFields(text) {
        if (!text || typeof text !== 'string') return false;
        const knownFields = ['oldValue', 'newValue', 'recordId', 'objectName'];
        return knownFields.some(field => text.includes(`{${field}}`));
    }
    
    /**
     * Exibe o toast com todas as propriedades configuradas
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
     * Agenda atualização da view com delay
     */
    scheduleRefresh() {
        if (this.refreshDelayMs > 0) {
            this.logDebug(`Agendando atualização em ${this.refreshDelayMs}ms`);
            setTimeout(() => {
                this.logDebug('Executando atualização da view');
                this.dispatchEvent(new RefreshEvent());
            }, this.refreshDelayMs);
        } else {
            this.logDebug('Executando atualização imediata da view');
            this.dispatchEvent(new RefreshEvent());
        }
    }
    
    /**
     * Log debug condicional
     */
    logDebug(...args) {
        if (this.debugMode) {
            console.log('[ShowToastFromTrigger]', ...args);
        }
    }
 
    connectedCallback() {
        this.logDebug('Componente conectado para recordId:', this.recordId, 'Objeto:', this.objectApiName, 'Campo:', this.fieldMonitoringApiName);
        this.initializeCdcSubscription();
    }
 
    disconnectedCallback() {
        this.logDebug('Componente desconectado para recordId:', this.recordId, 'limpando assinatura');
        if (this.subscription) {
            try {
                unsubscribe(this.subscription, () => {});
                this.logDebug('Assinatura CDC cancelada com sucesso');
            } catch (e) {
                this.logDebug('Erro ao cancelar assinatura:', e);
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
            this.logDebug('CDC não inicializado - canal:', channel, 'recordId:', this.recordId);
            return;
        }

        this.logDebug('Inicializando assinatura CDC para canal:', channel, 'recordId:', this.recordId);

        onError((error) => {
            this.logDebug('Erro do empApi:', error);
        });

        const replayId = -1; // somente eventos novos
        subscribe(channel, replayId, (message) => this.handleCdcMessage(message))
            .then((response) => {
                this.subscription = response;
                this.logDebug('Assinatura CDC criada com sucesso para recordId:', this.recordId);
            })
            .catch((err) => {
                this.logDebug('Falha ao assinar CDC:', err);
            });
    }

    handleCdcMessage(message) {
        try {
            this.logDebug('Mensagem CDC recebida:', message);
            
            //garantir que this.recordId está definido
            if (!this.recordId) {
                this.logDebug('recordId não definido, ignorando evento CDC');
                return;
            }
            
            const recordIds = message?.data?.payload?.ChangeEventHeader?.recordIds || [];
            this.logDebug('RecordIds do evento CDC:', recordIds, 'RecordId atual da página:', this.recordId);
            
            //verificar se o recordId da página está na lista de recordIds afetados
            if (Array.isArray(recordIds) && recordIds.includes(this.recordId)) {
                this.logDebug('Mudança detectada para recordId da página atual:', this.recordId);
                
                if (this._wiredRecord) {
                    this.logDebug('Atualizando adaptador wire via refreshApex');
                    refreshApex(this._wiredRecord);
                } else {
                    this.logDebug('Adaptador wire não disponível para atualização');
                }
            } else {
                this.logDebug('Evento CDC não é para o recordId da página atual. Ignorando.');
            }
        } catch (e) {
            this.logDebug('Erro ao processar mensagem CDC:', e);
        }
    }
}