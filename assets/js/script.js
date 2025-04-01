// Dashboard Financeiro - Script Principal
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initApp();
});

// Variáveis globais
let transactions = [];
let payrollData = {
    items: [],
    va: { days: 0, dailyValue: 0, total: 0 }
};
let currentPage = 1;
let pageSize = 10;
let activeFilters = {};

// Categorias disponíveis
const categories = {
    'Entrada': ['Cartão', 'Diversos', 'Valores'],
    'Saída': ['Sistema', 'Saída']
};

// Inicialização da aplicação
function initApp() {
    // Carregar dados do localStorage
    loadData();
    
    // Atualizar data e hora
    updateDateTime();
    
    // Configurar eventos
    setupEventListeners();
    
    // Renderizar transações
    renderTransactions();
    
    // Atualizar resumo financeiro
    updateFinancialSummary();
    
    // Renderizar itens do holerite
    renderPayrollItems();
    
    // Atualizar resumo do holerite
    updatePayrollSummary();
}

// Carregar dados do localStorage
function loadData() {
    // Carregar transações
    const storedTransactions = localStorage.getItem('financial_dashboard_transactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
    
    // Carregar dados do holerite
    const storedPayroll = localStorage.getItem('financial_dashboard_payroll');
    if (storedPayroll) {
        payrollData = JSON.parse(storedPayroll);
    }
    
    // Carregar tamanho da página
    const storedPageSize = localStorage.getItem('financial_dashboard_page_size');
    if (storedPageSize) {
        pageSize = parseInt(storedPageSize);
        document.getElementById('page-size').value = pageSize;
    }
}

// Atualizar data e hora
function updateDateTime() {
    const dateTimeElement = document.getElementById('current-date-time');
    
    function update() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTimeElement.textContent = now.toLocaleDateString('pt-BR', options);
    }
    
    update();
    setInterval(update, 60000); // Atualizar a cada minuto
}

// Configurar eventos
function setupEventListeners() {
    // Botões para adicionar transações
    document.getElementById('add-income-btn').addEventListener('click', () => openTransactionModal('Entrada'));
    document.getElementById('add-expense-btn').addEventListener('click', () => openTransactionModal('Saída'));
    
    // Botão para salvar transação
    document.getElementById('save-transaction-btn').addEventListener('click', saveTransaction);
    
    // Botão para importar holerite
    document.getElementById('import-payroll-btn').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('payroll-modal'));
        modal.show();
    });
    
    // Botão para submeter importação de holerite
    document.getElementById('import-payroll-submit').addEventListener('click', importPayroll);
    
    // Filtros
    document.getElementById('search-input').addEventListener('input', applyFilters);
    document.getElementById('type-filter').addEventListener('change', applyFilters);
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('date-from').addEventListener('change', applyFilters);
    document.getElementById('date-to').addEventListener('change', applyFilters);
    document.getElementById('clear-filters-btn').addEventListener('click', clearFilters);
    
    // Paginação
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTransactions();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        const filteredTransactions = getFilteredTransactions();
        const totalPages = Math.ceil(filteredTransactions.length / pageSize);
        
        if (currentPage < totalPages) {
            currentPage++;
            renderTransactions();
        }
    });
    
    // Tamanho da página
    document.getElementById('page-size').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value);
        localStorage.setItem('financial_dashboard_page_size', pageSize);
        currentPage = 1;
        renderTransactions();
    });
    
    // Exportar dados
    document.getElementById('export-btn').addEventListener('click', exportData);
    
    // Importar dados
    document.getElementById('import-btn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        importData(data);
                    } catch (error) {
                        alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
                        console.error('Erro ao importar dados:', error);
                    }
                };
                reader.readAsText(file);
            }
        });
        
        input.click();
    });
}

