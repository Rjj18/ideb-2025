let dadosIniciais = [];
let dadosFinais = [];
let mapaEscolas = new Map(); // Para armazenar o nome e INEP de forma única
let grafIniciais = null;
let grafFinais = null;

// Carrega os dois arquivos simultaneamente ao abrir a página
Promise.all([
    fetch('ideb_iniciais_2025.json').then(res => res.json()),
    fetch('ideb_finais_2025.json').then(res => res.json())
]).then(([iniciais, finais]) => {
    dadosIniciais = iniciais;
    dadosFinais = finais;
    
    // Alimenta o mapa para garantir que não haja escolas duplicadas no datalist
    iniciais.forEach(d => mapaEscolas.set(d.ID_ESCOLA, d.NO_ESCOLA));
    finais.forEach(d => mapaEscolas.set(d.ID_ESCOLA, d.NO_ESCOLA));
    
    // Preenche o datalist do HTML para o autocompletar
    const datalist = document.getElementById('listaEscolas');
    mapaEscolas.forEach((nome, inep) => {
        let option = document.createElement('option');
        option.value = `${inep} - ${nome}`; // O formato será "35413012 - CEU EMEF..."
        datalist.appendChild(option);
    });
    
    console.log("Bases carregadas e autocompletar pronto!");
}).catch(erro => console.error("Erro ao carregar bases:", erro));

function buscarDados() {
    const inputVal = document.getElementById('searchInput').value.trim();
    if (!inputVal) return;

    // Tenta extrair o INEP numérico (caso o usuário tenha clicado na sugestão do autocompletar)
    const matchNumerico = inputVal.match(/^(\d+)/);
    let inepAlvo = null;

    if (matchNumerico) {
        inepAlvo = parseInt(matchNumerico[1]);
    } else {
        // Se o usuário digitou apenas texto, busca pelo nome exato no mapa
        const termoBusca = inputVal.toLowerCase();
        for (let [inep, nome] of mapaEscolas.entries()) {
            if (nome.toLowerCase().includes(termoBusca)) {
                inepAlvo = inep;
                break;
            }
        }
    }

    if (!inepAlvo) {
        alert("Escola não encontrada. Tente usar as sugestões da lista.");
        return;
    }

    // Filtra os dados daquela escola nas duas bases
    const escolaIniciais = dadosIniciais.filter(item => item.ID_ESCOLA === inepAlvo);
    const escolaFinais = dadosFinais.filter(item => item.ID_ESCOLA === inepAlvo);

    if (escolaIniciais.length === 0 && escolaFinais.length === 0) {
        alert("Dados não encontrados para esta escola em 2025.");
        return;
    }

    // Exibe o painel de resultados e define o nome no título
    document.getElementById('resultado').style.display = 'block';
    const nomeCorreto = mapaEscolas.get(inepAlvo);
    document.getElementById('nomeEscolaTitulo').innerText = `${inepAlvo} - ${nomeCorreto}`;

    // Renderiza cada bloco
    processarBloco(escolaIniciais, 'Iniciais');
    processarBloco(escolaFinais, 'Finais');
}

function processarBloco(dadosEscola, etapaStr) {
    const bloco = document.getElementById(`bloco${etapaStr}`);
    
    if (dadosEscola.length === 0) {
        bloco.innerHTML = `<h3 class="etapa-titulo">Anos ${etapaStr}</h3><div class="sem-dados">Esta escola não possui dados avaliados nesta etapa.</div>`;
        return;
    }

    // Se a escola tiver dados, garantimos que a estrutura original do HTML volte (caso tenha sido apagada pela linha acima)
    if(bloco.innerHTML.includes('sem-dados')) {
        bloco.innerHTML = `
            <h3 class="etapa-titulo">Anos ${etapaStr}</h3>
            <div class="cards">
                <div class="card"><h4>IDEB</h4><p id="ideb${etapaStr}">-</p></div>
                <div class="card"><h4>Matemática</h4><p id="mat${etapaStr}">-</p></div>
                <div class="card"><h4>Português</h4><p id="port${etapaStr}">-</p></div>
            </div>
            <canvas id="grafico${etapaStr}"></canvas>
        `;
    }

    const ideb = dadosEscola.find(d => d.Indicador === 'VL_OBSERVADO')?.Valor || 'S/D';
    const mat = dadosEscola.find(d => d.Indicador === 'VL_NOTA_MATEMATICA')?.Valor || 0;
    const port = dadosEscola.find(d => d.Indicador === 'VL_NOTA_PORTUGUES')?.Valor || 0;

    document.getElementById(`ideb${etapaStr}`).innerText = ideb;
    document.getElementById(`mat${etapaStr}`).innerText = mat;
    document.getElementById(`port${etapaStr}`).innerText = port;

    renderizarGrafico(mat, port, etapaStr);
}

function renderizarGrafico(mat, port, etapaStr) {
    const ctx = document.getElementById(`grafico${etapaStr}`).getContext('2d');
    
    // Cores diferentes para Iniciais (verde/amarelo) e Finais (roxo/azul)
    const corMat = etapaStr === 'Iniciais' ? '#27ae60' : '#8e44ad';
    const corPort = etapaStr === 'Iniciais' ? '#f1c40f' : '#2980b9';

    // Controle de instância dos gráficos
    if (etapaStr === 'Iniciais' && grafIniciais) grafIniciais.destroy();
    if (etapaStr === 'Finais' && grafFinais) grafFinais.destroy();

    const novoGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Matemática', 'Português'],
            datasets: [{
                label: 'Proficiência 2025',
                data: [mat, port],
                backgroundColor: [corMat, corPort],
                borderRadius: 4
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: 350 } }
        }
    });

    if (etapaStr === 'Iniciais') grafIniciais = novoGrafico;
    else grafFinais = novoGrafico;
}