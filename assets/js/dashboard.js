// assets/js/dashboard.js
const Dashboard = {
  init: function() {
    this.updateDateTime();
    this.setupEventListeners();
  },
  
  updateDateTime: function() {
    const updateTime = () => {
      const now = new Date();
      
      // Formatar data
      const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
      const dateElement = document.getElementById('current-date');
      if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('pt-BR', dateOptions);
      }
      
      // Formatar hora
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const timeElement = document.getElementById('current-time');
      if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('pt-BR', timeOptions);
      }
    };
    
    // Atualizar imediatamente e depois a cada segundo
    updateTime();
    setInterval(updateTime, 1000);
  },
  
  updateFinancialOverview: function(income, expense, balance) {
    // Atualizar o status do saldo
    const balanceStatus = document.getElementById('balance-status');
    const balanceAmount = document.getElementById('balance-amount');
    
    if (balanceStatus && balanceAmount) {
      if (balance >= 0) {
        balanceStatus.textContent = 'Saldo Positivo';
        balanceStatus.className = 'text-sm text-gray-500';
        balanceAmount.textContent = `R$ ${balance.toFixed(2)}`;
        balanceAmount.className = 'text-base font-semibold text-green-500';
      } else {
        balanceStatus.textContent = 'Saldo Negativo';
        balanceStatus.className = 'text-sm text-gray-500';
        balanceAmount.textContent = `R$ ${Math.abs(balance).toFixed(2)}`;
        balanceAmount.className = 'text-base font-semibold text-red-500';
      }
    }
  },
  
  setupEventListeners: function() {
    // Fechar modais quando clicar no botão de fechar
    document.querySelectorAll('.close-modal').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
          modal.classList.add('hidden');
        });
      });
    });
    
    // Fechar modais quando clicar fora deles
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    });
  }
};