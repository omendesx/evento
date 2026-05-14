const API_URL = "http://localhost:8080/eventos"

const inputId = document.getElementById("evento-id");
const inputNome= document.getElementById("nome");
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

document.addEventListener("DOMContentLoaded", ()=>{
    carregarEventos();

    btnSalvar.addEventListener("click", salvarOuAtualizarEvento);
    btnCancelar.addEventListener("click", cancelarEdicao);
    btnBuscar.addEventListener("click", buscarEventoPorId);
    btnListarTodos.addEventListener("click", carregarEventos);
    btnRecarregar.addEventListener("click", carregarEventos);
});

function limparFormulario(){
    inputId.value= "";
    inputNome.value="";
    inputLocal.value="";
    inputData.value="";
    inputDescricao.value="";

    limparErrosCampos();
}

function limparErrosCampos(){
    document.getElementById("erro-nome").textContent = ";"
    document.getElementById("erro-locao").textContent = ";"
    document.getElementById("erro-data").textContent = ";"
    document.getElementById("erro-descricao").textContent = ";"
}

function mostrarMensagem(texto, tipo){

    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
    mensagem.classList.remove("hidden");
}

function esconderMensagem(){
    mensagem.textContent = "";
    mensagem.className = "mensagem hidden";
}

function entrarModoEdicao(){

    inputId.value = evento.id;
    inputNome.value = evento.nome;
    inputLocal = evento.local;
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

function cancelarEdicao(){
    limparFormulario();
    formTitulo.textContent= "Cadastrar Evento";
    btnSalvar.textContent = "Salvar";

    btnCancelar.classList.add("hidden");

    esconderMensagem ();
}

function obterDadosFormulario(){
    return{
        nome: inputNome.value.trim(),
        local: inputLocal.value.trim(),
        data: inputData.value,
        descricao: inputDescricao.value.trim()
    };
}
