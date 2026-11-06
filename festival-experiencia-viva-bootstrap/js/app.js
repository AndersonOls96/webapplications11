import { api } from "./api.js";

const conteudo = document.querySelector("#conteudo");
const mensagens = document.querySelector("#mensagens");
const modalElemento = document.querySelector("#modalFormulario");
const modal = new bootstrap.Modal(modalElemento);
const formulario = document.querySelector("#formulario");
const camposFormulario = document.querySelector("#camposFormulario");

let participantes = [];
let atividades = [];
let inscricoes = [];
let tipoFormulario = "";
let idEmEdicao = null;

const rotas = {
    participantes: "/participantes",
    atividades: "/atividades",
    inscricoes: "/inscricoes"
};

function escapar(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#039;"
    })[caractere]);
}

function mostrarMensagem(texto, tipo = "success") {
    mensagens.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${escapar(texto)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarErro(erro) {
    mostrarMensagem(erro.message || "Ocorreu um erro.", "danger");
}

function cabecalho(titulo, descricao, botaoTexto, acao) {
    return `
        <div class="d-flex justify-content-between align-items-center page-title mb-4">
            <div>
                <h1 class="h3 mb-1">${titulo}</h1>
                <p class="text-secondary mb-0">${descricao}</p>
            </div>
            <button class="btn btn-primary" data-acao="${acao}">${botaoTexto}</button>
        </div>`;
}

function estadoVazio(texto, colspan) {
    return `<tr><td colspan="${colspan}" class="text-center text-secondary py-4">${texto}</td></tr>`;
}

async function carregarDados() {
    [participantes, atividades, inscricoes] = await Promise.all([
        api.listar(rotas.participantes),
        api.listar(rotas.atividades),
        api.listar(rotas.inscricoes)
    ]);
}

async function navegar() {
    mensagens.innerHTML = "";
    const pagina = location.hash.replace("#", "") || "participantes";

    conteudo.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="text-secondary mt-2">Carregando informações...</p>
        </div>`;

    try {
        if (pagina === "participantes") {
            participantes = await api.listar(rotas.participantes);
            renderParticipantes();
        } else if (pagina === "atividades") {
            atividades = await api.listar(rotas.atividades);
            renderAtividades();
        } else if (pagina === "inscricoes") {
            await carregarDados();
            renderInscricoes();
        } else {
            conteudo.innerHTML = `<div class="alert alert-warning">Página não encontrada.</div>`;
        }

        document.querySelectorAll(".navbar .nav-link").forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${pagina}`);
            if (link.classList.contains("active")) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
    } catch (erro) {
        conteudo.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h2 class="h5">Não foi possível carregar a página</h2>
                <p class="mb-0">${escapar(erro.message)}</p>
            </div>`;
    }
}

function renderParticipantes() {
    conteudo.innerHTML = `
        ${cabecalho("Participantes", "Gerencie os participantes do festival.", "Novo participante", "novo-participante")}
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr><th>Nome</th><th>E-mail</th><th class="text-end">Ações</th></tr>
                        </thead>
                        <tbody>
                            ${participantes.length ? participantes.map(p => `
                                <tr>
                                    <td>${escapar(p.nome)}</td>
                                    <td>${escapar(p.email)}</td>
                                    <td class="text-end text-nowrap">
                                        <button class="btn btn-sm btn-outline-primary me-1"
                                            data-acao="editar-participante" data-id="${Number(p.id)}">Editar</button>
                                        <button class="btn btn-sm btn-outline-danger"
                                            data-acao="excluir-participante" data-id="${Number(p.id)}">Excluir</button>
                                    </td>
                                </tr>`).join("") : estadoVazio("Nenhum participante cadastrado.", 3)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

function renderAtividades() {
    conteudo.innerHTML = `
        ${cabecalho("Atividades", "Gerencie as atividades e a quantidade de vagas.", "Nova atividade", "nova-atividade")}
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr><th>Atividade</th><th>Descrição</th><th>Vagas</th><th class="text-end">Ações</th></tr>
                        </thead>
                        <tbody>
                            ${atividades.length ? atividades.map(a => `
                                <tr>
                                    <td>${escapar(a.nome)}</td>
                                    <td>${escapar(a.descricao || "-")}</td>
                                    <td>${Number(a.vagas_maximas ?? 0)}</td>
                                    <td class="text-end text-nowrap">
                                        <button class="btn btn-sm btn-outline-primary me-1"
                                            data-acao="editar-atividade" data-id="${Number(a.id)}">Editar</button>
                                        <button class="btn btn-sm btn-outline-danger"
                                            data-acao="excluir-atividade" data-id="${Number(a.id)}">Excluir</button>
                                    </td>
                                </tr>`).join("") : estadoVazio("Nenhuma atividade cadastrada.", 4)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

function nomeParticipante(id) {
    const p = participantes.find(item => Number(item.id) === Number(id));
    return p?.nome || "Participante não localizado";
}

function nomeAtividade(id) {
    const a = atividades.find(item => Number(item.id) === Number(id));
    return a?.nome || "Atividade não localizada";
}

function renderInscricoes() {
    conteudo.innerHTML = `
        ${cabecalho("Inscrições", "Inscreva participantes nas atividades e consulte os registros.", "Nova inscrição", "nova-inscricao")}
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr><th>Participante</th><th>Atividade</th><th class="text-end">Ações</th></tr>
                        </thead>
                        <tbody>
                            ${inscricoes.length ? inscricoes.map(i => `
                                <tr>
                                    <td>${escapar(i.participante?.nome || nomeParticipante(i.participante_id))}</td>
                                    <td>${escapar(i.atividade?.nome || nomeAtividade(i.atividade_id))}</td>
                                    <td class="text-end">
                                        <button class="btn btn-sm btn-outline-danger"
                                            data-acao="cancelar-inscricao" data-id="${Number(i.id)}">Cancelar</button>
                                    </td>
                                </tr>`).join("") : estadoVazio("Nenhuma inscrição cadastrada.", 3)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

function abrirModal(titulo, tipo, campos, registro = null) {
    tipoFormulario = tipo;
    idEmEdicao = registro?.id ?? null;
    document.querySelector("#tituloModal").textContent = titulo;
    camposFormulario.innerHTML = campos(registro);
    modal.show();
}

function campoTexto(nome, rotulo, valor = "", tipo = "text", obrigatorio = true, atributo = "") {
    return `
        <div class="mb-3">
            <label for="${nome}" class="form-label">${rotulo}</label>
            <input class="form-control" id="${nome}" name="${nome}" type="${tipo}"
                value="${escapar(valor)}" ${obrigatorio ? "required" : ""} ${atributo}>
        </div>`;
}

function campoArea(nome, rotulo, valor = "") {
    return `
        <div class="mb-3">
            <label for="${nome}" class="form-label">${rotulo}</label>
            <textarea class="form-control" id="${nome}" name="${nome}" rows="3">${escapar(valor)}</textarea>
        </div>`;
}

function campoSelect(nome, rotulo, lista, selecionado, textoVazio) {
    return `
        <div class="mb-3">
            <label for="${nome}" class="form-label">${rotulo}</label>
            <select class="form-select" id="${nome}" name="${nome}" required>
                <option value="">${textoVazio}</option>
                ${lista.map(item => `
                    <option value="${Number(item.id)}" ${Number(item.id) === Number(selecionado) ? "selected" : ""}>
                        ${escapar(item.nome)}
                    </option>`).join("")}
            </select>
        </div>`;
}

function novoParticipante(registro = null) {
    abrirModal(registro ? "Editar participante" : "Novo participante", "participante", () => `
        ${campoTexto("nome", "Nome", registro?.nome || "")}
        ${campoTexto("email", "E-mail", registro?.email || "", "email")}
    `, registro);
}

function novaAtividade(registro = null) {
    abrirModal(registro ? "Editar atividade" : "Nova atividade", "atividade", () => `
        ${campoTexto("nome", "Nome da atividade", registro?.nome || "")}
        ${campoArea("descricao", "Descrição", registro?.descricao || "")}
        ${campoTexto("vagas_maximas", "Quantidade máxima de vagas", registro?.vagas_maximas ?? "", "number", true, 'min="1" step="1"')}
    `, registro);
}

function novaInscricao() {
    if (!participantes.length || !atividades.length) {
        mostrarMensagem("Cadastre pelo menos um participante e uma atividade antes de realizar inscrições.", "warning");
        return;
    }

    abrirModal("Nova inscrição", "inscricao", () => `
        ${campoSelect("participante_id", "Participante", participantes, "", "Selecione um participante")}
        ${campoSelect("atividade_id", "Atividade", atividades, "", "Selecione uma atividade")}
    `);
}

async function salvarFormulario(evento) {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const dados = Object.fromEntries(new FormData(formulario).entries());

    try {
        const botao = document.querySelector("#botaoSalvar");
        botao.disabled = true;
        botao.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Salvando...`;

        if (tipoFormulario === "participante") {
            await (idEmEdicao
                ? api.atualizar(rotas.participantes, idEmEdicao, dados)
                : api.criar(rotas.participantes, dados));
        } else if (tipoFormulario === "atividade") {
            dados.vagas_maximas = Number(dados.vagas_maximas);
            await (idEmEdicao
                ? api.atualizar(rotas.atividades, idEmEdicao, dados)
                : api.criar(rotas.atividades, dados));
        } else if (tipoFormulario === "inscricao") {
            dados.participante_id = Number(dados.participante_id);
            dados.atividade_id = Number(dados.atividade_id);
            await api.criar(rotas.inscricoes, dados);
        }

        modal.hide();
        await navegar();
        mostrarMensagem("Operação realizada com sucesso.");
    } catch (erro) {
        mostrarErro(erro);
    } finally {
        const botao = document.querySelector("#botaoSalvar");
        botao.disabled = false;
        botao.textContent = "Salvar";
    }
}

async function excluir(rota, id, confirmacao, sucesso) {
    if (!window.confirm(confirmacao)) return;

    try {
        await api.excluir(rota, id);
        await navegar();
        mostrarMensagem(sucesso);
    } catch (erro) {
        mostrarErro(erro);
    }
}

conteudo.addEventListener("click", async evento => {
    const botao = evento.target.closest("[data-acao]");
    if (!botao) return;

    const acao = botao.dataset.acao;
    const id = Number(botao.dataset.id);

    if (acao === "novo-participante") novoParticipante();
    if (acao === "nova-atividade") novaAtividade();
    if (acao === "nova-inscricao") {
        try {
            await carregarDados();
            novaInscricao();
        } catch (erro) {
            mostrarErro(erro);
        }
    }

    if (acao === "editar-participante") {
        const registro = participantes.find(p => Number(p.id) === id);
        if (registro) novoParticipante(registro);
    }

    if (acao === "editar-atividade") {
        const registro = atividades.find(a => Number(a.id) === id);
        if (registro) novaAtividade(registro);
    }

    if (acao === "excluir-participante") {
        await excluir(rotas.participantes, id,
            "Deseja realmente excluir este participante?",
            "Participante excluído com sucesso.");
    }

    if (acao === "excluir-atividade") {
        await excluir(rotas.atividades, id,
            "Deseja realmente excluir esta atividade?",
            "Atividade excluída com sucesso.");
    }

    if (acao === "cancelar-inscricao") {
        await excluir(rotas.inscricoes, id,
            "Deseja realmente cancelar esta inscrição?",
            "Inscrição cancelada com sucesso.");
    }
});

formulario.addEventListener("submit", salvarFormulario);
window.addEventListener("hashchange", navegar);

navegar();
