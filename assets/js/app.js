// Arquivo principal da aplicação
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    Dashboard.init();
    Transactions.init();
    Payroll.init();
    Charts.init();
    
    // Configurar exportação e importação de dados
    setupDataManagement();
    
    // Configurar gerenciamento de metas
    setupGoalsManagement();
});

// Configurar exportação e importação de dados
function setupDataManagement() {
    // Botão de exportação
    document.getElementById('export-data').addEventListener('click', function() {
        const data = Storage.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'financial_dashboard_backup_' + new Date().toISOString().slice(0, 10) + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
    
    // Botão de importação
    document.getElementById('import-data').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const data = JSON.parse(event.target.result);
                    Storage.importData(data);
                    
                    // Recarregar a página para aplicar as alterações
                    alert('Dados importados com sucesso! A página será recarregada.');
                    window.location.reload();
                } catch (error) {
                    console.error('Erro ao importar dados:', error);
                    alert('  {
                    console.error('Erro ao importar dados:', error);
                    alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    });
}

// Configurar gerenciamento de metas
function setupGoalsManagement() {
    // Carregar metas do armazenamento local
    let goals = Storage.getGoals();
    
    // Botão para adicionar meta
    document.getElementById('add-goal').addEventListener('click', function() {
        openGoalModal();
    });
    
    // Formulário de meta
    document.getElementById('goal-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveGoal();
    });
    
    // Renderizar metas iniciais
    renderGoals();
    
    // Função para abrir modal de meta
    function openGoalModal(goal = null) {
        const modal = document.getElementById('goal-modal');
        const title = document.getElementById('goal-modal-title');
        const form = document.getElementById('goal-form');
        const idInput = document.getElementById('goal-id');
        const nameInput = document.getElementById('goal-name');
        const targetInput = document.getElementById('goal-target');
        const currentInput = document.getElementById('goal-current');
        const dateInput = document.getElementById('goal-date');
        const saveButton = document.getElementById('save-goal');
        
        // Limpar formulário
        form.reset();
        
        // Configurar título
        title.textContent = goal ? 'Editar Meta' : 'Adicionar Meta';
        
        // Se for edição, preencher com dados existentes
        if (goal) {
            idInput.value = goal.id;
            nameInput.value = goal.name;
            targetInput.value = goal.target;
            currentInput.value = goal.current;
            dateInput.value = formatDateForInput(goal.date);
            
            saveButton.textContent = 'Atualizar';
        } else {
            idInput.value = '';
            dateInput.value = formatDateForInput(new Date());
            saveButton.textContent = 'Salvar';
        }
        
        // Mostrar modal
        modal.classList.remove('hidden');
    }
    
    // Função para salvar meta
    function saveGoal() {
        const idInput = document.getElementById('goal-id');
        const nameInput = document.getElementById('goal-name');
        const targetInput = document.getElementById('goal-target');
        const currentInput = document.getElementById('goal-current');
        const dateInput = document.getElementById('goal-date');
        
        const target = parseFloat(targetInput.value);
        const current = parseFloat(currentInput.value);
        
        const goal = {
            id: idInput.value || Date.now().toString(),
            name: nameInput.value,
            target: target,
            current: current,
            percentage: Math.round((current / target) * 100),
            date: dateInput.value
        };
        
        // Verificar se é uma edição ou nova meta
        if (idInput.value) {
            // Edição - atualizar meta existente
            const index = goals.findIndex(g => g.id === idInput.value);
            if (index !== -1) {
                goals[index] = goal;
            }
        } else {
            // Nova meta
            goals.push(goal);
        }
        
        // Salvar no armazenamento local
        Storage.saveGoals(goals);
        
        // Atualizar interface
        renderGoals();
        
        // Fechar modal
        document.getElementById('goal-modal').classList.add('hidden');
    }
    
    // Função para renderizar metas
    function renderGoals() {
        const container = document.getElementById('financial-goals');
        
        // Limpar container
        container.innerHTML = '';
        
        // Verificar se há metas
        if (goals.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center">Nenhuma meta financeira adicionada</p>';
            return;
        }
        
        // Renderizar metas
        goals.forEach(goal => {
            const goalElement = document.createElement('div');
            goalElement.className = 'space-y-2';
            
            goalElement.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="font-medium">${goal.name}</span>
                    <div class="flex items-center">
                        <span class="text-sm text-gray-500 mr-2">${formatDate(goal.date)}</span>
                        <button class="text-blue-500 hover:text-blue-700 edit-goal" data-id="${goal.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-fill bg-blue-500" style="width: ${goal.percentage}%"></div>
                </div>
                <div class="flex justify-between text-sm">
                    <span>R$ ${goal.current.toFixed(2)}</span>
                    <span class="text-gray-500">de R$ ${goal.target.toFixed(2)} (${goal.percentage}%)</span>
                </div>
            `;
            
            container.appendChild(goalElement);
        });
        
        // Adicionar eventos aos botões de edição
        document.querySelectorAll('.edit-goal').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const goal = goals.find(g => g.id === id);
                if (goal) {
                    openGoalModal(goal);
                }
            });
        });
    }
    
    // Função para formatar data para input
    function formatDateForInput(date) {
        if (typeof date === 'string') {
            // Converter string para objeto Date
            const parts = date.split('-');
            if (parts.length === 3) {
                date = new Date(parts[0], parts[1] - 1, parts[2]);
            } else {
                date = new Date(date);
            }
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    }
    
    // Função para formatar data para exibição
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
}