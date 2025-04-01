// charts.js - Funções para gráficos e visualizações

document.addEventListener('DOMContentLoaded', function() {
    loadMonthlyChart();
    loadUpcomingBills();
  });
  
  function loadMonthlyChart() {
    // Em produção, isso buscaria dados de uma API
    fetch('api/monthly-data.php')
      .then(response => response.json())
      .catch(() => {
        // Dados de exemplo para demonstração
        return {
          labels: ['01/03', '05/03', '10/03', '15/03', '20/03', '25/03', '30/03'],
          income: [0, 500, 1200, 1200, 2200, 2200, 2200],
          expense: [0, 200, 400, 800, 1200, 1600, 1900]
        };
      })
      .then(data => {
        renderMonthlyChart(data);
      });
  }
  
  function renderMonthlyChart(data) {
    const ctx = document.getElementById('monthly-chart').getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Entradas',
            data: data.income,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Saídas',
            data: data.expense,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                    {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += 'R$ ' + context.parsed.y.toFixed(2);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'R$ ' + value.toFixed(2);
              }
            }
          }
        }
      }
    });
  }
  
  function loadUpcomingBills() {
    // Em produção, isso buscaria dados de uma API
    fetch('api/upcoming-bills.php')
      .then(response => response.json())
      .catch(() => {
        // Dados de exemplo para demonstração
        return {
          bills: [
            { name: "Aluguel", amount: 1000.0, dueDate: "05/04/2025", daysLeft: 5 },
            { name: "Internet", amount: 120.0, dueDate: "10/04/2025", daysLeft: 10 },
            { name: "Energia", amount: 230.0, dueDate: "15/04/2025", daysLeft: 15 },
            { name: "Cartão de Crédito", amount: 1500.0, dueDate: "20/04/2025", daysLeft: 20, priority: true },
            { name: "Água", amount: 80.0, dueDate: "25/04/2025", daysLeft: 25 }
          ]
        };
      })
      .then(data => {
        renderUpcomingBills(data);
      });
  }
  
  function renderUpcomingBills(data) {
    const container = document.getElementById('upcoming-bills');
    
    // Calcular total
    const totalAmount = data.bills.reduce((sum, bill) => sum + bill.amount, 0);
    
    let html = '<div class="space-y-2">';
    
    data.bills.forEach(bill => {
      html += `
        <div class="flex items-center justify-between border-b pb-2 last:border-0">
          <div>
            <div class="font-medium">${bill.name}</div>
            <div class="text-sm text-gray-500">
              Vencimento: ${bill.dueDate}
              ${bill.priority ? '<span class="ml-1 text-amber-500 font-medium">(Prioridade)</span>' : ''}
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="font-bold">R$ ${bill.amount.toFixed(2)}</div>
            <div class="flex items-center gap-2">
              ${bill.daysLeft <= 7 
                ? `<div class="flex items-center text-xs text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3 mr-1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" x2="12" y1="8" y2="12"></line>
                      <line x1="12" x2="12.01" y1="16" y2="16"></line>
                    </svg>
                    ${bill.daysLeft} dias
                  </div>`
                : `<div class="text-xs text-gray-500">${bill.daysLeft} dias</div>`
              }
            </div>
          </div>
        </div>
      `;
    });
    
    html += `
      <div class="mt-4 rounded-md bg-gray-100 p-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium">Total a pagar:</span>
          <span class="font-bold">R$ ${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    `;
    
    html += '</div>';
    
    container.innerHTML = html;
  }