// Abrir modal de transação
function openTransactionModal(type, transaction = null) {
    const modal = new bootstrap.Modal(document.getElementById('transaction-modal'));
    const title = document.getElementById('transaction-modal-title');
    const form = document.getElementById('transaction-form');
    const typeInput = document.getElementById('transaction-type');
    const idInput = document.getElementById('transaction-id');
    const dateInput = document.getElementById('transaction-date');
    const descriptionInput = document.getElementById('transaction-description');
    const amountInput = document.getElementById('transaction-amount');
    const categorySelect = document.getElementById('transaction-category');
    
    // Limpar formulário
    form.reset();
    
    // Configurar tipo de transação
    typeInput.value = type;
    title.textContent = transaction ? 'Editar Transação' : `Adicionar ${type}`;
    
    // Preencher categorias
    categorySelect.innerHTML = '';
    categories[type].forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    
    // Se for edição, preencher com dados existentes
    if (transaction) {
        idInput.value = transaction.id;
        dateInput.value = formatDateForInput(transaction.date);
        descriptionInput.value = transaction.description;
        amountInput.value = transaction.value;
        
        // Selecionar categoria
        for (let i = 0; i < categorySelect.options.length; i++) {
            if (categorySelect.options[i].value === transaction.category) {
                categorySelect.selectedIndex = i;
                break;
            }
        }
    } else {
        idInput.value = '';
        dateInput.value = formatDateForInput(new Date());
    }
    
    modal.show();
}

// Salvar transação
function saveTransaction() {
    const form = document.getElementById('transaction-form');
    
    // Validar formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const idInput = document.getElementById('transaction-id');
    const typeInput = document.getElementById('transaction-type');
    const dateInput = document.getElementById('transaction-date');
    const descriptionInput = document.getElementById('transaction-description');
    const amountInput = document.getElementById('transaction-amount');
    const categorySelect = document.getElementById('transaction-category');
    
    const transaction = {
        id: idInput.value || Date.now().toString(),
        type: typeInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
        value: parseFloat(amountInput.value),
        category: categorySelect.value
    };
    
    // Verificar se é uma edição ou nova transação
    if (idInput.value) {
        // Edição - atualizar transação existente
        const index = transactions.findIndex(t => t.id === idInput.value);
        if (index !== -1) {
            transactions[index] = transaction;
        }
    } else {
        // Nova transação
        transactions.push(transaction);
    }
    
    // Salvar no localStorage
    localStorage.setItem('financial_dashboard_transactions', JSON.stringify(transactions));
    
    // Atualizar interface
    renderTransactions();
    updateFinancialSummary();
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('transaction-modal'));
    modal.hide();
}

// Excluir transação
function deleteTransaction(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        transactions = transactions.filter(t => t.id !== id);
        
        // Salvar no localStorage
        localStorage.setItem('financial_dashboard_transactions', JSON.stringify(transactions));
        
        // Atualizar interface
        renderTransactions();
        updateFinancialSummary();
    }
}

// Renderizar transações
function renderTransactions() {
    const tableBody = document.getElementById('transactions-table');
    const filteredTransactions = getFilteredTransactions();
    
    // Calcular paginação
    const totalPages = Math.ceil(filteredTransactions.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredTransactions.length);
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    // Atualizar informações de paginação
    document.getElementById('transaction-count').textContent = `${filteredTransactions.length} transações`;
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${totalPages || 1}`;
    
    // Habilitar/desabilitar botões de paginação
    document.getElementById('prev-page').disabled = currentPage <= 1;
    document.getElementById('next-page').disabled = currentPage >= totalPages;
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    // Verificar se há transações
    if (paginatedTransactions.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="text-center text-muted py-3">Nenhuma transação encontrada</td>
        `;
        tableBody.appendChild(row);
        return;
    }
    
    // Renderizar transações
    paginatedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Formatar data para exibição
        const formattedDate = formatDateForDisplay(transaction.date);
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>
                <span class="badge ${transaction.type === 'Entrada' ? 'badge-entrada' : 'badge-saida'}">
                    ${transaction.type}
                </span>
            </td>
            <td>${transaction.description}</td>
            <td class="text-end ${transaction.type === 'Entrada' ? 'text-success' : 'text-danger'}">
                R$ ${transaction.value.toFixed(2)}
            </td>
            <td class="text-end">${transaction.category}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary edit-btn me-1" data-id="${transaction.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${transaction.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const transaction = transactions.find(t => t.id === id);
            if (transaction) {
                openTransactionModal(transaction.type, transaction);
            }
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            deleteTransaction(id);
        });
    });
}

