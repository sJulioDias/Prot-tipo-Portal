// Função utilitária para obter referências de lista, contador e barra
function obterRefs(listaSelecionada) {
    if (listaSelecionada === 'tarefa-analista-pleno') {
        return { listaId: 'lista-pleno', contadorId: 'contador-pleno', barraId: 'barra-pleno' };
    }
    return { listaId: 'lista-junior', contadorId: 'contador-junior', barraId: 'barra-junior' };
}

// Atualiza contador e barra de progresso
function atualizarContador(listaId, contadorId, barraId) {
    const lista = [...document.querySelectorAll(`#${listaId} input[type="checkbox"]:not([disabled])`)];
    const tarefasConcluidas = lista.filter(cb => cb.checked).length;
    const totalTarefas = lista.length;
    const percentual = totalTarefas > 0 ? (tarefasConcluidas / totalTarefas) * 100 : 0;

    const barra = document.getElementById(barraId);
    barra.style.backgroundColor = percentual === 100 ? "#FFD700" : "#4CAF50";
    barra.style.width = `${percentual}%`;

    document.getElementById(contadorId).textContent = `${tarefasConcluidas} tarefas de ${totalTarefas} realizadas`;
}

// Configura comportamento do checkbox
function configurarCheckbox(checkbox, listaId, contadorId, barraId) {
    checkbox.addEventListener('change', () => {
        atualizarContador(listaId, contadorId, barraId);
        const li = checkbox.parentElement;
        li.classList.toggle('completed', checkbox.checked);
    });
}

// Configuração inicial das listas
const listas = [
    { listaId: 'lista-pleno', contadorId: 'contador-pleno', barraId: 'barra-pleno' },
    { listaId: 'lista-junior', contadorId: 'contador-junior', barraId: 'barra-junior' }
];

listas.forEach(({ listaId, contadorId, barraId }) => {
    document.querySelectorAll(`#${listaId} input[type="checkbox"]`).forEach(checkbox => {
        configurarCheckbox(checkbox, listaId, contadorId, barraId);
    });
    atualizarContador(listaId, contadorId, barraId);
});

// Adicionar nova tarefa
function adicionarTarefa() {
    const tarefa = document.getElementById('new-task').value.trim();
    const listaSelecionada = document.querySelector('select').value;

    if (!tarefa) {
        alert('Por favor, insira o nome da tarefa.');
        return;
    }

    const { listaId, contadorId, barraId } = obterRefs(listaSelecionada);

    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    configurarCheckbox(checkbox, listaId, contadorId, barraId);

    const texto = document.createTextNode(' ' + tarefa);

    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.classList.add('btn-excluir');
    botaoExcluir.addEventListener('click', () => {
        li.remove();
        atualizarContador(listaId, contadorId, barraId);
    });

    li.append(checkbox, texto, botaoExcluir);
    document.getElementById(listaId).appendChild(li);

    document.getElementById('new-task').value = '';
    atualizarContador(listaId, contadorId, barraId);
}

// Marcar como "não se aplica"
function naoSeAplica(botao) {
    const li = botao.parentElement;
    const checkbox = li.querySelector("input[type='checkbox']");
    const listaId = li.parentElement.id;
    const contadorId = listaId === 'lista-pleno' ? 'contador-pleno' : 'contador-junior';
    const barraId = listaId === 'lista-pleno' ? 'barra-pleno' : 'barra-junior';

    if (checkbox.disabled) {
        checkbox.disabled = false;
        li.classList.remove('inaplicavel');
        li.classList.remove('completed');
        atualizarContador(listaId, contadorId, barraId);
        return;
    }

    checkbox.disabled = true;
    checkbox.checked = false;
    li.classList.add('inaplicavel');
    atualizarContador(listaId, contadorId, barraId);
}

// Editar nome da tarefa
function editarNome(botao) {
    const li = botao.parentElement;
    const textoNode = [...li.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
    const textoAtual = textoNode.textContent.trim();

    const input = document.createElement('input');
    input.type = 'text';
    input.value = textoAtual;

    li.replaceChild(input, textoNode);

    input.addEventListener('blur', () => salvarEdicao(li, input));
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') salvarEdicao(li, input);
    });

    input.focus();
}

