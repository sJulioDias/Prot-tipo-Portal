function atualizarContador(listaId, contadorId, barraId) {
    const lista = document.querySelectorAll(`#${listaId} input[type="checkbox"]`);
    const feitas = document.querySelectorAll(`#${listaId} input[type="checkbox"]:checked`).length;
    const total = lista.length;
    const percentual = total > 0 ? (feitas / total) * 100 : 0;
     //Barra de tarefas dourada
    if (percentual === 100) {
    document.getElementById(barraId).style.backgroundColor = "#FFD700"; // dourado
    } else {
    document.getElementById(barraId).style.backgroundColor = "#4CAF50"; // verde padrão
}
    document.getElementById(contadorId).textContent = `${feitas} tarefas de ${total} realizadas`;
    document.getElementById(barraId).style.width = `${percentual}%`;
}

const listas = [
    { listaId: 'lista-pleno', contadorId: 'contador-pleno', barraId: 'barra-pleno' },
    { listaId: 'lista-junior', contadorId: 'contador-junior', barraId: 'barra-junior' }
];

listas.forEach(({ listaId, contadorId, barraId }) => {
    document.querySelectorAll(`#${listaId} input[type="checkbox"]`).forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            atualizarContador(listaId, contadorId, barraId);

            // Aplica ou remove a classe .completed no <li>
            const li = checkbox.parentElement;
            if (checkbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
        });
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

    let listaId, contadorId, barraId;
    if (listaSelecionada === 'tarefa-analista-pleno') {
        listaId = 'lista-pleno';
        contadorId = 'contador-pleno';
        barraId = 'barra-pleno';
    } else {
        listaId = 'lista-junior';
        contadorId = 'contador-junior';
        barraId = 'barra-junior';
    }

    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        atualizarContador(listaId, contadorId, barraId);

        // Aplica ou remove a classe .completed
        if (checkbox.checked) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
    });

    const texto = document.createTextNode(' ' + tarefa);

    const botaoExcluir = document.createElement('button');
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.classList.add('btn-excluir');
    botaoExcluir.addEventListener('click', () => {
        li.remove();
        atualizarContador(listaId, contadorId, barraId);
    });

    li.appendChild(checkbox);
    li.appendChild(texto);
    li.appendChild(botaoExcluir);

    document.getElementById(listaId).appendChild(li);

    document.getElementById('new-task').value = '';

    atualizarContador(listaId, contadorId, barraId);
}


function naoSeAplica(botao) {
    const li = botao.parentElement;
    li.style.textDecoration = "line-through"; // risca a tarefa
    li.style.opacity = "0.6"; // deixa mais apagada
    li.querySelector("input[type='checkbox']").disabled = true; // desativa o checkbox
    li.querySelector("input[type='checkbox']").checked = false;
    li.classList.add('inaplicavel');

    // Remove o botão e adiciona o texto "Excluído"
    botao.remove();
    const excluidoTexto = document.createElement("span");
    excluidoTexto.textContent = "Excluído";
    excluidoTexto.style.fontWeight = "bold";
    excluidoTexto.style.color = "red";
    li.appendChild(excluidoTexto);

    // Atualiza contadores
    listas.forEach(({ listaId, contadorId, barraId }) => {
        document.querySelectorAll(`#${listaId} input[type="checkbox"]`).forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                atualizarContador(listaId, contadorId, barraId);
            });
        });
        atualizarContador(listaId, contadorId, barraId);
    });
}

function salvarAlteracoes() {
    alert('Função ainda não implementada :(');
}
