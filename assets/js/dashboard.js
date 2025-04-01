// dashboard.js - Funções principais do dashboard

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar componentes
  initializeDateTimeDisplay();
  initializeQuickActions();
  loadFinancialSummary();
  loadPayrollSummary();
  loadTransactionsTable();
  loadUpcomingBills();
  
  // Configurar event listeners
  document.getElementById('btn-new-transaction').addEventListener('click', showNewTransactionModal);
  document.getElementById('btn-quick-actions').addEventListener('click', toggleQuickActionsMenu);
  
  // Fechar modais quando clicar fora
  document.getElementById('modal-container').addEventListener('click', function(e) {
    if (e.target === this) {
      closeAllModals();
    }
  });
});

// Atualizar data e hora
function initializeDateTimeDisplay() {
  const dateTimeElement = document.getElementById('date-time-display');
  
  function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    const dateStr = now.toLocaleDateString('pt-BR', dateOptions);
    const timeStr = now.toLocaleTimeString('pt-BR', timeOptions);
    
    dateTimeElement.innerHTML = `
      <div class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-500">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
          <line x1="16" x2="16" y1="2" y2="6"></line>
          <line x1="8" x2="8" y1="2" y2="6"></line>
          <line x1="3" x2="21" y1="10" y2="10"></line>
        </svg>
        <span>${dateStr}</span>
      </div>
      <div class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-500">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span>${timeStr}</span>
      </div>
    `;
  }
  
  updateDateTime();
  setInterval(updateDateTime, 1000);
}

// Menu de ações rápidas
function initializeQuickActions() {
  const quickActionsMenu = document.getElementById('quick-actions-menu');
  
  quickActionsMenu.innerHTML = `
    <div class="py-1">
      <div class="px-4 py-2 text-sm font-medium text-gray-700">Ações Financeiras</div>
      <div class="h-px bg-gray-200 my-1"></div>
      <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="generateReport()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" x2="8" y1="13" y2="13"></line>
          <line x1="16" x2="8" y1="17" y2="17"></line>
          <line x1="10" x2="8" y1="9" y2="9"></line>
        </svg>
        Gerar Relatório
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="exportData()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" x2="12" y1="15" y2="3"></line>
        </svg>
        Exportar Dados
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="importTransactions()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" x2="12" y1="3" y2="15"></line>
        </svg>
        Importar Transações
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="showFinancialAnalysis()">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2">
          <path d="M3 3v18h18"></path>
          <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          <path d="M8 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          <path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
        </svg>
        Análise Financeira
      </a>
    </div>
  `;
}

function toggleQuickActionsMenu() {
  const menu = document.getElementById('quick-actions-menu');
  menu.classList.toggle('hidden');
}

function closeAllModals() {
  document.getElementById('modal-container').classList.add('hidden');
}

// Carregar resumo financeiro
function loadFinancialSummary() {
  // Em produção, isso buscaria dados de uma API
  fetch('api/financial-summary.php')
    .then(response => response.json())
    .catch(() => {
      // Dados de exemplo para demonstração
      return {
        income: 1951.0,
        expense: 1901.0,
        balance: 50.0,
        sistema: 0,
        cartao: 0,
        diversos: 0,
        valores: 50.0
      };
    })
    .then(data => {
      renderFinancialSummary(data);
    });
}