// Atualizar resumo financeiro
function updateFinancialSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'Entrada')
        .reduce((sum, t) => sum + t.value, 0);
        
    const totalExpense = transactions
        .filter(t => t.type === 'Saída')
        .reduce((sum, t) => sum + t.value, 0);
        
    const balance = totalIncome - totalExpense;
    
    // Atualizar elementos na interface
    document.getElementById('total-income').textContent = `R$ ${totalIncome.toFixed(2)}`;
    document.getElementById('total-expense').textContent = `R$ ${totalExpense.toFixed(2)}`;
    document.getElementById('final-balance').textContent = `R$ ${balance.toFixed(2)}`;
    
    // Atualizar status do saldo
    const balanceStatus = document.getElementById('balance-status');
    const balanceAmount = document.getElementById('balance-amount');
    
    if (balance > 0) {
        balanceStatus.textContent = 'Saldo Positivo';
        balanceAmount.textContent = `R$ ${balance.toFixed(2)}`;
        balanceAmount.className = 'text-success';
    } else if (balance < 0) {
        balanceStatus.textContent = 'Saldo Negativo';
        balanceAmount.textContent = `R$ ${Math.abs(balance).toFixed(2)}`;
        balanceAmount.className = 'text-danger';
    } else {
        balanceStatus.textContent = 'Saldo Neutro';
        balanceAmount.textContent = `R$ 0,00`;
        balanceAmount.className = 'text-muted';
    }
}

// Importar holerite
function importPayroll() {
    const payrollText = document.getElementById('payroll-text').value;
    
    if (!payrollText.trim()) {
        alert('Por favor, insira os dados do holerite.');
        return;
    }
    
    try {
        // Processar texto do holerite
        const lines = payrollText.split('\n').filter(line => line.trim());
        const newItems = [];
        let vaInfo = { days: 0, dailyValue: 0, total: 0 };
        
        // Processar linhas
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Pular linhas de cabeçalho
            if (line.includes('Código') || line.includes('TOTAL HOLERITE')) continue;
            
            // Verificar informações de VA
            if (line.includes('Va') && line.includes('Dias')) {
                const vaParts = line.split(/\s+/);
                const days = parseInt(vaParts[2]);
                const dailyValue = parseFloat(vaParts[4].replace(',', '.'));
                const total = parseFloat(vaParts[7].replace(',', '.'));
                
                if (!isNaN(days) && !isNaN(dailyValue) && !isNaN(total)) {
                    vaInfo = { days, dailyValue, total };
                }
                continue;
            }
            
            // Processar itens do holerite
            const parts = line.split(/\t+|\s{2,}/).filter(part => part.trim());
            if (parts.length >= 5) {
                const code = parseInt(parts[0]);
                const description = parts[1];
                const reference = parts[2];
                const isIncome = parts[3] && parts[3].trim() !== '';
                const amount = parseFloat((isIncome ? parts[3] : parts[4]).replace('.', '').replace(',', '.'));
                
                if (!isNaN(code) && !isNaN(amount)) {
                    newItems.push({
                        code,
                        description,
                        reference,
                        amount,
                        type: isIncome ? 'Entrada' : 'Saída'
                    });
                }
            }
        }
        
        // Atualizar dados
        if (newItems.length > 0) {
            payrollData.items = newItems;
            payrollData.va = vaInfo;
            
            // Salvar no localStorage
            localStorage.setItem('financial_dashboard_payroll', JSON.stringify(payrollData));
            
            // Atualizar interface
            renderPayrollItems();
            updatePayrollSummary();
            
            // Fechar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('payroll-modal'));
            modal.hide();
            
            alert('Holerite importado com sucesso!');
        } else {
            alert('Não foi possível identificar itens no holerite. Verifique o formato e tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao processar holerite:', error);
        alert('Erro ao processar o holerite. Verifique o formato e tente novamente.');
    }
}

