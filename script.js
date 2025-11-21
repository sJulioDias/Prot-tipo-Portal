
function atualizarContador(listaId, contadorId, barraId) {
    const lista = document.querySelectorAll(`#${listaId} input[type="checkbox"]`);
    const feitas = document.querySelectorAll(`#${listaId} input[type="checkbox"]:checked`).length;
    const total = lista.length;
    const percentual = total > 0 ? (feitas / total) * 100 : 0;

    document.getElementById(contadorId).textContent = `${feitas} tarefas de ${total} realizadas`;
    document.getElementById(barraId).style.width = `${percentual}%`;
}

const listas = [
    { listaId: 'lista-pleno', contadorId: 'contador-pleno', barraId: 'barra-pleno' },
    { listaId: 'lista-junior', contadorId: 'contador-junior', barraId: 'barra-junior' }
];

listas.forEach(({ listaId, contadorId, barraId }) => {
    document.querySelectorAll(`#${listaId} input[type="checkbox"]`).forEach(checkbox => {
        checkbox.addEventListener('change', () => atualizarContador(listaId, contadorId, barraId));
    });
    atualizarContador(listaId, contadorId, barraId);
});

function adicionarTarefa() {
    const tarefa = document.getElementById('new-task').value.trim();
    const listaSelecionada = document.querySelector('select').value;

    if (!tarefa) {
        alert('Por favor, insira o nome da tarefa.');
        return;
    }

    // Define IDs com base na lista escolhida
    let listaId, contadorId, barraId;
    if (listaSelecionada === 'valor1') {
        listaId = 'lista-pleno';
        contadorId = 'contador-pleno';
        barraId = 'barra-pleno';
    } else {
        listaId = 'lista-junior';
        contadorId = 'contador-junior';
        barraId = 'barra-junior';
    }

    // Cria o novo item da lista
    const li = document.createElement('li');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => atualizarContador(listaId, contadorId, barraId));

    // Texto da tarefa
    const texto = document.createTextNode(' ' + tarefa);

    // Botão de exclusão
    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.style.backgroundColor = '#f44336';
    botaoExcluir.style.color = 'white';
    botaoExcluir.style.border = 'none';
        
    botaoExcluir.addEventListener('click', () => {
        li.remove();
        atualizarContador(listaId, contadorId, barraId);
    });

    // Monta o li
    li.appendChild(checkbox);
    li.appendChild(texto);
    li.appendChild(botaoExcluir);

    // Adiciona à lista
    document.getElementById(listaId).appendChild(li);

    // Limpa o campo
    document.getElementById('new-task').value = '';

    // Atualiza contador
    atualizarContador(listaId, contadorId, barraId);
}