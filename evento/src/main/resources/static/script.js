const API_URL = "http://localhost:8080/eventos"

const inputId = document.getElementById("evento-id");
const inputNome = document.getElementById("nome");
const inputLocal = document.getElementById("local");
const inputData = document.getElementById("data");
const inputDescricao = document.getElementById("descricao");

const formTitulo = document.getElementById("form-titulo");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");

const mensagem = document.getElementById("mensagem");
const listaEventos = document.getElementById("lista-eventos");

const buscaId = document.getElementById("busca-id");
const btnBuscar = document.getElementById("btn-buscar");
const btnListarTodos = document.getElementById("btn-listar-todos");
const btnRecarregar = document.getElementById("btn-recarregar");

document.addEventListener("DOMContentLoaded", () => {
    carregarEventos();

    btnSalvar.addEventListener("click", salvarOuAtualizarEvento);
    btnCancelar.addEventListener("click", cancelarEdicao);
    btnBuscar.addEventListener("click", buscarEventoPorId);
    btnListarTodos.addEventListener("click", carregarEventos);
    btnRecarregar.addEventListener("click", carregarEventos);
});

function limparFormulario() {
    inputId.value = "";
    inputNome.value = "";
    inputLocal.value = "";
    inputData.value = "";
    inputDescricao.value = "";

    limparErrosCampos();
}

function limparErrosCampos() {
    document.getElementById("erro-nome").textContent = "";
    document.getElementById("erro-local").textContent = ""; // Corrigido: "erro-locao" para "erro-local"
    document.getElementById("erro-data").textContent = "";
    document.getElementById("erro-descricao").textContent = "";
}

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.classList.remove("hidden");
}

function esconderMensagem() {
    mensagem.textContent = "";
    mensagem.className = "mensagem hidden";
}

function entrarModoEdicao(evento) { // Adicionado parâmetro 'evento'
    inputId.value = evento.id;
    inputNome.value = evento.nome;
    inputLocal.value = evento.local; // Corrigido: inputLocal = evento.local para inputLocal.value
    inputData.value = evento.data;
    inputDescricao.value = evento.descricao;

    formTitulo.textContent = "Editar Evento";
    btnSalvar.textContent = "Atualizar";

    btnCancelar.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelarEdicao() {
    limparFormulario();
    formTitulo.textContent = "Cadastrar Evento";
    btnSalvar.textContent = "Salvar";
    btnCancelar.classList.add("hidden");

    esconderMensagem();
}

function obterDadosFormulario() {
    return {
        nome: inputNome.value.trim(),
        local: inputLocal.value.trim(),
        data: inputData.value,
        descricao: inputDescricao.value.trim()
    };
}

async function salvarOuAtualizarEvento() {
    esconderMensagem();
    limparErrosCampos(); // Corrigido: faltavam os parênteses

    const id = inputId.value;
    const evento = obterDadosFormulario();

    const metodo = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL; // Corrigido: ${Id} para ${id}

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { // Corrigido: faltava a abertura de chaves do headers
                "Content-Type": "application/json" // Corrigido: aspas duplicadas
            },
            body: JSON.stringify(evento)
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            tratarErroApi(data, response.status);
            return;
        }
        mostrarMensagem(
            id ? "Evento atualizado com sucesso." : "Evento cadastrado com sucesso.", "sucesso");

        cancelarEdicao();
        await carregarEventos();
    } catch (error) {
        console.error("Erro ao conectar com a API", error);
        mostrarMensagem("Erro ao conectar com a API", "erro");
    }
} // Fechamento correto da função

// Funções auxiliares que faltavam (adicione conforme necessidade)
async function carregarEventos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar eventos");
        const eventos = await response.json();
        exibirEventos(eventos);
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
        mostrarMensagem("Erro ao carregar eventos", "erro");
    }
}

function exibirEventos(eventos) {
    if (!listaEventos) return;
    
    if (eventos.length === 0) {
        listaEventos.innerHTML = "<p>Nenhum evento cadastrado.</p>";
        return;
    }
    
    listaEventos.innerHTML = eventos.map(evento => `
        <div class="evento-item">
            <h3>${evento.nome}</h3>
            <p><strong>Local:</strong> ${evento.local}</p>
            <p><strong>Data:</strong> ${new Date(evento.data).toLocaleDateString()}</p>
            <p><strong>Descrição:</strong> ${evento.descricao}</p>
            <button onclick="editarEvento(${evento.id})">Editar</button>
            <button onclick="excluirEvento(${evento.id})">Excluir</button>
        </div>
    `).join('');
}

async function buscarEventoPorId() {
    const id = buscaId?.value;
    if (!id) {
        mostrarMensagem("Digite um ID para buscar", "erro");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Evento não encontrado");
        const evento = await response.json();
        exibirEventos([evento]);
    } catch (error) {
        mostrarMensagem("Evento não encontrado", "erro");
    }
}

function tratarErroApi(data, status) {
    if (status === 400 && data?.errors) {
        Object.keys(data.errors).forEach(campo => {
            const erroElement = document.getElementById(`erro-${campo}`);
            if (erroElement) erroElement.textContent = data.errors[campo];
        });
        mostrarMensagem("Erro de validação", "erro");
    } else {
        mostrarMensagem(data?.message || "Erro ao processar requisição", "erro");
    }
}