let receitas = [];

// Essa função busca as receitas do servidor 
function buscarReceitas() {
    axios.get('http://localhost:3000/receitas')
        .then(response => {
            receitas = response.data;
            renderizarReceitas();
        })
        .catch(tratarErro);
}
function renderizarReceitas() {
    const ul = document.querySelector(".receitas");
    const contador = document.querySelector(".contador");
    ul.innerHTML = "";

    for (let i = 0; i < receitas.length; i++) {
        ul.innerHTML += `
            <li onclick="mostrarReceita(${receitas[i].id})">
                <ion-icon name="fast-food-outline"></ion-icon>
                ${receitas[i].titulo}
                <button class="delete-btn" onclick="event.stopPropagation(); deletarReceita(${receitas[i].id})">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </li>
        `;
    }

    contador.textContent = `Qtd de Receitas: ${receitas.length}`;

}

function mostrarReceita(id) {
    // Localizar a receita pelo ID
    const receita = receitas.find(receita => receita.id === id);
    if (receita) {

        document.querySelector(".titulo-pagina-receita").textContent = receita.titulo;


        const ingredientesElement = document.querySelector(".destaque-ingredientes");
        if (Array.isArray(receita.ingredientes)) {
            // Caso os ingredientes sejam um array
            ingredientesElement.innerHTML = receita.ingredientes.join(", ");
        } else {
            // Caso os ingredientes sejam uma string
            ingredientesElement.textContent = receita.ingredientes;
        }


        document.querySelector(".destaque-preparo").textContent = receita.instrucoes || receita.preparo;
        document.querySelector(".receita").classList.remove("escondido");
        document.querySelector(".adicionar-receita").classList.add("escondido");
    } else {
        console.error("Receita não encontrada!");
    }
}

function irAdicionarReceita() {
    document.querySelector(".receita").classList.add("escondido");
    document.querySelector(".adicionar-receita").classList.remove("escondido");
}

function adicionarReceita() {
    // Pegar os inputs e os textareas
    const campoTitulo = document.querySelector(".nome-receita");
    const campoIngredientes = document.querySelector(".ingredientes-receita");
    const campoInstrucoes = document.querySelector(".modo-preparo-receita");

    // Verificar se os campos estão vazios
    if (!campoTitulo.value.trim() || !campoIngredientes.value.trim() || !campoInstrucoes.value.trim()) {
        alert("Por favor, preencha todos os campos da receita.");
        return;
    }

    // Organizar os valores em um objeto
    const novaReceita = {
        titulo: campoTitulo.value.trim(),
        ingredientes: campoIngredientes.value.trim().split(","), // Convertendo ingredientes para array
        instrucoes: campoInstrucoes.value.trim() // Usando instrucoes em vez de preparo
    };

    // Enviar a receita para o servidor
    axios.post('http://localhost:3000/receitas', novaReceita)
        .then(receberResposta)
        .catch(tratarErro); 
}

function receberResposta(resposta) {
    console.log("A resposta foi recebida");
    buscarReceitas(); 
    alert(`A receita ${resposta.data.titulo} foi adicionada com sucesso!!`);

    // Limpar os campos
    document.querySelector(".nome-receita").value = "";
    document.querySelector(".ingredientes-receita").value = "";
    document.querySelector(".modo-preparo-receita").value = "";
}

function deletarReceita(id) {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
        axios.delete(`http://localhost:3000/receitas/${id}`)
            .then(() => {
                alert("Receita excluída com sucesso!");
                buscarReceitas(); 
            })
            .catch(tratarErro); 
    }
}

function tratarErro(erro) {
    if (erro.response && erro.response.status) {
        const statusCode = erro.response.status;
        const mensagemErro = erro.response.data.error || "Erro desconhecido.";
        switch (statusCode) {
            case 400:
                alert(`Erro ${statusCode}: Requisição inválida.`);
                break;
            case 401:
                alert(`Erro ${statusCode}: Não autorizado.`);
                break;
            case 404:
                alert(`Erro ${statusCode}: Não encontrado.`);
                break;
            case 500:
                alert(`Erro ${statusCode}: Erro interno do servidor.`);
                break;
            default:
                alert(`Erro desconhecido (${statusCode}): ${mensagemErro}`);
        }
    } else if (erro.request) {
        alert("Erro: Não foi possível conectar ao servidor.");
    } else {
        alert("Erro desconhecido. Consulte o console para mais detalhes.");
    }
}


document.addEventListener("DOMContentLoaded", buscarReceitas);
