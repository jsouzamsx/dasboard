// Variáveis globais
let transacoes = [];
let holerite = {
    itens: [],
    va: { dias: 0, valorDiario: 0, total: 0 }
};
let resumoFinanceiro = {
    entradas: 0,
    saidas: 0
};
let paginaAtual = 1;
let itensPorPagina = 10;
let filtrosAtivos = {};

// Categorias disponíveis
const categorias = {
    'entrada': ['Cartão', 'Diversos', 'Valores'],
    'saida': ['Sistema', 'Saída']
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados do localStorage
    carregarDados();
    
    // Atualizar data e hora
    atualizarDataHora();
    
    // Configurar eventos
    configurarEventos();
    
    // Renderizar transações
    renderizarTransacoes();
    
    // Atualizar resumo financeiro
    atualizarResumoFinanceiro();
    
    // Renderizar itens do holerite
    renderizarItensHolerite();
});

// Carregar dados do localStorage
function carregarDados() {
    // Carregar transações
    const transacoesArmazenadas = localStorage.getItem('dashboard_transacoes');
    if (transacoesArmazenadas) {
        transacoes = JSON.parse(transacoesArmazenadas);
    }
    
    // Carregar holerite
    const holeriteArmazenado = localStorage.getItem('dashboard_holerite');
    if (holeriteArmazenado) {
        holerite = JSON.parse(holeriteArmazenado);
    }
    
    // Carregar resumo financeiro
    const resumoArmazenado = localStorage.getItem('dashboard_resumo');
    if (resumoArmazenado) {
        resumoFinanceiro = JSON.parse(resumoArmazenado);
    }
    
    // Carregar configurações de paginação
    const itensPorPaginaArmazenado = localStorage.getItem('dashboard_itens_por_pagina');
    if (itensPorPaginaArmazenado) {
        itensPorPagina = parseInt(itensPorPaginaArmazenado);
        document.getElementById('itens-por-pagina').value = itensPorPagina;
    }
}

// Atualizar data e hora
function atualizarDataHora() {
    const elementoDataHora = document.getElementById('data-hora');
    
    function atualizar() {
        const agora = new Date();
        const opcoes = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        elementoDataHora.textContent = agora.toLocaleDateString('pt-BR', opcoes);
    }
    
    atualizar();
    setInterval(atualizar, 60000); // Atualizar a cada minuto
}

// Configurar eventos
function configurarEventos() {
    // Botões para adicionar transações
    document.getElementById('adicionar-entrada').addEventListener('click', () => abrirModalTransacao('entrada'));
    document.getElementById('adicionar-saida').addEventListener('click', () => abrirModalTransacao('saida'));
    
    // Formulário de transação
    document.getElementById('form-transacao').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarTransacao();
    });
    
    // Botão para importar holerite
    document.getElementById('importar-holerite').addEventListener('click', function() {
        document.getElementById('modal-holerite').style.display = 'block';
    });
    
    // Formulário de holerite
    document.getElementById('form-holerite').addEventListener('submit', function(e) {
        e.preventDefault();
        importarHolerite();
    });
    
    // Botão para editar resumo
    document.getElementById('editar-resumo').addEventListener('click', function() {
        document.getElementById('resumo-entradas').value = resumoFinanceiro.entradas;
        document.getElementById('resumo-saidas').value = resumoFinanceiro.saidas;
        document.getElementById('modal-resumo').style.display = 'block';
    });
    
    // Formulário de resumo
    document.getElementById('form-resumo').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarResumo();
    });
    
    // Filtros
    document.getElementById('filtro-busca').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-tipo').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-categoria').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-data-inicio').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-data-fim').addEventListener('change', aplicarFiltros);
    document.getElementById('limpar-filtros').addEventListener('click', limparFiltros);
    
    // Paginação
    document.getElementById('pagina-anterior').addEventListener('click', function() {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarTransacoes();
        }
    });
    
    document.getElementById('proxima-pagina').addEventListener('click', function() {
        const transacoesFiltradas = obterTransacoesFiltradas();
        const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina);
        
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarTransacoes();
        }
    });
    
    // Itens por página
    document.getElementById('itens-por-pagina').addEventListener('change', function(e) {
        itensPorPagina = parseInt(e.target.value);
        localStorage.setItem('dashboard_itens_por_pagina', itensPorPagina);
        paginaAtual = 1;
        renderizarTransacoes();
    });
    
    // Exportar dados
    document.getElementById('exportar-dados').addEventListener('click', exportarDados);
    
    // Importar dados
    document.getElementById('importar-dados').addEventListener('click', function() {
        document.getElementById('arquivo-importacao').click();
    });
    
    document.getElementById('arquivo-importacao').addEventListener('change', function(e) {
        const arquivo = e.target.files[0];
        if (arquivo) {
            const leitor = new FileReader();
            leitor.onload = function(evento) {
                try {
                    const dados = JSON.parse(evento.target.result);
                    importarDados(dados);
                } catch (erro) {
                    alert('Erro ao importar dados. Verifique se o arquivo está no formato correto.');
                    console.error('Erro ao importar dados:', erro);
                }
            };
            leitor.readAsText(arquivo);
        }
    });
    
    // Fechar modais
    document.querySelectorAll('.fechar-modal, .cancelar-modal').forEach(elemento => {
        elemento.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', function(e) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Abrir modal de transação
function abrirModalTransacao(tipo, transacao = null) {
    const modal = document.getElementById('modal-transacao');
    const titulo = document.getElementById('modal-titulo');
    const form = document.getElementById('form-transacao');
    const tipoInput = document.getElementById('transacao-tipo');
    const idInput = document.getElementById('transacao-id');
    const dataInput = document.getElementById('transacao-data');
    const descricaoInput = document.getElementById('transacao-descricao');
    const valorInput = document.getElementById('transacao-valor');
    const categoriaSelect = document.getElementById('transacao-categoria');
    
    // Limpar formulário
    form.reset();
    
    // Configurar tipo de transação
    tipoInput.value = tipo;
    titulo.textContent = transacao ? 'Editar Transação' : `Adicionar ${tipo === 'entrada' ? 'Entrada' : 'Saída'}`;
    
    // Preencher categorias
    categoriaSelect.innerHTML = '';
    categorias[tipo].forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        categoriaSelect.appendChild(option);
    });
    
    // Se for edição, preencher com dados existentes
    if (transacao) {
        idInput.value = transacao.id;
        dataInput.value = formatarDataParaInput(transacao.data);
        descricaoInput.value = transacao.descricao;
        valorInput.value = transacao.valor;
        
        // Selecionar categoria
        for (let i = 0; i < categoriaSelect.options.length; i++) {
            if (categoriaSelect.options[i].value === transacao.categoria) {
                categoriaSelect.selectedIndex = i;
                break;
            }
        }
    } else {
        idInput.value = '';
        dataInput.value = formatarDataParaInput(new Date());
    }
    
    modal.style.display = 'block';
}

