// Gerenciamento de holerite
const Payroll = {
    data: {
        items: [],
        va: { days: 0, dailyValue: 0, total: 0 }
    },
    
    init: function() {
        // Carregar dados do armazenamento local
        this.data = Storage.getPayroll();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Renderizar itens do holerite
        this.renderPayrollItems();
        
        // Atualizar resumo do holerite
        this.updatePayrollSummary();
    },
    
    setupEventListeners: function() {
        // Botão para importar holerite
        document.getElementById('import-payroll').addEventListener('click', () => {
            document.getElementById('payroll-modal').classList.remove('hidden');
        });
        
        // Botão para editar holerite
        document.getElementById('edit-payroll').addEventListener('click', () => {
            // Implementar edição de holerite
            alert('Funcionalidade de edição de holerite em desenvolvimento');
        });
        
        // Formulário de importação de holerite
        document.getElementById('payroll-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.importPayroll();
        });
    },
    
    importPayroll: function() {
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
                this.data.items = newItems;
                this.data.va = vaInfo;
                
                // Salvar no armazenamento local
                Storage.savePayroll(this.data);
                
                // Atualizar interface
                this.renderPayrollItems();
                this.updatePayrollSummary();
                
                // Fechar modal
                document.getElementById('payroll-modal').classList.add('hidden');
                document.getElementById('payroll-text').value = '';
                
                alert('Holerite importado com sucesso!');
            } else {
                alert('Não foi possível identificar itens no holerite. Verifique o formato e tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao processar holerite:', error);
            alert('Erro ao processar o holerite. Verifique o formato e tente novamente.');
        }
    },
    
    renderPayrollItems: function() {
        const container = document.getElementById('payroll-items');
        
        // Limpar container
        container.innerHTML = '';
        
        // Verificar se há itens
        if (this.data.items.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center">Nenhum item de holerite adicionado</p>';
            return;
        }
        
        // Renderizar itens
        this.data.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex justify-between items-center p-2 border-b';
            
            itemElement.innerHTML = `
                <div>
                    <span class="text-sm font-medium">${item.description}</span>
                    <span class="text-xs text-gray-500 ml-1">(${item.reference})</span>
                </div>
                <span class="text-sm ${item.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}">
                    ${item.type === 'Entrada' ? '+' : '-'}R$ ${item.amount.toFixed(2)}
                </span>
            `;
            
            container.appendChild(itemElement);
        });
    },
    
    updatePayrollSummary: function() {
        const totalIncome = this.data.items
            .filter(item => item.type === 'Entrada')
            .reduce((sum, item) => sum + item.amount, 0);
            
        const totalDeduction = this.data.items
            .filter(item => item.type === 'Saída')
            .reduce((sum, item) => sum + item.amount, 0);
            
        const netPayment = totalIncome - totalDeduction + this.data.va.total;
        
        // Atualizar elementos na interface
        document.getElementById('payroll-income').textContent = `R$ ${totalIncome.toFixed(2)}`;
        document.getElementById('payroll-deduction').textContent = `R$ ${totalDeduction.toFixed(2)}`;
        document.getElementById('payroll-net').textContent = `R$ ${netPayment.toFixed(2)}`;
    }
};