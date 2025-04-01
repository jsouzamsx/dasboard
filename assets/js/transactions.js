// Gerenciamento de transações
const Transactions = {
    data: [],
    categories: {
        'Entrada': ['Cartão', 'Diversos', 'Valores'],
        'Saída': ['Sistema', 'Saída']
    },
    currentPage: 1,
    itemsPerPage: 5,
    filter: 'all',
    searchTerm: '',
    
    init: function() {
        // Carregar transações do armazenamento local
        this.data = Storage.getTransactions();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Renderizar tabela de transações
        this.renderTransactionsTable();
        
        // Atualizar resumo financeiro
        this.updateFinancialSummary();
    },
    
    setupEventListeners: function() {
        // Botões para adicionar transações
        document.getElementById('add-income').addEventListener('click', () => this.openTransactionModal('Entrada'));
        document.getElementById('add-expense').addEventListener('click', () => this.openTransactionModal('Saída'));
        
        // Formulário de transação
        document.getElementById('transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });
        
        // Filtro e busca
        document.getElementById('transaction-filter').addEventListener('change', (e) => {
            this.filter = e.target.value;
            this.currentPage = 1;
            this.renderTransactionsTable();
        });
        
        document.getElementById('transaction-search').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.renderTransactionsTable();
        });
        
        // Paginação
        document.getElementById('prev-page').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTransactionsTable();
            }
        });
        
        document.getElementById('next-page').addEventListener('click', () => {
            const totalPages = Math.ceil(this.getFilteredTransactions().length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTransactionsTable();
            }
        });
    },
    
    openTransactionModal: function(type, transaction = null) {
        const modal = document.getElementById('transaction-modal');
        const title = document.getElementById('transaction-modal-title');
        const form = document.getElementById('transaction-form');
        const typeInput = document.getElementById('transaction-type');
        const idInput = document.getElementById('transaction-id');
        const dateInput = document.getElementById('transaction-date');
        const descriptionInput = document.getElementById('transaction-description');
        const amountInput = document.getElementById('transaction-amount');
        const categorySelect = document.getElementById('transaction-category');
        const saveButton = document.getElementById('save-transaction');
        
        // Limpar formulário
        form.reset();
        
        // Configurar tipo de transação
        typeInput.value = type;
        title.textContent = transaction ? 'Editar Transação' : `Adicionar ${type}`;
        
        // Preencher categorias
        categorySelect.innerHTML = '';
        this.categories[type].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
        
        // Se for edição, preencher com dados existentes
        if (transaction) {
            idInput.value = transaction.id;
            dateInput.value = this.formatDateForInput(transaction.date);
            descriptionInput.value = transaction.description;
            amountInput.value = transaction.value;
            
            // Selecionar categoria
            for (let i = 0; i < categorySelect.options.length; i++) {
                if (categorySelect.options[i].value === transaction.category) {
                    categorySelect.selectedIndex = i;
                    break;
                }
            }
            
            saveButton.textContent = 'Atualizar';
        } else {
            idInput.value = '';
            dateInput.value = this.formatDateForInput(new Date());
            saveButton.textContent = 'Salvar';
        }
        
        // Mostrar modal
        modal.classList.remove('hidden');
    },
    
    saveTransaction: function() {
        const idInput = document.getElementById('transaction-id');
        const typeInput = document.getElementById('transaction-type');
        const dateInput = document.getElementById('transaction-date');
        const descriptionInput = document.getElementById('transaction-description');
        const amountInput = document.getElementById('transaction-amount');
        const categorySelect = document.getElementById('transaction-category');
        
        const transaction = {
            id: idInput.value || Date.now().toString(),
            type: typeInput.value,
            date: new Date(dateInput.value).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            description: descriptionInput.value,
            value: parseFloat(amountInput.value),
            category: categorySelect.value
        };
        
        // Verificar se é uma edição ou nova transação
        if (idInput.value) {
            // Edição - atualizar transação existente
            const index = this.data.findIndex(t => t.id === idInput.value);
            if (index !== -1) {
                this.data[index] = transaction;
            }
        } else {
            // Nova transação
            this.data.push(transaction);
        }
        
        // Salvar no armazenamento local
        Storage.saveTransactions(this.data);
        
        // Atualizar interface
        this.renderTransactionsTable();
        this.updateFinancialSummary();
        
        // Atualizar gráficos
        if (typeof Charts !== 'undefined') {
            Charts.updateCharts();
        }
        
        // Fechar modal
        document.getElementById('transaction-modal').classList.add('hidden');
    },
    
    deleteTransaction: function(id) {
        if (confirm('Tem certeza que deseja excluir esta transação?')) {
            this.data = this.data.filter(transaction => transaction.id !== id);
            
            // Salvar no armazenamento local
            Storage.saveTransactions(this.data);
            
            // Atualizar interface
            this.renderTransactionsTable();
            this.updateFinancialSummary();
            
            // Atualizar gráficos
            if (typeof Charts !== 'undefined') {
                Charts.updateCharts();
            }
        }
    },
    
    getFilteredTransactions: function() {
        return this.data.filter(transaction => {
            // Filtrar por tipo
            if (this.filter !== 'all' && transaction.type !== this.filter) {
                return false;
            }
            
            // Filtrar por termo de busca
            if (this.searchTerm) {
                const searchFields = [
                    transaction.description.toLowerCase(),
                    transaction.category.toLowerCase(),
                    transaction.date.toLowerCase()
                ];
                
                return searchFields.some(field => field.includes(this.searchTerm));
            }
            
            return true;
        });
    },
    
    renderTransactionsTable: function() {
        const tableBody = document.getElementById('transactions-table');
        const filteredTransactions = this.getFilteredTransactions();
        
        // Calcular paginação
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
        
        // Atualizar informações de paginação
        document.getElementById('showing-transactions').textContent = paginatedTransactions.length;
        document.getElementById('total-transactions').textContent = filteredTransactions.length;
        
        // Habilitar/desabilitar botões de paginação
        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = endIndex >= filteredTransactions.length;
        
        // Limpar tabela
        tableBody.innerHTML = '';
        
        // Verificar se há transações
        if (paginatedTransactions.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="6" class="px-4 py-4 text-center text-gray-500">
                    Nenhuma transação encontrada
                </td>
            `;
            tableBody.appendChild(row);
            return;
        }
        
        // Renderizar transações
        paginatedTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.className = 'border-b';
            
            row.innerHTML = `
                <td class="px-4 py-2">${transaction.date}</td>
                <td class="px-4 py-2">
                    <span class="inline-block px-2 py-1 text-xs rounded-full ${transaction.type === 'Entrada' ? 'badge-entrada' : 'badge-saida'}">
                        ${transaction.type}
                    </span>
                </td>
                <td class="px-4 py-2">${transaction.description}</td>
                <td class="px-4 py-2 text-right font-medium ${transaction.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}">
                    R$ ${transaction.value.toFixed(2)}
                </td>
                <td class="px-4 py-2 text-right">${transaction.category}</td>
                <td class="px-4 py-2 text-right">
                    <button class="text-blue-500 hover:text-blue-700 mr-2 edit-transaction" data-id="${transaction.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button class="text-red-500 hover:text-red-700 delete-transaction" data-id="${transaction.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Adicionar eventos aos botões de edição e exclusão
        document.querySelectorAll('.edit-transaction').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const transaction = this.data.find(t => t.id === id);
                if (transaction) {
                    this.openTransactionModal(transaction.type, transaction);
                }
            });
        });
        
        document.querySelectorAll('.delete-transaction').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                this.deleteTransaction(id);
            });
        });
    },
    
    updateFinancialSummary: function() {
        const totalIncome = this.data
            .filter(transaction => transaction.type === 'Entrada')
            .reduce((sum, transaction) => sum + transaction.value, 0);
            
        const totalExpense = this.data
            .filter(transaction => transaction.type === 'Saída')
            .reduce((sum, transaction) => sum + transaction.value, 0);
            
        const balance = totalIncome - totalExpense;
        
        // Atualizar elementos na interface
        document.getElementById('total-income').textContent = `R$ ${totalIncome.toFixed(2)}`;
        document.getElementById('total-expense').textContent = `R$ ${totalExpense.toFixed(2)}`;
        document.getElementById('final-balance').textContent = `R$ ${balance.toFixed(2)}`;
        
        // Atualizar status do saldo
        Dashboard.updateFinancialOverview(totalIncome, totalExpense, balance);
    },
    
    formatDateForInput: function(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
};