const salvarEdicao = (li, input) => {
    const novoTexto = input.value.trim();
    const novoNode = document.createTextNode(" " + (novoTexto || "Tarefa sem nome"));
    li.replaceChild(novoNode, input);
};

// Função para salvar alterações no localStorage
function salvarAlteracoes() {
    const dados = {
        pleno: [],
        junior: []
    };

    function extrairDados(listaId) {
        const tarefas = [];
        document.querySelectorAll(`#${listaId} li`).forEach(li => {
            const checkbox = li.querySelector("input[type='checkbox']");
            const inputExtra = li.querySelector("input[type='text']");
            const textoNode = [...li.childNodes].find(node => node.nodeType === Node.TEXT_NODE);
            const texto = textoNode ? textoNode.textContent.trim() : "";

            tarefas.push({
                texto,
                concluida: checkbox ? checkbox.checked : false,
                inaplicavel: checkbox ? checkbox.disabled : false,
                extra: inputExtra && inputExtra !== checkbox ? inputExtra.value : ""
            });
        });
        return tarefas;
    }

    dados.pleno = extrairDados("lista-pleno");
    dados.junior = extrairDados("lista-junior");

    localStorage.setItem("tarefas", JSON.stringify(dados));
    alert("Alterações salvas com sucesso!");
}

// Função para carregar alterações do localStorage
function carregarAlteracoes() {
    const dados = JSON.parse(localStorage.getItem("tarefas"));
    if (!dados) {
        alert("Nenhuma alteração salva.");
        return;
    }

    function reconstruirLista(listaId, tarefas, contadorId, barraId) {
        const lista = document.getElementById(listaId);
        lista.innerHTML = "";

        tarefas.forEach(tarefa => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = tarefa.concluida;
            checkbox.disabled = tarefa.inaplicavel;
            configurarCheckbox(checkbox, listaId, contadorId, barraId);

            const textoNode = document.createTextNode(" " + tarefa.texto);
            li.appendChild(checkbox);
            li.appendChild(textoNode);

            if (tarefa.extra) {
                const inputExtra = document.createElement("input");
                inputExtra.type = "text";
                inputExtra.value = tarefa.extra;
                li.appendChild(inputExtra);
            }

            const span = document.createElement("span");
            li.appendChild(span);

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn-editar");
            btnEditar.onclick = () => editarNome(btnEditar);
            li.appendChild(btnEditar);

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Retirar";
            btnExcluir.classList.add("btn-excluir");
            btnExcluir.onclick = () => naoSeAplica(btnExcluir);
            li.appendChild(btnExcluir);

            if (tarefa.concluida) li.classList.add("completed");
            if (tarefa.inaplicavel) li.classList.add("inaplicavel");

            lista.appendChild(li);
        });

        atualizarContador(listaId, contadorId, barraId);
    }

    reconstruirLista("lista-pleno", dados.pleno, "contador-pleno", "barra-pleno");
    reconstruirLista("lista-junior", dados.junior, "contador-junior", "barra-junior");

    alert("Alterações carregadas!");
}

function exportarJSON() {
    const dados = localStorage.getItem("tarefas");
    if (!dados) {
        alert("Nenhuma alteração salva para exportar.");
        return;
    }

    // Cria um blob com o conteúdo JSON
    const blob = new Blob([dados], { type: "application/json" });

    // Cria um link temporário para download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tarefas.json"; // nome do arquivo
    document.body.appendChild(a);
    a.click();

    // Remove o link temporário
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importarJSON() {
    const input = document.getElementById("importar-arquivo");
    const arquivo = input.files[0];

    if (!arquivo) {
        alert("Por favor, selecione um arquivo JSON para importar.");
        return;
    }

    const leitor = new FileReader();
    leitor.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);

            // Salva no localStorage
            localStorage.setItem("tarefas", JSON.stringify(dados));

            // Reconstrói as listas usando a função carregarAlteracoes()
            carregarAlteracoes();

            alert("Importação concluída com sucesso!");
        } catch (erro) {
            alert("Erro ao importar o arquivo. Verifique se é um JSON válido.");
        }
    };

    leitor.readAsText(arquivo);
}
