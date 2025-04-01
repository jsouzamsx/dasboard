// transactions.js - Funções para gerenciamento de transações

function loadTransactionsTable() {
    // Em produção, isso buscaria dados de uma API
    fetch('api/transactions.php')
      .then(response => response.json())
      .catch(() => {
        // Dados de exemplo para demonstração
        return {
          transactions: [
            {
              date: "quinta-feira, março 20, 2025",
              type: "Saída",
              description: "Aluguel",
              value: 1000.0,
              category: "Sistema",
            },
            {
              date: "quinta-feira, março 20, 2025",
              type: "Saída",
              description: "Gás",
              value: 100.0,
              category: "Saída",
            },
            {
              date: "quinta-feira, março 20, 2025",
              type: "Saída",
              description: "mistura",
              value: 170.0,
              category: "Sistema",
            },
            {
              date: "quinta-feira, março 20, 2025",
              type: "Entrada",
              description: "vale",
              value: 1000.0,
              category: "Cartão",
            },
            {
              date: "sexta-feira, março 21, 2025",
              type: "Entrada",
              description: "emprestimo",
              value: 243.0,
              category: "Diversos",
            }
          ]
        };
      })
      .then(data => {
        renderTransactionsTable(data.transactions);
      });
  }
  
  function renderTransactionsTable(transactions) {
    const container = document.getElementById('transactions-table');
    
    // Calcular totais
    const totalIncome = transactions
      .filter(t => t.type === "Entrada")
      .reduce((sum, t) => sum + t.value, 0);
      
    const totalExpense = transactions
      .filter(t => t.type === "Saída")
      .reduce((sum, t) => sum + t.value, 0);
    
    container.innerHTML = `
      <div class="p-4 border-b">
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input type="text" id="search-transactions" placeholder="Buscar transações..." class="w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 text-sm">
          </div>
  
          <div class="flex flex-wrap gap-2">
            <select id="filter-type" class="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">Tipo</option>
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
  
            <select id="filter-category" class="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">Categoria</option>
              <option value="Sistema">Sistema</option>
              <option value="Cartão">Cartão</option>
              <option value="Diversos">Diversos</option>
              <option value="Valores">Valores</option>
              <option value="Saída">Saída</option>
            </select>
  
            <button id="btn-more-filters" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"></path>
              </svg>
              Mais Filtros
            </button>
          </div>
        </div>
      </div>
  
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${transactions.map((transaction, index) => `
              <tr class="${index % 2 === 0 ? 'bg-gray-50' : ''}">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${transaction.date}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    transaction.type === 'Entrada' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }">
                    ${transaction.type}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${transaction.description}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">R$ ${transaction.value.toFixed(2)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">${transaction.category}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-sm">Itens por página:</span>
            <select id="items-per-page" class="h-8 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          
          <div class="text-sm text-gray-500">
            Página 1 de 1
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-600 font-medium">Entradas: R$ ${totalIncome.toFixed(2)}</span>
            <span class="text-gray-300">|</span>
            <span class="text-red-600 font-medium">Saídas: R$ ${totalExpense.toFixed(2)}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <button class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-1 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>
            <button class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-1 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 disabled:opacity-50" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </div>
          
          <button class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" x2="8" y1="13" y2="13"></line>
              <line x1="16" x2="8" y1="17" y2="17"></line>
              <line x1="10" x2="8" y1="9" y2="9"></line>
            </svg>
            Exportar
          </button>
        </div>
      </div>
    `;
    
    // Adicionar event listeners
    document.getElementById('search-transactions').addEventListener('input', filterTransactions);
    document.getElementById('filter-type').addEventListener('change', filterTransactions);
    document.getElementById('filter-category').addEventListener('change', filterTransactions);
    document.getElementById('btn-more-filters').addEventListener('click', showMoreFilters);
  }
  
  function filterTransactions() {
    // Implementar filtragem de transações
    console.log('Filtrando transações...');
  }
  
  function showMoreFilters() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('hidden');
    
    const modalContent = modalContainer.querySelector('div');
    modalContent.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Filtros Avançados</h3>
          <button onclick="closeAllModals()" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Período</h4>
            <div class="space-y-2">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Data inicial</label>
                <input type="date" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Data final</label>
                <input type="date" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">Valor</h4>
            <div class="space-y-2">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Valor mínimo (R$)</label>
                <input type="number" step="0.01" min="0" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="0,00">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Valor máximo (R$)</label>
                <input type="number" step="0.01" min="0" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="0,00">
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" onclick="clearFilters()" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Limpar Filtros
          </button>
          <button type="button" onclick="applyFilters()" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            Aplicar
          </button>
        </div>
      </div>
    `;
  }
  
  function clearFilters() {
    // Limpar filtros
    console.log('Limpando filtros...');
    closeAllModals();
  }
  
  function applyFilters() {
    // Aplicar filtros
    console.log('Aplicando filtros...');
    closeAllModals();
    
    // Recarregar dados
    loadTransactionsTable();
  }