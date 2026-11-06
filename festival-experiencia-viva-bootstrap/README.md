# Festival Experiência Viva — Frontend Bootstrap

Frontend simples em HTML, Bootstrap 5 e JavaScript puro para consumir a API Laravel do projeto.

## Estrutura

```text
frontend/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── api.js
    └── app.js
```

## 1. Pré-requisitos

- API Laravel do projeto em execução.
- Rotas REST disponíveis em `/api`.
- Navegador atualizado.
- Conexão com a internet para carregar o Bootstrap pelo CDN.

## 2. Configurar o endereço da API

Abra `js/api.js` e ajuste:

```js
const API_URL = "http://127.0.0.1:8000/api";
```

Use o endereço em que o Laravel estiver sendo executado.

## 3. Executar o frontend

Não abra `index.html` diretamente com `file://`, pois o navegador pode bloquear os módulos JavaScript.

Uma opção é abrir a pasta `frontend` no VS Code e iniciar o **Live Server**. Outra opção, se o PHP estiver instalado, é executar na pasta do frontend:

```bash
php -S localhost:5500
```

Depois acesse `http://localhost:5500`.

## 4. Rotas esperadas na API

| Método | Endpoint | Finalidade |
|---|---|---|
| GET | `/api/participantes` | Listar participantes |
| POST | `/api/participantes` | Cadastrar participante |
| PUT | `/api/participantes/{id}` | Atualizar participante |
| DELETE | `/api/participantes/{id}` | Excluir participante |
| GET | `/api/atividades` | Listar atividades |
| POST | `/api/atividades` | Cadastrar atividade |
| PUT | `/api/atividades/{id}` | Atualizar atividade |
| DELETE | `/api/atividades/{id}` | Excluir atividade |
| GET | `/api/inscricoes` | Listar inscrições |
| POST | `/api/inscricoes` | Criar inscrição |
| DELETE | `/api/inscricoes/{id}` | Cancelar inscrição |

## 5. Formato dos dados esperado

### Participantes

```json
{
  "id": 1,
  "nome": "Mariana Costa",
  "email": "mariana@email.com"
}
```

### Atividades

```json
{
  "id": 1,
  "nome": "Oficina de tecnologia",
  "descricao": "Atividade demonstrativa",
  "vagas_maximas": 30
}
```

### Inscrições

```json
{
  "id": 1,
  "participante_id": 1,
  "atividade_id": 1,
  "participante": {
    "id": 1,
    "nome": "Mariana Costa"
  },
  "atividade": {
    "id": 1,
    "nome": "Oficina de tecnologia"
  }
}
```

As listagens podem retornar diretamente um array JSON ou o formato paginado do Laravel (`{"data": [...]}`).

## 6. CORS

Se o frontend e a API estiverem em portas diferentes, configure o CORS no Laravel para permitir a origem do frontend (por exemplo, `http://localhost:5500`).

## 7. Regras de negócio

As regras devem ser validadas no backend, não apenas na interface:

- E-mail de participante não pode se repetir.
- Participante não pode se inscrever duas vezes na mesma atividade.
- Não pode haver inscrição acima do limite de vagas.
- Atividade com inscrições não pode ser excluída.
- Excluir participante deve remover somente as inscrições desse participante.

A interface exibe as mensagens de erro retornadas pela API.

## Observações

- O projeto não implementa login, pois ele não é requisito explícito das regras de negócio do projeto-teste.
- O painel consolidado fica para o Módulo D.
- Os campos e nomes dos endpoints precisam corresponder aos controllers e rotas efetivamente implementados no backend.
