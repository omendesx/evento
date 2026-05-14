//Comunicação com backend (Fetch)

// URL base da API onde os eventos serão cadastrados, listados, editados e removidos
const API_URL = "http://localhost:8080/eventos";

// Manipulação da interface (DOM)

// Captura os elementos do formulário pelo ID no HTML
const inputId = document.getElementById("evento-id");
const inputNome = document.getElementById("nome");
const inputLocal = document.getElementById("local");
const inputData = document.getElementById("data");
const inputDescricao = document.getElementById("descricao");

// Elementos relacionados ao formulário
const formTitulo = document.getElementById("form-titulo");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");

// Elementos usados para exibir mensagens e lista de eventos
const mensagem = document.getElementById("mensagem");
const listaEventos = document.getElementById("lista-eventos");

//Elementos relacionados á busca de evento por ID
const buscaId = document.getElementById("busca-id");
const btnBuscar = document.getElementById("btn-buscar");
const btnListarTodos = document.getElementById("btn-listar-todos");
const btnRecarregar = document.getElementById("btn-recarregar");

// REGRAS DA APLICAÇÃO

// Executa quando toda a página HTML termina de carregar
document.addEventListener("DOMContentLoaded", ()=>{
    //carrega os eventos automaticamente ao abrir a página
    carregarEventos();

    //Adiciona eventos de clique nos botões
    btnSalvar.addEventListener("click", salvarOuAtualizarEvento);
    btnCancelar.addEventListener("click", cancelarEdicao);
    btnBuscar.addEventListener("click", buscarEventoPorId);
    btnListarTodos.addEventListener("click", carregarEventos);
    btnRecarregar.addEventListener("click", carregarEventos);
});

// Função que limpa todos os campos do formulário
function limparFormulario(){
    inputId.value = "";
    inputNome.value = "";
    inputLocal.value = "";
    inputData.value = "";
    inputDescricao.value = "";

    // Também limpa mensagens de erro dos campos
    limparErrosCampos();
}

// Remove mensagens de erro dos campos do formulário
function limparErrosCampos(){
    document.getElementById("erro-nome").textContent = "";
    document.getElementById("erro-local").textContent = "";
    document.getElementById("erro-data").textContent = "";
    document.getElementById("erro-descricao").textContent = "";
}

// Exibe uma mensagem para o usuário
function mostrarMensagem(texto, tipo) {

    //Define o texto da mensagem
    mensagem.textContent = texto;

    // Define as classes CSS da mensagem
    // Exemplo: "mensagem sucesso" ou "mensagem erro"
    mensagem.className = `mensagem ${tipo}`;

    // Remove a classe "hidden" para deixar visivel
    mensagem.classList.remove("hidden");
}

// Esconde a mensagem da tela
function esconderMensagem(){
    mensagem.textContent = "";
    mensagem.className = "mensagem hidden";
}

