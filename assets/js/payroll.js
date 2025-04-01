// payroll.js - Funções para gerenciamento de folha de pagamento

function loadPayrollSummary() {
    // Em produção, isso buscaria dados de uma API
    fetch('api/payroll.php')
      .then(response => response.json())
      .catch(() => {
        // Dados de exemplo para demonstração
        return {
          items: [
            { code: 1, description: "HORAS NORMAIS", reference: "220.00", amount: 2501.65, type: "Entrada" },
            { code: 19, description: "DIFERENÇA DE SALÁRIOS", reference: "113.89", amount: 113.89, type: "Entrada" },
            { code: 8125, description: "REFLEXO HORAS EXTRAS DSR", reference: "0.00", amount: 18.48, type: "Entrada" },
            { code: 150, description: "HORAS EXTRAS", reference: "6:30", amount: 110.87, type: "Entrada" },
            { code: 9382, description: "DESC.VALE REFEIÇÃO", reference: "57.92", amount: 57.92, type: "Saída" },
            { code: 998, description: "I.N.S.S.", reference: "8.16", amount: 222.34, type: "Saída" },
            { code: 981, description: "DESC.ADIANT.SALARIAL", reference: "1000.66", amount: 1000.66, type: "Saída" },
            { code: 8069, description: "HORAS FALTAS PARCIAL", reference: "1:53", amount: 21.38, type: "Saída" }
          ],
          va: {
            days: 20,
            dailyValue: 33.5,
            total: 670
          }
        };
      })
      .then(data => {
        renderPayrollSummary(data);
      });
  }
  
  function renderPayrollSummary(data) {
    const container = document.getElementById('payroll-summary');
    
    // Calcular totais
    const totalReceived = data.items
      .filter(item => item.type === "Entrada")
      .reduce((sum, item) => sum + item.amount, 0);
      
    const totalDeduction = data.items
      .filter(item => item.type === "Saída")
      .reduce((sum, item) => sum + item.amount, 0);
      
    const netPayment = totalReceived - totalDeduction + data.va.total;
    
    container.innerHTML = `
      <div class="p-4">
        <div class="flex justify-between items-center mb-2">
          <div>
            <h2 class="text-lg font-semibold">Folha de Pagamento</h2>
            <p class="text-sm text-gray-500">Resumo de holerite</p>
          </div>
          <div class="flex gap-2">
            <button class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20" onclick="importPayroll()">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </svg>
              Importar
            </button>
            <button class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20" onclick="addPayrollItem()">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
              Adicionar
            </button>
            <button class="rounded-full p-1 text-gray-500 hover:bg-gray-100" onclick="editPayroll()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                <path d="m15 5 4 4"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Total Recebido</span>
            <span class="text-lg font-bold">R$ ${totalReceived.toFixed(2)}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Total de Desconto</span>
            <span class="text-lg font-bold text-red-500">R$ ${totalDeduction.toFixed(2)}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-500">Pagamento a Receber</span>
            <span class="text-lg font-bold text-green-500">R$ ${netPayment.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="flex justify-between items-center p-2 border rounded-md mb-4">
          <div class="flex items-center gap-2">
            <span class="font-medium">VA</span>
            <span>Dias: ${data.va.days} x ${data.va.dailyValue}</span>
          </div>
          <div>
            <span class="font-medium">Total: R$ ${data.va.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Referência</th>
                <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              ${data.items.map(item => `
                <tr>
                  <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${item.code}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${item.description}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">${item.reference}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">R$ ${item.amount.toFixed(2)}</td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-right">
                    <span class="${item.type === 'Entrada' ? 'text-green-500' : 'text-red-500'}">${item.type}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  function importPayroll() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.classList.remove('hidden');
    
    const modalContent = modalContainer.querySelector('div');
    modalContent.innerHTML = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Importar Holerite</h3>
          <button onclick="closeAllModals()" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <label for="import-text" class="block text-sm font-medium text-gray-700 mb-1">Dados do Holerite</label>
          <textarea id="import-text" rows="10" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Cole os dados do holerite aqui..."></textarea>
        </div>
        
        <div class="flex justify-end gap-2">
          <button type="button" onclick="closeAllModals()" class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            Cancelar
          </button>
          <button type="button" onclick="processPayrollImport()" class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            Importar
          </button>
        </div>
      </div>
    `;
  }
  
  function processPayrollImport() {
    const importText = document.getElementById('import-text').value;
    
    if (!importText.trim()) {
      alert('Por favor, cole os dados do holerite para importação.');
      return;
    }
    
    // Em produção, isso enviaria dados para uma API
    console.log('Dados para importação:', importText);
    
    // Simular importação bem-sucedida
    alert('Holerite importado com sucesso!');
    closeAllModals();
    
    // Recarregar dados
    loadPayrollSummary();
  }