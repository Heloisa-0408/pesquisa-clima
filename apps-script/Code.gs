/**
 * PESQUISA DE CLIMA — Backend em Google Apps Script
 * Armazena as respostas anônimas em uma Planilha Google.
 * Veja o passo a passo de instalação no README.md.
 */

// >>> TROQUE ESTA SENHA antes de publicar. Ela protege o relatório. <<<
const SENHA_ADMIN = 'TROQUE-ESTA-SENHA';

const ABA = 'Respostas';
const LIKERT = ['q1','q2','q3','q4','q5','q6','q7','q8'];
const ABERTAS = ['t1','t2'];
const COLUNAS = ['id','data'].concat(LIKERT, ABERTAS);
const CABECALHO = ['id','data',
  '1. Clareza de papel','2. Estrutura e ferramentas','3. Liderança','4. Comunicação interna',
  '5. Relacionamento entre colegas','6. Carga de trabalho','7. Reconhecimento','8. Motivação',
  'Uma coisa a mudar','Problemas e barreiras'];

function aba_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(CABECALHO);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold').setBackground('#004867').setFontColor('#ffffff');
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return json_({ ok: true, status: 'online' });
}

function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, erro: 'Requisição inválida.' }); }

  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (err) { return json_({ ok: false, erro: 'Servidor ocupado, tente novamente.' }); }
  try {
    switch (b.acao) {
      case 'enviar':     return json_(enviar_(b.resposta));
      case 'listar':     return autorizado_(b) ? json_(listar_()) : json_({ ok: false, erro: 'Senha inválida.' });
      case 'excluir':    return autorizado_(b) ? json_(excluir_(b.id)) : json_({ ok: false, erro: 'Senha inválida.' });
      case 'limparTudo': return autorizado_(b) ? json_(limparTudo_()) : json_({ ok: false, erro: 'Senha inválida.' });
      default:           return json_({ ok: false, erro: 'Ação desconhecida.' });
    }
  } finally {
    lock.releaseLock();
  }
}

function autorizado_(b) {
  return SENHA_ADMIN && SENHA_ADMIN !== 'TROQUE-ESTA-SENHA' && b.senha === SENHA_ADMIN;
}

// Evita que um texto seja interpretado como fórmula na planilha
function seguro_(s) {
  s = String(s || '').trim().slice(0, 3000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function enviar_(r) {
  if (!r) return { ok: false, erro: 'Resposta vazia.' };
  const linha = [Utilities.getUuid().slice(0, 8),
                 Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyy-MM-dd')]; // só a data, sem horário (anonimato)
  for (const k of LIKERT) {
    const n = Number(r[k]);
    if (!(n >= 1 && n <= 5 && Math.floor(n) === n)) return { ok: false, erro: 'Responda todas as afirmações.' };
    linha.push(n);
  }
  for (const k of ABERTAS) {
    if (!r[k] || !String(r[k]).trim()) return { ok: false, erro: 'Responda as perguntas abertas.' };
    linha.push(seguro_(r[k]));
  }
  aba_().appendRow(linha);
  return { ok: true };
}

function listar_() {
  const sh = aba_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return { ok: true, respostas: [] };
  const vals = sh.getRange(2, 1, n, COLUNAS.length).getValues();
  const respostas = vals.filter(v => v[0] !== '').map(v => {
    const o = {};
    COLUNAS.forEach((c, i) => {
      let x = v[i];
      if (c === 'data' && x instanceof Date) x = Utilities.formatDate(x, 'America/Sao_Paulo', 'yyyy-MM-dd');
      if (typeof x === 'string' && x.charAt(0) === "'") x = x.slice(1);
      o[c] = x;
    });
    return o;
  });
  return { ok: true, respostas: respostas };
}

function excluir_(id) {
  const sh = aba_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return { ok: false, erro: 'Resposta não encontrada.' };
  const ids = sh.getRange(2, 1, n, 1).getValues();
  for (let i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(id)) { sh.deleteRow(i + 2); return { ok: true }; }
  }
  return { ok: false, erro: 'Resposta não encontrada.' };
}

function limparTudo_() {
  const sh = aba_();
  const n = sh.getLastRow() - 1;
  if (n > 0) sh.deleteRows(2, n);
  return { ok: true };
}
