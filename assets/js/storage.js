// Sistema de armazenamento local
const Storage = {
    // Chaves para armazenamento
    KEYS: {
        TRANSACTIONS: 'financial_dashboard_transactions',
        PAYROLL: 'financial_dashboard_payroll',
        GOALS: 'financial_dashboard_goals',
        SETTINGS: 'financial_dashboard_settings'
    },
    
    // Salvar dados
    save: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    
    // Carregar dados
    get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    
    // Carregar transações
    getTransactions: function() {
        return this.get(this.KEYS.TRANSACTIONS) || [];
    },
    
    // Salvar transações
    saveTransactions: function(transactions) {
        this.save(this.KEYS.TRANSACTIONS, transactions);
    },
    
    // Carregar dados de holerite
    getPayroll: function() {
        return this.get(this.KEYS.PAYROLL) || {
            items: [],
            va: { days: 0, dailyValue: 0, total: 0 }
        };
    },
    
    // Salvar dados de holerite
    savePayroll: function(payroll) {
        this.save(this.KEYS.PAYROLL, payroll);
    },
    
    // Carregar metas financeiras
    getGoals: function() {
        return this.get(this.KEYS.GOALS) || [];
    },
    
    // Salvar metas financeiras
    saveGoals: function(goals) {
        this.save(this.KEYS.GOALS, goals  || [];
    },
    
    // Salvar metas financeiras
    saveGoals: function(goals) {
        this.save(this.KEYS.GOALS, goals);
    },
    
    // Exportar todos os dados
    exportData: function() {
        return {
            transactions: this.getTransactions(),
            payroll: this.getPayroll(),
            goals: this.getGoals(),
            settings: this.get(this.KEYS.SETTINGS) || {}
        };
    },
    
    // Importar todos os dados
    importData: function(data) {
        if (data.transactions) this.saveTransactions(data.transactions);
        if (data.payroll) this.savePayroll(data.payroll);
        if (data.goals) this.saveGoals(data.goals);
        if (data.settings) this.save(this.KEYS.SETTINGS, data.settings);
    }
};