// Gerenciamento de gráficos
const Charts = {
    expenseChart: null,
    
    init: function() {
        // Inicializar gráficos
        this.initExpenseChart();
    },
    
    initExpenseChart: function() {
        const ctx = document.getElementById('expense-chart').getContext('2d');
        
        // Destruir gráfico existente se houver
        if (this.expenseChart) {
            this.expenseChart.destroy();
        }
        
        // Obter dados para o gráfico
        const { incomeData, expenseData } = this.getChartData();
        
        // Criar gráfico
        this.expenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Receitas', 'Despesas'],
                datasets: [
                    {
                        label: 'Valores',
                        data: [incomeData.total, expenseData.total],
                        backgroundColor: [
                            'rgba(34, 197, 94, 0.6)',
                            'rgba(239, 68, 68, 0.6)'
                        ],
                        borderColor: [
                            'rgba(34, 197, 94, 1)',
                            'rgba(239, 68, 68, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'R$ ' + context.raw.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    },
    
    getChartData: function() {
        // Obter transações
        const transactions = Storage.getTransactions();
        
        // Dados de receitas
        const incomeTransactions = transactions.filter(t => t.type === 'Entrada');
        const incomeTotal = incomeTransactions.reduce((sum, t) => sum + t.value, 0);
        const incomeByCategory = this.groupByCategory(incomeTransactions);
        
        // Dados de despesas
        const expenseTransactions = transactions.filter(t => t.type === 'Saída');
        const expenseTotal = expenseTransactions.reduce((sum, t) => sum + t.value, 0);
        const expenseByCategory = this.groupByCategory(expenseTransactions);
        
        return {
            incomeData: {
                total: incomeTotal,
                byCategory: incomeByCategory
            },
            expenseData: {
                total: expenseTotal,
                byCategory: expenseByCategory
            }
        };
    },
    
    groupByCategory: function(transactions) {
        const result = {};
        
        transactions.forEach(transaction => {
            const category = transaction.category;
            if (!result[category]) {
                result[category] = 0;
            }
            result[category] += transaction.value;
        });
        
        return result;
    },
    
    updateCharts: function() {
        // Atualizar gráfico de despesas
        const { incomeData, expenseData } = this.getChartData();
        
        if (this.expenseChart) {
            this.expenseChart.data.datasets[0].data = [incomeData.total, expenseData.total];
            this.expenseChart.update();
        }
    }
};