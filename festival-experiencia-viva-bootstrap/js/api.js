// Altere este endereço caso a API Laravel esteja em outra máquina ou porta.
const API_URL = "http://127.0.0.1:8000/api";

async function requisicao(caminho, metodo = "GET", dados = null) {
    const opcoes = {
        method: metodo,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    };

    if (dados !== null) {
        opcoes.body = JSON.stringify(dados);
    }

    let resposta;
    try {
        resposta = await fetch(`${API_URL}${caminho}`, opcoes);
    } catch {
        throw new Error("Não foi possível conectar à API. Verifique se o Laravel está em execução e se o endereço está correto.");
    }

    if (resposta.status === 204) return null;

    const texto = await resposta.text();
    let resultado = null;

    try {
        resultado = texto ? JSON.parse(texto) : null;
    } catch {
        resultado = null;
    }

    if (!resposta.ok) {
        const erros = resultado?.errors
            ? Object.values(resultado.errors).flat().join(" ")
            : null;

        throw new Error(erros || resultado?.message || `Erro na requisição (${resposta.status}).`);
    }

    return resultado;
}

function extrairLista(resultado) {
    // Aceita tanto uma lista JSON simples quanto a paginação padrão do Laravel.
    if (Array.isArray(resultado)) return resultado;
    if (Array.isArray(resultado?.data)) return resultado.data;
    return [];
}

export const api = {
    listar: async (rota) => extrairLista(await requisicao(rota)),
    criar: (rota, dados) => requisicao(rota, "POST", dados),
    atualizar: (rota, id, dados) => requisicao(`${rota}/${id}`, "PUT", dados),
    excluir: (rota, id) => requisicao(`${rota}/${id}`, "DELETE")
};