// Salvar transação
function salvarTransacao() {
    const form = document.getElementById('form-transacao');
    
    // Validar formulário
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const idInput = document.getElementById('transacao-id');
    const tipoInput = document.getElementById('transacao-tipo');
    const dataInput = document.getElementById('transacao-data');
    const descricaoInput = document.getElementById('transacao-descricao');
    const valorInput = document.getElementById('transacao-valor');
    const categoriaSelect = document.getElementById('transacao-categoria');
    
    const transacao = {
        id: idInput.value || Date.now().toString(),
        tipo: tipoInput.value,
        data: dataInput.value,
        descricao: descricaoInput.value,
        valor: parseFloat(valorInput.value),
        categoria: categoriaSelect.value
    };
    
    // Verificar se é uma edição ou nova transação
    if (idInput.value) {
        // Edição - atualizar transação existente
        const index = transacoes.findIndex(t => t.id === idInput.value);
        if (index !== -1) {
            transacoes[index] = transacao;
        }
    } else {
        // Nova transação
        transacoes.push(transacao);
    }
    
    // Salvar no localStorage
    localStorage.setItem('dashboard_transacoes', JSON.stringify(transacoes));
    
    // Atualizar interface
    renderizarTransacoes();
    atualizarResumoFinanceiro();
    
    // Fechar modal
    document.getElementById('modal-transacao').style.display = 'none';
}

// Excluir transação
function excluirTransacao(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        transacoes = transacoes.filter(t => t.id !== id);
        
        // Salvar no localStorage
        localStorage.setItem('dashboard_transacoes', JSON.stringify(transacoes));
        
        // Atualizar interface
        renderizarTransacoes();
        atualizarResumoFinanceiro();
    }
}

// Renderizar transações
function renderizarTransacoes() {
    const tabelaCorpo = document.querySelector('#tabela-transacoes tbody');  {
    const tabelaCorpo = document.querySelector('#tabela-transacoes tbody');
    const transacoesFiltradas = obterTransacoesFiltradas();
    
    // Calcular paginação
    const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina);
    const indiceInicial = (paginaAtual - 1) * itensPorPagina;
    const indiceFinal = Math.min(indiceInicial + itensPorPagina, transacoesFiltradas.length);
    const transacoesPaginadas = transacoesFiltradas.slice(indiceInicial, indiceFinal);
    
    // Atualizar informações de paginação
    document.getElementById('info-pagina').textContent = `Página ${paginaAtual} de ${totalPaginas || 1}`;
    
    // Habilitar/desabilitar botões de paginação
    document.getElementById('pagina-anterior').disabled = paginaAtual <= 1;
    document.getElementById('proxima-pagina').disabled = paginaAtual >= totalPaginas;
    
    // Limpar tabela
    tabelaCorpo.innerHTML = '';
    
    // Verificar se há transações
    if (transacoesPaginadas.length === 0) {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td colspan="6" class="mensagem-vazia">Nenhuma transação encontrada</td>
        `;
        tabelaCorpo.appendChild(linha);
        return;
    }
    
    // Renderizar transações
    transacoesPaginadas.forEach(transacao => {
        const linha = document.createElement('tr');
        
        // Formatar data para exibição
        const dataFormatada = formatarDataParaExibicao(transacao.data);
        
        linha.innerHTML = `
            <td>${dataFormatada}</td>
            <td><span class="badge badge-${transacao.tipo}">${transacao.tipo === 'entrada' ?