// Preenche o formulário com os dados do evento para edição
function entrarModoEdicao(evento) {

    // coloca os dados do evento nos campos
    inputId.value = evento.id;
    inputNome.value = evento.nome;
    inputLocal.value = evento.local;
    inputData.value = evento.data;
    inputDescricao.value = evento.descricao;

    // Altera o titulo e botão para o modo de edição
    formTitulo.textContent = "Editar Evento";
    btnSalvar.textContent = "Atualizar";

    // Mostra o botão cancelar
    btnCancelar.classList.remove("hidden");

    // Faz a página subir suavemente até o topo
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

// Cancela a edição e volta ao modo de cadastro
function cancelarEdicao(){

    // Limpa os campos
    limparFormulario();

    // volta os textos originais
    formTitulo.textContent = "Cadastrar Evento";
    btnSalvar.textContent = "Salvar";

    //Esconde o botão cancelar
    btnCancelar.classList.add("hidden");

    // Esconde mensagens da tela
    esconderMensagem();
}

// Captura os dados digitados no formulario
function obterDadosFormulario(){

    // Retorna um objeto com os dados
    return{
        //trim() remove espaços vazios no começo e fim
        nome: inputNome.value.trim(),
        local: inputLocal.value.trim(),
        data: inputData.value,
        descricao: inputDescricao.value.trim()
    };
}

// COMUNICAÇÃO COM BACKEND (FETCH)
// Função responsável por salvar ou atualizar um evento
async function salvarOuAtualizarEvento() {
    
    esconderMensagem();
    limparErrosCampos();

    // Verifica se existe ID;
    // Se existir = edição
    // Se não existir = novo cadastro
    const id = inputId.value;

    // Obtém os dados do formulário
    const evento = obterDadosFormulario();

    // Define o método HTTP
    // POST = criar
    // PUT = atualizar
    const metodo = id ? "PUT":"POST";

    // Define a URL correta
    const url = id ? `${API_URL}/${id}`: API_URL;

    try {
        // Faz requisição para a API
        const response = await fetch(url, {
            method: metodo,

            // Informa que está enviando JSON
            headers:{
                "Content-Type": "application/json"
            },

            //Converte objeto js em JSON
            body:JSON.stringify(evento)
        });

        // Converte resposta da API para objeto js
        const data = await response.json().catch(()=>null);

        // Se houver erro de requisição
        if(!response.ok){
            tratarErroDaApi(data, response.status);
            return;
        }
        // Mostrar mensagem de sucesso
        mostrarMensagem(
            id? "Evento atualizado com sucesso.":"Evento cadastrado com sucesso.","sucesso"
        );

        // limpa formulário e recarrega lista
        cancelarEdicao();
        await carregarEventos();

    } catch (error){

        // Captura erros de conexão
        console.error("Erro ao conectar com a API:", error);
        mostrarMensagem("Erro ao conectar com a API.","erro");
    }
}

// REGRAS DA APLICAÇÃO

// Tratar erros retornados pela API
function tratarErroDaApi(data, status){

    limparErrosCampos();

    // Verifica se o erro é de validação
    if(status === 400 && data && data.mensagens){
        const mensagens = data.mensagens;

        // Exibe mensagens de erro em cada campo
        if(mensagens.nome){
            document.getElementById("erro-nome").textContent = mensagens.nome;
        }

         if(mensagens.local){
            document.getElementById("erro-local").textContent = mensagens.local;
        }

         if(mensagens.data){
            document.getElementById("erro-data").textContent = mensagens.data;
        }

         if(mensagens.descricao){
            document.getElementById("erro-descricao").textContent = mensagens.descricao;
        }

        mostrarMensagem("Verifique os campos do formulário.", "erro");
        return;
    }

    // Mostra mensagem retornada pela API
    if(data&&data.mensagem){
        mostrarMensagem(data.mensagem, "erro");
    }

    // Mensagem padrão de erro
    mostrarMensagem("Ocorreu um erro ao processar a requisição.", "erro");
}

// COMUNICAÇÃO COM O BACKEND (FETCH)

// Carrega todos os eventos da API
async function carregarEventos() {
    
    esconderMensagem();

    try{

        // Faz requisição GET
        const response = await fetch(API_URL);

        // Converte resposta para JSON
        const eventos = await response.json();

        // Verifica erro
        if(!response.ok){
            mostrarMensagem("Erro ao carregar eventos.", "erro");
            return;
        }

        // Mostra os eventos na tela
        renderizarLista(eventos);

    } catch(error){
        console.error("Erro ao carregar eventos:",error);
        mostrarMensagem("Erro ao conectar com a API.", "erro");
    }
}

// Busca um evento especifico pelo ID
async function buscarEventoPorId(){

    esconderMensagem();

    // Obtém ID digitado
    const id = buscaId.value.trim();

    // Verifica se o usuário digitou algo
    if(!id){
        mostrarMensagem("Digite um ID para buscar.", "erro");
        return;
    }

    try {
        // Buscar evento pelo ID
        const response = await fetch(`${API_URL}/${id}`);

        const data = await response.json().catch(()=>null);

        // Verifica erro
        if(!response.ok){
            tratarErroDaApi(data, response.status);
            return;
        }

        // Renderiza apenas o evento encontrado
        renderizarLista([data]);

        mostrarMensagem(`Evento ${id} encontrado com sucesso.`,"sucesso");
    } catch (error){

        console.error("Erro ao buscar evento:", error);
        mostrarMensagem("Erro ao conectar com a API.", "erro");
    }
}

// MANIPULAÇÃO DA INTERFACE (DOM)

// Exibe os eventos da tela
function renderizarLista(eventos){

    //Limpa lista antes de renderizar novamente
    listaEventos.innerHTML = "";

    // Verifica se existem eventos
    if(!eventos || eventos.length === 0){
        // Mostra mensagem caso não existam eventos
        listaEventos.innerHTML = `<p class="sem-eventos">Nenhum evento cadastrado.</p>`;
        return;
    }

    // Percorre todos os eventos 
    eventos.forEach((evento)=>{

        // Cria uma div para cada evento
        const card = document.createElement("div");

        card.className = "evento-card";

        // Cria o HTML do card
        card.innerHTML = `
        <h3>${escapeHTML(evento.nome)}</h3>
        <p><strong>ID:</strong>${evento.id}</p>
        <p><strong>Local</strong> ${escapeHTML(evento.local)}</p>
        <p><strong>Data</strong> ${formatarData(evento.data)}</p>
        <p><strong>Descrição:</strong> ${escapeHTML(evento.descricao)}</p>
        <div class="acoes-card">
       <button type="button" class="btn-editar">Editar</button>
       <button type="button" class="btn-excluir">Deletar</button>
        </div>`;

        // Captura dos botões dentro do card
        const btnEditar = card.querySelector(".btn-editar");
        const btnExcluir = card.querySelector(".btn-excluir");

        // Evento de clique para editar
        btnEditar.addEventListener("click",() => entrarModoEdicao(evento));

        // Evento de clique para excluir
        btnExcluir.addEventListener("click",() => excluirEvento(evento.id));

        // Adiciona o card na lista
        listaEventos.appendChild(card);
    });
}

// COMUNICAÇÃO COM O BACKEND (FETCH)

//Exclui um evento
async function excluirEvento(id){

    // Mostra caixa de confirmação
    const confirmou = confirm(`Deseja realmente deletar o evento de ID ${id}?`);

    // Se usuário cancelar, interrompe função
    if(!confirmou){
        return;
    }

    try {

        // Faz requisição DELETE
        const response = await fetch(`${API_URL}/${id}`,{
            method: "DELETE"
        });

        const data = await response.json().catch(() =>null);

        // Verifica erro
        if (!response.ok){
            tratarErroDaApi(data, response.status);
            return;
        }

        // Mostra mensagem de sucesso
        mostrarMensagem(
            data && data.mensagem ? data.mensagem : "Evento removido com sucesso.", "sucesso"
        );

        // Atualiza lista
        await carregarEventos();
    } catch (error){
        console.error("Erro ao excluir evento:", error);
        mostrarMensagem("Erro ao conectar com a API.", "erro");
    }
}

// REGRAS DA APLICAÇÃO

// formata data de YYYY-MM-DD para DD/MM/YYYY
function formatarData(datalso){

    if(!datalso){
        return "";
    }

    // Divide a data usando "-"
    const [ano, mes, dia] = datalso.split("-");

    // Retorna data formatada
    return `${dia}/${mes}/${ano}`;
}

// Função para evitar inserção de HTML malicioso
function escapeHTML(texto){

    // Verifica se o texto é nulo ou indefinido
    if(texto === null || texto === undefined){
        return "";
    }

    // Converte caracteres especiais em texto seguro
    return String(texto)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
    

}