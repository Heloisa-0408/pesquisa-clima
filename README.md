# Pesquisa de Clima Organizacional — Jaraguá Contabilidade

Site estático (GitHub Pages) com formulário anônimo e relatório analítico.

- **Pesquisa:** `index.html` — link para enviar à equipe
- **Relatório:** `relatorio.html` — protegido por senha

## Como funciona

| Item | Detalhe |
|---|---|
| Anonimato | Não pede nome, e-mail nem qualquer dado. Grava apenas a **data** (sem horário). |
| Uma resposta por pessoa | Após enviar, o dispositivo/navegador fica bloqueado para nova resposta (cookie + armazenamento local). |
| Relatório | Índice de favorabilidade, ranking de prioridades, plano de ação sugerido, distribuição por afirmação, temas e palavras mais citados, comentários filtráveis, exportação CSV e impressão/PDF. |
| Testes | No relatório, seção **Gerenciar**: excluir respostas individuais ou todas, e liberar o dispositivo para responder de novo. |

## Modo demonstração (padrão)

Enquanto `SCRIPT_URL` em `config.js` estiver vazio, as respostas ficam **apenas no navegador** de quem respondeu.
Serve para testar o fluxo. Senha do relatório no modo demonstração: `admin`.

## Ativar o armazenamento real (Planilha Google) — ~5 minutos

1. Crie uma planilha nova em <https://sheets.new> (ex.: "Pesquisa de Clima - Respostas").
2. Menu **Extensões → Apps Script**. Apague o conteúdo e cole o arquivo `apps-script/Code.gs`.
3. Na linha `const SENHA_ADMIN = 'TROQUE-ESTA-SENHA';` defina a senha do relatório. Salve.
4. Clique em **Implantar → Nova implantação** → tipo **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique em **Implantar** e autorize o acesso.
5. Copie a **URL do app da Web** (termina em `/exec`).
6. No GitHub, edite `config.js` e cole a URL em `SCRIPT_URL: "..."`. Salve (commit).
7. Em ~1 minuto o site passa a gravar na planilha. Acesse `relatorio.html` com a senha do passo 3.

> As respostas ficam na planilha da sua conta Google. A senha só é validada no servidor (Apps Script), então ninguém lê as respostas pelo site sem ela.

## Nova rodada da pesquisa

Troque `EDICAO` em `config.js` (ex.: `"2027-1"`) para liberar todos os dispositivos, e limpe as respostas antigas no relatório (ou crie outra planilha).

## Limitação importante

Como a pesquisa é anônima, o bloqueio de "uma resposta" é feito **por dispositivo/navegador**. Alguém que use outro aparelho ou modo anônimo do navegador consegue responder de novo. Para uso interno isso costuma ser suficiente; a seção Gerenciar permite remover respostas claramente duplicadas.
