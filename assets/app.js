/* Núcleo compartilhado: perguntas, dimensões, acesso aos dados */
(function () {
  "use strict";

  const PERGUNTAS = [
    { id: "q1", dim: "Clareza de papel",
      texto: "Eu sei exatamente o que é esperado do meu trabalho e quais são as minhas obrigações diárias.",
      acoes: ["Formalizar a descrição de funções e responsabilidades de cada cargo.",
              "Fazer reuniões curtas de alinhamento de metas e prioridades (semanais ou quinzenais).",
              "Criar checklists e procedimentos padrão para as rotinas recorrentes."] },
    { id: "q2", dim: "Estrutura e ferramentas",
      texto: "Eu tenho as ferramentas e condições físicas necessárias no escritório para trabalhar bem.",
      acoes: ["Levantar com a equipe quais equipamentos, sistemas e acessos estão faltando ou com problema.",
              "Avaliar ergonomia (cadeiras, monitores, iluminação, temperatura e ruído).",
              "Criar um canal simples para solicitar manutenção ou novos recursos, com prazo de retorno."] },
    { id: "q3", dim: "Liderança",
      texto: "Sinto que a liderança é aberta a ouvir minhas ideias e me apoia quando preciso.",
      acoes: ["Instituir conversas individuais (1:1) periódicas entre gestor e colaborador.",
              "Abrir um canal de sugestões e dar retorno sobre o que foi implementado.",
              "Capacitar líderes em escuta ativa e feedback construtivo."] },
    { id: "q4", dim: "Comunicação interna",
      texto: "A comunicação interna é clara e sei o que está acontecendo na empresa sem fofocas ou ruídos.",
      acoes: ["Realizar um encontro geral mensal para compartilhar resultados, mudanças e decisões.",
              "Definir um canal oficial único para comunicados (e-mail, grupo ou mural).",
              "Comunicar mudanças antes de implementá-las, explicando o motivo."] },
    { id: "q5", dim: "Relacionamento entre colegas",
      texto: "O clima entre os colegas de trabalho é amigável, colaborativo e de respeito mútuo.",
      acoes: ["Promover momentos de integração e trabalho em conjunto entre setores.",
              "Estabelecer combinados de convivência e respeito construídos com a equipe.",
              "Tratar conflitos rapidamente, com mediação neutra quando necessário."] },
    { id: "q6", dim: "Carga de trabalho",
      texto: "O volume de tarefas que eu preciso entregar é justo e equilibrado.",
      acoes: ["Mapear o volume de tarefas por pessoa e por período (especialmente nos fechamentos).",
              "Redistribuir demandas e definir critérios claros de prioridade.",
              "Identificar tarefas repetitivas que possam ser automatizadas ou simplificadas."] },
    { id: "q7", dim: "Reconhecimento",
      texto: "Sinto que a empresa reconhece e valoriza a dedicação que eu coloco no meu trabalho.",
      acoes: ["Dar feedback positivo de forma frequente e específica, não só quando há problemas.",
              "Tornar claros os critérios de crescimento, promoção e reajuste.",
              "Celebrar entregas e marcos importantes da equipe."] },
    { id: "q8", dim: "Motivação",
      texto: "No geral, eu me sinto motivado(a) a vir trabalhar aqui todos os dias.",
      acoes: ["Cruzar este resultado com as dimensões mais baixas: a motivação costuma refletir os demais fatores.",
              "Oferecer plano de desenvolvimento e capacitação individual.",
              "Mostrar o impacto do trabalho de cada um nos resultados da empresa e dos clientes."] }
  ];

  const ABERTAS = [
    { id: "t1", texto: "Se você pudesse mudar <strong>apenas uma coisa</strong> na nossa rotina ou ambiente de trabalho hoje para trabalhar melhor, o que seria?",
      curto: "Uma coisa a mudar" },
    { id: "t2", texto: "Existe algum problema, barreira ou insatisfação que esteja atrapalhando o seu rendimento? Se sim, nos conte o que está acontecendo.",
      curto: "Problemas e barreiras" }
  ];

  const ESCALA = ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"];

  // Palavras-chave para classificar respostas abertas por tema (dimensão)
  const TEMAS = {
    "Clareza de papel": ["função","funcao","funções","responsabilidade","atribuição","atribuicao","processo","procedimento","padrão","padrao","organiza","desorganiz","responsavel","responsável","quem faz","quem é responsável","obrigação","obrigacoes","tarefa definida","meta"],
    "Estrutura e ferramentas": ["computador","notebook","pc","máquina","maquina","monitor","cadeira","mesa","sistema","software","internet","rede","wifi","wi-fi","impressora","equipamento","ferramenta","ar condicionado","ar-condicionado","temperatura","calor","frio","barulho","ruído","ruido","espaço","espaco","sala","estrutura","lento","travando","licença","licenca","acesso"],
    "Liderança": ["chefe","gestor","gestora","gerente","liderança","lideranca","líder","lider","diretor","diretoria","sócio","socio","coordenador","supervisor","ouvir","escuta","apoio","autonomia","microgerenc","cobrança","cobranca"],
    "Comunicação interna": ["comunicação","comunicacao","comunicar","informação","informacao","informado","aviso","avisar","fofoca","ruído de comunicação","reunião","reuniao","transparência","transparencia","alinhamento","feedback","boato"],
    "Relacionamento entre colegas": ["colega","colegas","equipe","time","respeito","desrespeito","conflito","briga","clima","ambiente","panelinha","grupo","convivência","convivencia","colaboração","colaboracao","união","uniao","amizade","fofoqueiro"],
    "Carga de trabalho": ["sobrecarga","sobrecarregad","volume","demanda","prazo","prazos","hora extra","horas extras","excesso","acúmulo","acumulo","muito trabalho","cansaço","cansaco","cansad","estress","pressão","pressao","correria","fechamento","falta de tempo","pessoal a mais","contratar","falta de gente"],
    "Reconhecimento": ["reconhecimento","reconhec","valoriza","valorização","valorizacao","salário","salario","remuneração","remuneracao","aumento","reajuste","benefício","beneficio","bônus","bonus","promoção","promocao","plano de carreira","carreira","elogio","premia"],
    "Motivação": ["motivação","motivacao","motivad","desmotiv","desanim","propósito","proposito","crescimento","crescer","desenvolvimento","treinamento","curso","capacitação","capacitacao","aprender","futuro","rotina monótona","monoton","home office","flexibilidade","horário flexível"]
  };

  function normaliza(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  const TEMAS_NORM = Object.fromEntries(
    Object.entries(TEMAS).map(([k, v]) => [k, [...new Set(v.map(normaliza))]])
  );
  function temasDoTexto(txt) {
    const t = " " + normaliza(txt) + " ";
    return Object.keys(TEMAS_NORM).filter(k => TEMAS_NORM[k].some(p => t.includes(p)));
  }

  /* ---------------- Trava de "uma resposta por dispositivo" ---------------- */
  const CHAVE_TRAVA = "clima_respondido_" + CONFIG.EDICAO;
  const Trava = {
    ativa() {
      let ls = false;
      try { ls = localStorage.getItem(CHAVE_TRAVA) === "1"; } catch (e) {}
      return ls || document.cookie.split("; ").includes(CHAVE_TRAVA + "=1");
    },
    marcar() {
      try { localStorage.setItem(CHAVE_TRAVA, "1"); } catch (e) {}
      document.cookie = CHAVE_TRAVA + "=1; max-age=" + 60 * 60 * 24 * 400 + "; path=/; SameSite=Lax";
    },
    liberar() {
      try { localStorage.removeItem(CHAVE_TRAVA); } catch (e) {}
      document.cookie = CHAVE_TRAVA + "=; max-age=0; path=/";
    }
  };

  /* ---------------- Armazenamento de demonstração (localStorage) ---------------- */
  const CHAVE_DEMO = "clima_demo_respostas_" + CONFIG.EDICAO;
  const CHAVE_DEMO_COD = "clima_demo_codigos_" + CONFIG.EDICAO;
  function lerDemo(k) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } }
  function gravarDemo(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function hoje() {
    const d = new Date(); const p = n => String(n).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }
  function novoId() { return Math.random().toString(36).slice(2, 10); }

  const Demo = {
    exigirCodigo: false,
    async chamar(b) {
      await new Promise(r => setTimeout(r, 250));
      const admin = () => b.senha === CONFIG.SENHA_DEMO;
      const lista = lerDemo(CHAVE_DEMO);
      switch (b.acao) {
        case "status": return { ok: true, exigirCodigo: false, demo: true };
        case "enviar": {
          const v = validar(b.resposta); if (v) return { ok: false, erro: v };
          lista.push(Object.assign({ id: novoId(), data: hoje() }, limpar(b.resposta)));
          gravarDemo(CHAVE_DEMO, lista); return { ok: true };
        }
        case "listar": return admin() ? { ok: true, respostas: lista, exigirCodigo: false } : { ok: false, erro: "Senha inválida." };
        case "excluir":
          if (!admin()) return { ok: false, erro: "Senha inválida." };
          gravarDemo(CHAVE_DEMO, lista.filter(r => r.id !== b.id)); return { ok: true };
        case "limparTudo":
          if (!admin()) return { ok: false, erro: "Senha inválida." };
          gravarDemo(CHAVE_DEMO, []); return { ok: true };
        default: return { ok: false, erro: "Ação desconhecida." };
      }
    }
  };

  function validar(r) {
    if (!r) return "Resposta vazia.";
    for (const p of PERGUNTAS) {
      const n = Number(r[p.id]);
      if (!Number.isInteger(n) || n < 1 || n > 5) return "Responda todas as afirmações.";
    }
    for (const a of ABERTAS) {
      if (!r[a.id] || !String(r[a.id]).trim()) return "Responda as perguntas abertas.";
    }
    return null;
  }
  function limpar(r) {
    const o = {};
    PERGUNTAS.forEach(p => o[p.id] = Number(r[p.id]));
    ABERTAS.forEach(a => o[a.id] = String(r[a.id]).trim().slice(0, 3000));
    return o;
  }

  const API = {
    demo: !CONFIG.SCRIPT_URL,
    async chamar(corpo) {
      if (this.demo) return Demo.chamar(corpo);
      try {
        const r = await fetch(CONFIG.SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(corpo),
          redirect: "follow"
        });
        return await r.json();
      } catch (e) {
        return { ok: false, erro: "Não foi possível conectar ao servidor. Verifique sua internet e tente novamente." };
      }
    },
    demoInserir(lista) { gravarDemo(CHAVE_DEMO, lerDemo(CHAVE_DEMO).concat(lista)); }
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  window.Clima = { PERGUNTAS, ABERTAS, ESCALA, TEMAS, temasDoTexto, normaliza, Trava, API, esc, validar, novoId, hoje };
})();