function renderFinancialSummary(data) {
  const container = document.getElementById('financial-summary');
  
  container.innerHTML = `
    <div class="p-4">
      <div class="flex justify-between items-center mb-2">
        <div>
          <h2 class="text-lg font-semibold">Resumo Financeiro</h2>
          <p class="text-sm text-gray-500">Março 2025</p>
        </div>
        <div class="flex gap-2">
          <button class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20" onclick="addIncome()">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8"></path>
              <path d="M8 12h8"></path>
            </svg>
            Entrada
          </button>
          <button class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20" onclick="addExpense()">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12h8"></path>
            </svg>
            Saída
          </button>
          <button class="rounded-full p-1 text-gray-500 hover:bg-gray-100" onclick="editFinancialSummary()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              <path d="m15 5 4 4"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div class="flex flex-col space-y-1">
          <span class="text-sm text-gray-500">Entrada</span>
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-green-500">
              <path d="m5 12 7-7 7 7"></path>
              <path d="M12 19V5"></path>
            </svg>
            <span class="text-xl font-bold">R$ ${data.income.toFixed(2)}</span>
          </div>
        </div>
        <div class="flex flex-col space-y-1">
          <span class="text-sm text-gray-500">Saída</span>
          <div class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-red-500">
              <path d="m19 12-7 7-7-7"></path>
              <path d="M12 5v14"></path>
            </svg>
            <span class="text-xl font-bold">R$ ${data.expense.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg bg-gray-100 p-2 mb-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Saldo Final</p>
            <p class="text-lg font-bold">R$ ${data.balance.toFixed(2)}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">
              ${data.balance >= 0 ? "Saldo Positivo" : "Saldo Negativo"}
            </p>
            <p class="text-base font-semibold ${data.balance >= 0 ? "text-green-500" : "text-red-500"}">
              R$ ${Math.abs(data.balance).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col space-y-1">
          <span class="text-sm text-gray-500">Sistema</span>
          <span class="text-base font-semibold">
            ${data.sistema > 0 ? `R$ ${data.sistema.toFixed(2)}` : "R$ -"}
          </span>
        </div>
        <div class="flex flex-col space-y-1">
          <span class="text-sm text-gray-500">Cartão</span>
          <span class="text-base font-semibold">
            ${data.cartao > 0 ? `R$ ${data.cartao.toFixed(2)}` : "R$ -"}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-3">
        <div class="flex flex-col space-y-1">
          <span class="text-sm text-gray-500">Diversos</span>
          <span class="text-base font-semibold">
            ${data.diversos > 0 ? `R$ ${data.diversos.toFixed(2)}` : "R$ -"}
          </span>
        </div>
        <div class="flex flex-col space-y-1">
          <span class="text-sm text-gray-500">Valores</span>
          <span class="text-base font-semibold">
            ${data.valores > 0 ? `R$ ${data.valores.toFixed(2)}` : "R$ -"}
          </span>
        </div>
      </div>
    </div>
  `;
}

// Funções para modais e ações
function showNewTransactionModal() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.classList.remove('hidden');
  
  const modalContent = modalContainer.querySelector('div');
  modalContent.innerHTML = `
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Nova Transação</h3>
        <button onclick="closeAllModals()" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
      
      <form id="new-transaction-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input type="radio" name="type" value="Entrada" checked class="h-4 w-4 text-blue-600 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">Entrada</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="type" value="Saída" class="h-4 w-4 text-blue-600 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">Saída</span>
            </label>
          </div>
        </div>
        
        <div>
          <label for="transaction-date" class="block text-sm font-medium text-gray-700 mb-1">Data</label>
          <input type="date" id="transaction-date" name="date" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" value="${new Date().toISOString().split('T')[0]}">
        </div>
        
        <div>
          <label for="transaction-description" class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <input type="text" id="transaction-description" name="description" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Ex: Salário, Aluguel, etc.">
        </div>
        
        <div>
          <label for="transaction-amount" class="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
          <input type="number" id="transaction-amount" name="amount" step="0.01" min="0" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="0,00">
        </div>
        
        <div>
          <label for="transaction-category" class="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select id="transaction-category" name="category" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
            <option value="">Selecione uma categoria</option>
            <option value="Sistema">Sistema</option>
            <option value="Cartão">Cartão</option>
            <option value="Diversos">Diversos</option>
            <option value="Valores">Valores</option>
            <option value="Saída">Saída</option>
          </select>
        </div>
        
        <div class="flex justify-end gap-2 pt-4">
          <button type="button" onclick="closeAllModals()" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            Salvar
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.getElementById('new-transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveNewTransaction(this);
  });
}

function saveNewTransaction(form) {
  // Em produção, isso enviaria dados para uma API
  const formData = new FormData(form);
  const transaction = {
    type: formData.get('type'),
    date: formData.get('date'),
    description: formData.get('description'),
    amount: parseFloat(formData.get('amount')),
    category: formData.get('category')
  };
  
  console.log('Nova transação:', transaction);
  
  // Simular salvamento bem-sucedido
  alert('Transação salva com sucesso!');
  closeAllModals();
  
  // Recarregar dados
  loadFinancialSummary();
  loadTransactionsTable();
}