// Renderizar itens do holerite
function renderPayrollItems() {
    const container = document.getElementById('payroll-items');
    
    // Limpar container
    container.innerHTML = '';
    
    // Verificar se há itens
    if (payrollData.items.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Nenhum item de holerite adicionado</p>';
        return;
    }
    
    // Renderizar itens
    payrollData.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'd-flex justify-content-between align-items-center p-2 border-bottom';
        
        itemElement.innerHTML = `
            <div>
                <span class="fw-medium">${item.description}</span>
                <span class="text-muted ms-1 small">(${item.reference})</span>
            </div>
            <span class="${item.type === 'Entrada' ? 'text-success' : 'text-danger'}">
                ${item.type === 'Entrada' ? '+' : '-'}R$ ${item.amount.toFixed(2)}
            </span>
        `;
        
        container.appendChild(itemElement);
    });
    
    // Adicionar informações de VA se disponíveis
    if (payrollData.va.total > 0) {
        const vaElement = document.createElement('div');
        vaElement.className = 'mt-2 p-2 bg-light rounded';
        
        vaElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="fw-medium">VA</span>
                    <span class="text-muted ms-1 small">
                        (${payrollData.va.days} dias x R$ ${payrollData.va.dailyValue.toFixed(2)})
                    </span>
                </div>
                <span class="text-success">R$ ${payrollData.va.total.toFixed(2)}</span>
            </div>
        `;
        
        container.appendChild(vaElement);
    }
}

// Atualizar resumo do holerite
function updatePayrollSummary() {
    const totalIncome = payrollData.items
        .filter(item => item.type === 'Entrada')
        .reduce((sum, item) => sum + item.amount, 0);
        
    const totalDeduction = payrollData.items
        .filter(item => item.type === 'Saída')
        .reduce((sum, item) => sum + item.amount, 0);
        
    const netPayment = totalIncome - totalDeduction + payrollData.va.total;
    
    // Atualizar elementos na interface
    document.getElementById('payroll-income').textContent = `R$ ${totalIncome.toFixed(2)}`;
    document.getElementById('payroll-deduction').textContent = `R$ ${totalDeduction.toFixed(2)}`;
    document.getElementById('payroll-net').textContent = `R$ ${netPayment.toFixed(2)}`;
}

// Aplicar filtros
function applyFilters() {
    // Coletar valores dos filtros
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    const categoryFilter = document.getElementById('category-filter').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;
    
    // Atualizar filtros ativos
    activeFilters = {};
    
    if (searchTerm) activeFilters.search = searchTerm;
    if (typeFilter !== 'all') activeFilters.type = typeFilter;
    if (categoryFilter !== 'all') activeFilters.category = categoryFilter;
    if (dateFrom) activeFilters.dateFrom = dateFrom;
    if (dateTo) activeFilters.dateTo = dateTo;
    
    // Renderizar badges de filtros ativos
    renderFilterBadges();
    
    // Resetar para a primeira página
    currentPage = 1;
    
    // Renderizar transações filtradas
    renderTransactions();
}

// Limpar filtros
function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('type-filter').value = 'all';
    document.getElementById('category-filter').value = 'all';
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value = '';
    
    activeFilters = {};
    renderFilterBadges();
    
    currentPage = 1;
    renderTransactions();
}

// Renderizar badges de filtros ativos
function renderFilterBadges() {
    const container = document.getElementById('filter-badges');
    const activeFiltersContainer = document.getElementById('active-filters');
    
    // Limpar container
    container.innerHTML = '';
    
    // Verificar se há filtros ativos
    const hasActiveFilters = Object.keys(activeFilters).length > 0;
    activeFiltersContainer.classList.toggle('d-none', !hasActiveFilters);
    
    if (!hasActiveFilters) return;
    
    // Renderizar badges para cada filtro ativo
    for (const [key, value] of Object.entries(activeFilters)) {
        const badge = document.createElement('div');
        badge.className = 'filter-badge';
        
        let label = '';
        switch (key) {
            case 'search':
                label = `Busca: ${value}`;
                break;
            case 'type':
                label = `Tipo: ${value}`;
                break;
            case 'category':
                label = `Categoria: ${value}`;
                break;
            case 'dateFrom':
                label = `A partir de: ${formatDateForDisplay(value)}`;
                break;
            case 'dateTo':
                label = `Até: ${formatDateForDisplay(value)}`;
                break;
        }
        
        badge.innerHTML = `
            ${label}
            <span class="close-btn" data-filter="${key}">&times;</span>
        `;
        
        container.appendChild(badge);
    }
    
    // Adicionar eventos para remover filtros
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', () => {
            const filterKey = button.getAttribute('data-filter');
            
            // Resetar o campo de filtro correspondente
            switch (filterKey) {
                case 'search':
                    document.getElementById('search-input').value = '';
                    break;
                case 'type':
                    document.getElementById('type-filter').value = 'all';
                    break;
                case 'category':
                    document.getElementById('category-filter').value = 'all';
                    break;
                case 'dateFrom':
                    document.getElementById('date-from').value = '';
                    break;
                case 'dateTo':
                    document.getElementById('date-to').value = '';
                    break;
            }
            
            // Remover filtro
            delete activeFilters[filterKey];
            
            // Atualizar interface
            renderFilterBadges();
            currentPage = 1;
            renderTransactions();
        });
    });
}

// Obter transações filtradas
function getFilteredTransactions() {
    return transactions.filter(transaction => {
        // Filtrar por termo de busca
        if (activeFilters.search) {
            const searchFields = [
                transaction.description.toLowerCase(),
                transaction.category.toLowerCase(),
                formatDateForDisplay(transaction.date).toLowerCase()
            ];
            
            if (!searchFields.some(field => field.includes(activeFilters.search))) {
                return false;
            }
        }
        
        // Filtrar por tipo
        if (activeFilters.type && transaction.type !== activeFilters.type) {
            return false;
        }
        
        // Filtrar por categoria
        if (activeFilters.category && transaction.category !== activeFilters.category) {
            return false;
        }
        
        // Filtrar por data inicial
        if (activeFilters.dateFrom && transaction.date < activeFilters.dateFrom) {
            return false;
        }
        
        // Filtrar por data final
        if (activeFilters.dateTo && transaction.date > activeFilters.dateTo) {
            return false;
        }
        
        return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por data (mais recente primeiro)
}

// Exportar dados
function exportData() {
    const data = {
        transactions: transactions,
        payroll: payrollData
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'financial_dashboard_backup_' + new Date().toISOString().slice(0, 10) + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Importar dados
function importData(data) {
    if (confirm('Importar dados substituirá todos os dados existentes. Deseja continuar?')) {
        if (data.transactions) {
            transactions = data.transactions;
            localStorage.setItem('financial_dashboard_transactions', JSON.stringify(transactions));
        }
        
        if (data.payroll) {
            payrollData = data.payroll;
            localStorage.setItem('financial_dashboard_payroll', JSON.stringify(payrollData));
        }
        
        // Atualizar interface
        renderTransactions();
        updateFinancialSummary();
        renderPayrollItems();
        updatePayrollSummary();
        
        alert('Dados importados com sucesso!');
    }
}

// Formatar data para input
function formatDateForInput(date) {
    if (typeof date === 'string') {
        // Se já estiver no formato YYYY-MM-DD, retornar como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }
        
        // Converter string para objeto Date
        date = new Date(date);
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Formatar data para exibição
function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}