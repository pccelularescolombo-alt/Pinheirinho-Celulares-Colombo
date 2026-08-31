/* ============================================================
   CONFIGURAÇÃO DO FIREBASE
   ============================================================
   1. Crie um projeto grátis em https://console.firebase.google.com
   2. No projeto, ative o "Firestore Database" (modo produção).
   3. Em "Configurações do projeto" > "Seus apps" > ícone </> (Web),
      registre um app e copie o objeto de configuração que aparece
      (algo parecido com o objeto abaixo) — cole no lugar deste.
   4. Em Firestore Database > Regras, cole as regras sugeridas no
      arquivo REGRAS_FIRESTORE.txt (enviado junto com este site) e
      publique.
   Sem isso preenchido, o site funciona normalmente (busca, placas
   etc.) mas o like/deslike fica desativado.
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCIhqKbJcGiVdI1VrGapRxDH3OcF-0E1CM",
  authDomain: "adaptacao-de-peliculas.firebaseapp.com",
  projectId: "adaptacao-de-peliculas",
  storageBucket: "adaptacao-de-peliculas.firebasestorage.app",
  messagingSenderId: "1015716132252",
  appId: "1:1015716132252:web:910a222124c2628f73c459"
};

let db;
try {
  if (firebaseConfig.apiKey !== "COLE_AQUI_SUA_API_KEY" && typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  } else {
    console.warn('Firebase ainda não configurado — sistema de avaliação (like/deslike) desativado. Veja as instruções no topo do script.js.');
  }
} catch (e) {
  console.error('Erro ao iniciar o Firebase:', e);
}

/* ============================================================
   CATÁLOGO DE MODELOS E ADAPTAÇÕES
   ============================================================
   Antigamente essa lista ficava toda escrita aqui, à mão. Agora
   ela é 100% carregada do Firestore (coleção "modelos") pela
   função carregarCatalogo(), lá embaixo — inclui tanto o catálogo
   original (migrado uma vez com a página migrar-dados.html) quanto
   tudo que for cadastrado depois pelo painel "Adicionar / editar
   modelo". Não precisa mais editar nada aqui manualmente.

   Fica vazio até a primeira resposta do banco (ou do cache local,
   se a pessoa já visitou o site antes — ver USAR_CACHE_LOCAL logo
   abaixo).
   ============================================================ */
const dados = [];
let catalogoCarregado = false;


const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const newTheme = current === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
  
  document.getElementById(tabName).classList.add('active');
  if (btn) {
    btn.classList.add('active');
  } else {
    event.currentTarget.classList.add('active');
  }
}

const normalizar = (txt) => txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

// Pré-computa os campos normalizados de cada item UMA vez ao carregar a página,
// em vez de normalizar o array inteiro (marca + modelo + todas as adaptações)
// a cada tecla digitada. Isso é o que mais pesava na busca com muitos resultados.
// Virou uma função (em vez de rodar direto) porque agora ela também precisa
// ser chamada de novo sempre que um modelo é adicionado pelo painel de admin.
function indexarDados() {
  dados.forEach(d => {
    d._marcaNorm = normalizar(d.marca);
    d._modeloNorm = normalizar(d.modelo);
    d._adaptNorm = d.adaptacoes ? d.adaptacoes.map(normalizar) : [];
  });
}
indexarDados();

const resultadoEl = document.getElementById('resultado');
const buscaInput = document.getElementById('busca');
let debounceTimer = null;

/* ============================================================
   SISTEMA DE AVALIAÇÃO DAS ADAPTAÇÕES (like / deslike)
   ============================================================
   Cada loja pode avaliar se uma adaptação "dá certo" (👍) ou
   "dá errado" (👎). Os votos ficam salvos no Firebase (Firestore),
   compartilhados entre todas as lojas que acessarem o site.

   Regras de negócio (ajuste as constantes abaixo se quiser):
   - MIN_VOTOS_REMOCAO: quantos votos uma adaptação precisa
     acumular antes de poder ser escondida automaticamente.
   - LIMITE_REPROVACAO: % de deslike a partir do qual, já tendo
     o mínimo de votos, a adaptação some da lista (mas o
     histórico de votos continua salvo no banco).
   ============================================================ */
const MIN_VOTOS_REMOCAO = 3;
const LIMITE_REPROVACAO = 50; // em %

let avaliacoesCache = {}; // slug -> {likes, dislikes}
let avaliacoesCarregadas = false;

function slugAvaliacao(marca, modelo, adaptacao) {
  return normalizar(marca + modelo) + '__' + normalizar(adaptacao);
}

function votosDoSlug(slug) {
  return avaliacoesCache[slug] || { likes: 0, dislikes: 0 };
}

function statusAdaptacao(slug) {
  const { likes, dislikes } = votosDoSlug(slug);
  const total = likes + dislikes;
  if (total === 0) return { total: 0, pctAprovacao: null, reprovada: false };
  const pctAprovacao = Math.round((likes / total) * 100);
  const pctReprovacao = 100 - pctAprovacao;
  const reprovada = total >= MIN_VOTOS_REMOCAO && pctReprovacao >= LIMITE_REPROVACAO;
  return { total, pctAprovacao, reprovada };
}

async function carregarAvaliacoes() {
  if (typeof db === 'undefined') return; // Firebase não configurado ainda
  try {
    const snap = await db.collection('avaliacoes').get();
    const novoCache = {};
    snap.forEach(doc => { novoCache[doc.id] = doc.data(); });
    avaliacoesCache = novoCache;
  } catch (e) {
    console.warn('Não foi possível carregar as avaliações do Firebase:', e);
  } finally {
    avaliacoesCarregadas = true;
    renderResultados(buscaInput.value);
    if (typeof atualizarPainelSeAberto === 'function') atualizarPainelSeAberto();
  }
}

// Mapa slug -> texto legível (marca/modelo de origem + nome da adaptação),
// usado no painel de ranking. É recalculado a partir de "dados", já que o
// Firestore só guarda os números (likes/dislikes), não o texto. Também virou
// função pra poder ser refeito quando o painel de admin adiciona um modelo.
let slugParaTexto = {};
function construirSlugParaTexto() {
  slugParaTexto = {};
  dados.forEach(d => {
    if (!d.adaptacoes) return;
    d.adaptacoes.forEach(a => {
      if (a === 'Sem Adaptação') return;
      const slug = slugAvaliacao(d.marca, d.modelo, a);
      slugParaTexto[slug] = { origem: `${d.marca} ${d.modelo}`, adaptacao: a };
    });
  });
}
construirSlugParaTexto();

async function votar(slug, tipo, event) {
  if (event) event.stopPropagation();
  if (typeof db === 'undefined') {
    alert('O banco de dados ainda não foi configurado neste site (veja as instruções no início do script.js).');
    return;
  }
  const chaveLocal = 'voto_' + slug;
  const votoAtual = localStorage.getItem(chaveLocal); // 'like' | 'dislike' | null
  const ref = db.collection('avaliacoes').doc(slug);
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(ref);
      const atual = doc.exists ? doc.data() : { likes: 0, dislikes: 0 };
      let likes = atual.likes || 0;
      let dislikes = atual.dislikes || 0;

      if (!votoAtual) {
        // Primeiro voto desta loja nesta adaptação.
        if (tipo === 'like') likes += 1; else dislikes += 1;
      } else if (votoAtual === tipo) {
        // Clicou de novo no mesmo botão -> reverte (remove) o voto.
        if (tipo === 'like') likes = Math.max(0, likes - 1);
        else dislikes = Math.max(0, dislikes - 1);
      } else {
        // Clicou no botão oposto -> troca o voto de um lado pro outro.
        if (tipo === 'like') { likes += 1; dislikes = Math.max(0, dislikes - 1); }
        else { dislikes += 1; likes = Math.max(0, likes - 1); }
      }
      t.set(ref, { likes, dislikes }, { merge: true });
    });

    if (!votoAtual || votoAtual !== tipo) {
      localStorage.setItem(chaveLocal, tipo);
    } else {
      localStorage.removeItem(chaveLocal); // voto revertido
    }

    const doc = await ref.get();
    avaliacoesCache[slug] = doc.data();
    renderResultados(buscaInput.value);
    if (typeof atualizarPainelSeAberto === 'function') atualizarPainelSeAberto();
  } catch (e) {
    console.error(e);
    alert('Não foi possível registrar o voto agora. Verifique a conexão com a internet.');
  }
}
window.votar = votar;

function renderTagsAdaptacoes(marca, modelo, adaptacoes) {
  if (!adaptacoes || adaptacoes[0] === "Sem Adaptação") {
    return '<span class="no-adapt">Sem adaptações compatíveis</span>';
  }

  const visiveis = adaptacoes.filter(a => {
    if (!avaliacoesCarregadas) return true; // antes de carregar, mostra tudo
    return !statusAdaptacao(slugAvaliacao(marca, modelo, a)).reprovada;
  });

  if (!visiveis.length) {
    return '<span class="no-adapt">As adaptações cadastradas foram reprovadas pelas lojas.</span>';
  }

  return visiveis.map(a => {
    const slug = slugAvaliacao(marca, modelo, a);
    const st = statusAdaptacao(slug);
    const votoAtual = localStorage.getItem('voto_' + slug);
    return `
      <span class="tag">
        <span class="tag-texto">${a}</span>
        ${st.total > 0 ? `<span class="tag-pct" title="${st.total} avaliação(ões) de lojas">${st.pctAprovacao}% 👍</span>` : ''}
        <span class="tag-votos">
          <button type="button" class="voto-btn voto-like${votoAtual === 'like' ? ' votado' : ''}"
                  onclick="votar('${slug}','like',event)" title="Clique para avaliar / clique de novo para desfazer">👍</button>
          <button type="button" class="voto-btn voto-dislike${votoAtual === 'dislike' ? ' votado' : ''}"
                  onclick="votar('${slug}','dislike',event)" title="Clique para avaliar / clique de novo para desfazer">👎</button>
        </span>
      </span>`;
  }).join('');
}

function renderVazio(mensagemHtml) {
  resultadoEl.innerHTML = `<div class="vazio">${mensagemHtml}</div>`;
}

function renderResultados(busca) {
  if (!busca) {
    renderVazio(`<i class="fas fa-mobile-alt"></i><p>Digite o modelo ou fabricante para buscar compatibilidade de películas.</p>`);
    return;
  }

  const f = normalizar(busca);

  // Uma única varredura no array em vez de até 3 (marca, depois modelo, depois
  // adaptações), classificando por relevância para manter marca/modelo primeiro.
  let porMarca = [], porModelo = [], porAdaptacao = [];
  for (const d of dados) {
    if (d._marcaNorm.includes(f)) { porMarca.push(d); continue; }
    if (d._modeloNorm.includes(f)) { porModelo.push(d); continue; }
    if (d._adaptNorm.some(a => a.includes(f))) { porAdaptacao.push(d); }
  }
  let resultados = porMarca.length ? porMarca : (porModelo.length ? porModelo : porAdaptacao);

  if (!resultados.length) {
    renderVazio(`<i class="fas fa-search"></i><p>Nenhuma compatibilidade encontrada para "<strong>${busca}</strong>".</p>`);
    return;
  }

  const frag = document.createDocumentFragment();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = resultados.map((d, i) => `
    <div class="card" style="animation-delay:${Math.min(i, 12) * 0.04}s">
      <div class="card-header">
        <img class="brand-logo" loading="lazy" src="logos/${d.marca.toLowerCase()}.png" alt="${d.marca}"
             onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>📱</text></svg>'">
        <div class="card-info">
          <div class="modelo">${d.modelo}</div>
          <div class="marca">${d.marca}</div>
        </div>
      </div>
      <div class="adaptacoes">
        <div class="adaptacoes-title">
          <i class="fas fa-exchange-alt"></i>
          Adaptação compatível
        </div>
        <div class="adaptacoes-list">
          ${renderTagsAdaptacoes(d.marca, d.modelo, d.adaptacoes)}
        </div>
      </div>
    </div>
  `).join('');
  frag.appendChild(wrapper);
  resultadoEl.replaceChildren(...wrapper.childNodes);
}

buscaInput.addEventListener('input', (e) => {
  const valor = e.target.value;
  clearTimeout(debounceTimer);
  // Pequeno atraso: evita refazer a busca e re-renderizar os cards a cada
  // tecla enquanto a pessoa ainda está digitando (isso é o que mais trava
  // a digitação quando há muitos resultados na tela).
  debounceTimer = setTimeout(() => renderResultados(valor), 150);
});

/* ============================================================
   PAINEL DE RANKING (mais like / mais deslike)
   ============================================================
   Lista todas as adaptações já avaliadas por alguma loja,
   ordenadas para destacar as mais reprovadas — pra você decidir
   quais tirar do catálogo manualmente (além das que já somem
   sozinhas ao passar do limite configurado em MIN_VOTOS_REMOCAO
   e LIMITE_REPROVACAO, lá em cima).
   ============================================================ */
const painelOverlay = document.getElementById('painelOverlay');
const painelBtn = document.getElementById('painelToggle');
const painelFechar = document.getElementById('painelFechar');
const painelCorpo = document.getElementById('painelCorpo');
let ordemPainelAtual = 'deslikes'; // 'deslikes' | 'likes'

function construirListaPainel() {
  const linhas = [];
  for (const slug in avaliacoesCache) {
    const info = slugParaTexto[slug];
    if (!info) continue; // slug de uma adaptação que não existe mais em "dados"
    const { likes, dislikes } = avaliacoesCache[slug];
    const total = (likes || 0) + (dislikes || 0);
    if (total === 0) continue;
    const st = statusAdaptacao(slug);
    linhas.push({
      origem: info.origem,
      adaptacao: info.adaptacao,
      likes: likes || 0,
      dislikes: dislikes || 0,
      total,
      pctAprovacao: st.pctAprovacao,
      reprovada: st.reprovada
    });
  }
  linhas.sort((a, b) => {
    if (ordemPainelAtual === 'deslikes') return b.dislikes - a.dislikes || b.total - a.total;
    return b.likes - a.likes || b.total - a.total;
  });
  return linhas;
}

function renderPainel() {
  if (!avaliacoesCarregadas) {
    painelCorpo.innerHTML = `<div class="vazio"><i class="fas fa-spinner fa-spin"></i><p>Carregando avaliações...</p></div>`;
    return;
  }
  const linhas = construirListaPainel();
  if (!linhas.length) {
    painelCorpo.innerHTML = `<div class="vazio"><i class="fas fa-chart-simple"></i><p>Nenhuma loja avaliou uma adaptação ainda.</p></div>`;
    return;
  }
  painelCorpo.innerHTML = `
    <table class="painel-tabela">
      <thead>
        <tr>
          <th>Modelo (origem)</th>
          <th>Adaptação avaliada</th>
          <th>👍</th>
          <th>👎</th>
          <th>% aprovação</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${linhas.map(l => `
          <tr class="${l.reprovada ? 'linha-reprovada' : ''}">
            <td>${l.origem}</td>
            <td>${l.adaptacao}</td>
            <td class="col-num">${l.likes}</td>
            <td class="col-num">${l.dislikes}</td>
            <td class="col-num">${l.pctAprovacao}%</td>
            <td>${l.reprovada
              ? '<span class="selo selo-removida">Removida do site</span>'
              : '<span class="selo selo-ativa">Ativa</span>'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function atualizarPainelSeAberto() {
  if (painelOverlay && painelOverlay.classList.contains('aberto')) renderPainel();
}

function abrirPainel() {
  painelOverlay.classList.add('aberto');
  renderPainel();
  if (!avaliacoesCarregadas) carregarAvaliacoes();
}

function fecharPainel() {
  painelOverlay.classList.remove('aberto');
}

if (painelBtn) painelBtn.addEventListener('click', abrirPainel);
if (painelFechar) painelFechar.addEventListener('click', fecharPainel);
if (painelOverlay) {
  painelOverlay.addEventListener('click', (e) => {
    if (e.target === painelOverlay) fecharPainel(); // clicou fora do card
  });
}
document.querySelectorAll('.painel-ordenar button').forEach(btn => {
  btn.addEventListener('click', () => {
    ordemPainelAtual = btn.dataset.ordem;
    document.querySelectorAll('.painel-ordenar button').forEach(b => b.classList.toggle('ativo', b === btn));
    renderPainel();
  });
});

carregarAvaliacoes();

/* ============================================================
   ADMIN: adicionar / editar modelos e adaptações pelo site
   ============================================================
   Objetivo: acabar com a edição manual deste arquivo. Todo o
   catálogo (o que já existia + o que for cadastrado dali pra
   frente) mora na coleção "modelos" do Firestore. O painel
   "Adicionar / editar modelo", com usuário e senha, cadastra
   direto no banco — ninguém precisa mais editar o script.js.

   LIGAÇÃO AUTOMÁTICA (bidirecional): ao salvar um modelo novo
   com uma adaptação que já existe no sistema (ex: cadastrar o
   "iPhone 16e" com adaptação "iPhone 13"), o sistema também
   adiciona o "iPhone 16e" como adaptação do "iPhone 13"
   automaticamente. Assim as duas fichas ficam sincronizadas sem
   precisar cadastrar dos dois lados.

   SOBRE A SENHA (leia com atenção): como o site não tem um
   servidor próprio nem login de verdade (Firebase Authentication),
   essa senha serve só pra evitar que alguém mexa por engano — ela
   fica visível pra quem abrir o código do site (F12), então não é
   uma proteção contra alguém mal-intencionado. As regras do
   Firestore (REGRAS_FIRESTORE.txt) só validam o FORMATO dos dados
   enviados, não quem está enviando. Se um dia isso virar um
   problema (edições indevidas), o certo é migrar pra um login de
   verdade — posso implementar depois se precisar.
   ============================================================ */
const ADMIN_USUARIO = "pinheirinho";
const ADMIN_SENHA = "pelicula2026"; // troque aqui pela senha que quiser usar

function normalizarSlugModelo(marca, modelo) {
  return normalizar(marca + modelo);
}

// Soma (sem duplicar) um {marca, modelo, adaptacoes} vindo do Firestore (ou
// recém salvo pelo formulário) dentro do array "dados" já usado pela busca.
function mesclarModeloNoSistema(info) {
  if (!info || !info.marca || !info.modelo) return;
  const slug = normalizarSlugModelo(info.marca, info.modelo);
  const existente = dados.find(d => normalizarSlugModelo(d.marca, d.modelo) === slug);
  const novasAdapt = Array.isArray(info.adaptacoes) ? info.adaptacoes : [];

  if (existente) {
    if (!existente.adaptacoes || existente.adaptacoes[0] === "Sem Adaptação") existente.adaptacoes = [];
    novasAdapt.forEach(a => {
      const jaTem = existente.adaptacoes.some(x => normalizar(x) === normalizar(a));
      if (!jaTem) existente.adaptacoes.push(a);
    });
  } else {
    dados.push({ marca: info.marca, modelo: info.modelo, adaptacoes: [...novasAdapt] });
  }
}

/* ------------------------------------------------------------
   Cache local (localStorage): guarda a última versão do catálogo
   que o navegador já baixou, pra pessoa que já visitou o site
   ver a busca funcionando IMEDIATAMENTE na próxima visita — sem
   esperar o Firestore responder de novo. O site sempre confere
   se tem algo mais novo no banco em seguida, em segundo plano.
   ------------------------------------------------------------ */
const CACHE_CATALOGO_CHAVE = 'catalogoCache_v1';

function salvarCacheCatalogo() {
  try {
    const limpo = dados.map(d => ({ marca: d.marca, modelo: d.modelo, adaptacoes: d.adaptacoes }));
    localStorage.setItem(CACHE_CATALOGO_CHAVE, JSON.stringify({ dados: limpo, ts: Date.now() }));
  } catch (e) {
    // localStorage cheio ou indisponível — sem problema, só não guarda cache.
  }
}

function carregarCacheCatalogo() {
  try {
    const bruto = localStorage.getItem(CACHE_CATALOGO_CHAVE);
    if (!bruto) return false;
    const { dados: cache } = JSON.parse(bruto);
    if (!Array.isArray(cache) || !cache.length) return false;
    cache.forEach(d => dados.push(d));
    return true;
  } catch (e) {
    return false;
  }
}

// Mostra/esconde o aviso de carregamento inicial da busca (só aparece na
// primeira visita, quando ainda não existe cache local no navegador).
function marcarCarregandoCatalogo(carregando) {
  if (carregando) {
    buscaInput.disabled = true;
    buscaInput.placeholder = 'Carregando modelos...';
    renderVazio('<i class="fas fa-spinner fa-spin"></i><p>Carregando o catálogo de modelos...</p>');
  } else {
    buscaInput.disabled = false;
    buscaInput.placeholder = 'Digite o modelo ou marca do celular...';
  }
}

async function carregarCatalogo() {
  const tinhaCache = carregarCacheCatalogo();
  if (tinhaCache) {
    indexarDados();
    construirSlugParaTexto();
    popularFabricantes();
    renderResultados(buscaInput.value);
  } else {
    marcarCarregandoCatalogo(true);
  }

  if (typeof db === 'undefined') {
    // Sem Firebase configurado: se não tinha cache, avisa e mantém a busca vazia.
    if (!tinhaCache) marcarCarregandoCatalogo(false);
    catalogoCarregado = true;
    return;
  }

  try {
    const snap = await db.collection('modelos').get();
    dados.length = 0; // troca o conteúdo pelo que acabou de vir do banco, já atualizado
    snap.forEach(doc => dados.push(doc.data()));
  } catch (e) {
    console.warn('Não foi possível carregar o catálogo do Firebase:', e);
    if (!tinhaCache && !dados.length) {
      renderVazio('<i class="fas fa-triangle-exclamation"></i><p>Não foi possível carregar o catálogo agora. Verifique sua conexão e recarregue a página.</p>');
    }
  } finally {
    catalogoCarregado = true;
    marcarCarregandoCatalogo(false);
    indexarDados();
    construirSlugParaTexto();
    popularFabricantes();
    renderResultados(buscaInput.value);
    atualizarPainelSeAberto();
    if (dados.length) salvarCacheCatalogo();
  }
}

/* ---------- Login (usuário e senha) ---------- */
const loginOverlay = document.getElementById('loginOverlay');
const loginUsuarioInput = document.getElementById('loginUsuario');
const loginSenhaInput = document.getElementById('loginSenha');
const loginErro = document.getElementById('loginErro');
const painelAdminBtn = document.getElementById('painelAdminBtn');

function abrirLogin() {
  loginErro.style.display = 'none';
  loginUsuarioInput.value = '';
  loginSenhaInput.value = '';
  loginOverlay.classList.add('aberto');
  setTimeout(() => loginUsuarioInput.focus(), 50);
}
function fecharLogin() {
  loginOverlay.classList.remove('aberto');
}

if (painelAdminBtn) painelAdminBtn.addEventListener('click', abrirLogin);
document.getElementById('loginFechar').addEventListener('click', fecharLogin);
document.getElementById('loginCancelar').addEventListener('click', fecharLogin);
loginOverlay.addEventListener('click', (e) => { if (e.target === loginOverlay) fecharLogin(); });

function tentarLogin() {
  if (loginUsuarioInput.value.trim() === ADMIN_USUARIO && loginSenhaInput.value === ADMIN_SENHA) {
    fecharLogin();
    abrirAdmin();
  } else {
    loginErro.style.display = 'block';
  }
}
document.getElementById('loginEntrar').addEventListener('click', tentarLogin);
[loginUsuarioInput, loginSenhaInput].forEach(inp => {
  inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') tentarLogin(); });
});

/* ---------- Formulário de modelo / adaptação ---------- */
const adminOverlay = document.getElementById('adminOverlay');
const adminModeloInput = document.getElementById('adminModelo');
const adminModeloSugestoes = document.getElementById('adminModeloSugestoes');
const adminMarcaSelect = document.getElementById('adminMarca');
const adminNovaMarcaInput = document.getElementById('adminNovaMarca');
const adminAdaptInput = document.getElementById('adminAdaptacao');
const adminAdaptSugestoes = document.getElementById('adminAdaptSugestoes');
const adminChipsLista = document.getElementById('adminChipsLista');
const adminErro = document.getElementById('adminErro');
const adminSucesso = document.getElementById('adminSucesso');
const adminSalvarBtn = document.getElementById('adminSalvar');

let adminChips = [];                  // [{marca, modelo}] — adaptações selecionadas no formulário
let adminModeloSelecionadoExistente = null; // referência ao item de "dados", se for edição de um modelo já cadastrado

function popularSelectMarcaAdmin() {
  adminMarcaSelect.innerHTML = '<option value="">Selecione a marca</option>';
  [...new Set(dados.map(d => d.marca))].sort().forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    adminMarcaSelect.appendChild(opt);
  });
  const optNova = document.createElement('option');
  optNova.value = '__nova__';
  optNova.textContent = '+ Nova marca';
  adminMarcaSelect.appendChild(optNova);
}

function renderChipsAdmin() {
  if (!adminChips.length) {
    adminChipsLista.innerHTML = '<span class="admin-chip-vazio">Nenhuma adaptação adicionada ainda.</span>';
    return;
  }
  adminChipsLista.innerHTML = adminChips.map((c, i) => `
    <span class="admin-chip">
      ${c.marca ? `${c.marca} • ${c.modelo}` : c.modelo}
      <button type="button" data-i="${i}" class="admin-chip-remover" title="Remover">&times;</button>
    </span>
  `).join('');
  adminChipsLista.querySelectorAll('.admin-chip-remover').forEach(btn => {
    btn.addEventListener('click', () => {
      adminChips.splice(Number(btn.dataset.i), 1);
      renderChipsAdmin();
    });
  });
}

function abrirAdmin() {
  adminModeloInput.value = '';
  adminNovaMarcaInput.value = '';
  adminNovaMarcaInput.style.display = 'none';
  adminAdaptInput.value = '';
  adminAdaptSugestoes.innerHTML = '';
  adminModeloSugestoes.innerHTML = '';
  adminChips = [];
  adminModeloSelecionadoExistente = null;
  adminErro.style.display = 'none';
  adminSucesso.style.display = 'none';
  renderChipsAdmin();
  popularSelectMarcaAdmin();
  adminMarcaSelect.value = '';
  adminOverlay.classList.add('aberto');
  setTimeout(() => adminModeloInput.focus(), 50);
}
function fecharAdmin() {
  adminOverlay.classList.remove('aberto');
}

document.getElementById('adminFechar').addEventListener('click', fecharAdmin);
document.getElementById('adminCancelar').addEventListener('click', fecharAdmin);
adminOverlay.addEventListener('click', (e) => { if (e.target === adminOverlay) fecharAdmin(); });

adminMarcaSelect.addEventListener('change', () => {
  adminNovaMarcaInput.style.display = adminMarcaSelect.value === '__nova__' ? 'block' : 'none';
});

// Busca modelos já cadastrados (marca ou modelo) pra usar tanto na busca do
// "qual modelo estou cadastrando" quanto na busca de "quais adaptações ligar".
function buscarModelosSistema(termo, excluirSlug) {
  const f = normalizar(termo);
  if (!f) return [];
  return dados
    .filter(d => normalizarSlugModelo(d.marca, d.modelo) !== excluirSlug)
    .filter(d => (d._modeloNorm || normalizar(d.modelo)).includes(f) || (d._marcaNorm || normalizar(d.marca)).includes(f))
    .slice(0, 8);
}

function selecionarModeloExistenteAdmin(item) {
  adminModeloSelecionadoExistente = item;
  adminModeloInput.value = item.modelo;
  adminMarcaSelect.value = item.marca;
  adminNovaMarcaInput.style.display = 'none';
  adminModeloSugestoes.innerHTML = '';
  adminChips = (item.adaptacoes && item.adaptacoes[0] !== 'Sem Adaptação')
    ? item.adaptacoes.map(a => {
        const origem = dados.find(d => normalizar(d.modelo) === normalizar(a));
        return { marca: origem ? origem.marca : null, modelo: a };
      })
    : [];
  renderChipsAdmin();
}

adminModeloInput.addEventListener('input', () => {
  adminModeloSelecionadoExistente = null;
  const achados = buscarModelosSistema(adminModeloInput.value, null);
  if (!achados.length) { adminModeloSugestoes.innerHTML = ''; return; }
  adminModeloSugestoes.innerHTML = achados.map((d, i) => `
    <button type="button" class="admin-sugestao-item" data-i="${i}">${d.marca} • ${d.modelo}</button>
  `).join('');
  adminModeloSugestoes.querySelectorAll('.admin-sugestao-item').forEach((btn, i) => {
    btn.addEventListener('click', () => selecionarModeloExistenteAdmin(achados[i]));
  });
});

adminAdaptInput.addEventListener('input', () => {
  const slugAtual = adminModeloSelecionadoExistente
    ? normalizarSlugModelo(adminModeloSelecionadoExistente.marca, adminModeloSelecionadoExistente.modelo)
    : null;
  const achados = buscarModelosSistema(adminAdaptInput.value, slugAtual);
  if (!achados.length) { adminAdaptSugestoes.innerHTML = ''; return; }
  adminAdaptSugestoes.innerHTML = achados.map((d, i) => `
    <button type="button" class="admin-sugestao-item" data-i="${i}">${d.marca} • ${d.modelo}</button>
  `).join('');
  adminAdaptSugestoes.querySelectorAll('.admin-sugestao-item').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const d = achados[i];
      const jaTem = adminChips.some(c => normalizar(c.modelo) === normalizar(d.modelo));
      if (!jaTem) adminChips.push({ marca: d.marca, modelo: d.modelo });
      adminAdaptInput.value = '';
      adminAdaptSugestoes.innerHTML = '';
      renderChipsAdmin();
    });
  });
});

// Permite adicionar um texto que não existe no sistema (ex: "Sem Adaptação"
// ou um nome digitado na mão) apertando Enter — sem ligação recíproca nesse caso.
adminAdaptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && adminAdaptInput.value.trim()) {
    e.preventDefault();
    const texto = adminAdaptInput.value.trim();
    const jaTem = adminChips.some(c => normalizar(c.modelo) === normalizar(texto));
    if (!jaTem) adminChips.push({ marca: null, modelo: texto });
    adminAdaptInput.value = '';
    adminAdaptSugestoes.innerHTML = '';
    renderChipsAdmin();
  }
});

adminSalvarBtn.addEventListener('click', async () => {
  adminErro.style.display = 'none';
  adminSucesso.style.display = 'none';

  const modeloNome = adminModeloInput.value.trim();
  const marcaNome = adminMarcaSelect.value === '__nova__' ? adminNovaMarcaInput.value.trim() : adminMarcaSelect.value;

  if (!modeloNome || !marcaNome) {
    adminErro.textContent = 'Preencha o nome do modelo e escolha (ou digite) a marca.';
    adminErro.style.display = 'block';
    return;
  }
  if (!adminChips.length) {
    adminErro.textContent = 'Adicione ao menos uma adaptação (digite "Sem Adaptação" e aperte Enter se não houver nenhuma).';
    adminErro.style.display = 'block';
    return;
  }
  if (typeof db === 'undefined') {
    adminErro.textContent = 'O banco de dados (Firebase) não está configurado neste site — veja as instruções no topo do script.js.';
    adminErro.style.display = 'block';
    return;
  }

  adminSalvarBtn.disabled = true;
  adminSalvarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

  try {
    const nomesAdaptacoes = adminChips.map(c => c.modelo);
    const slugPrincipal = normalizarSlugModelo(marcaNome, modeloNome);

    // Salva/atualiza o modelo principal com as adaptações escolhidas.
    await db.collection('modelos').doc(slugPrincipal).set({
      marca: marcaNome,
      modelo: modeloNome,
      adaptacoes: firebase.firestore.FieldValue.arrayUnion(...nomesAdaptacoes)
    }, { merge: true });

    // Ligação recíproca: cada adaptação selecionada (que tem marca conhecida)
    // recebe o modelo novo/editado como adaptação dela também.
    for (const c of adminChips) {
      if (!c.marca) continue; // texto digitado livre, sem ficha própria — não dá pra ligar de volta
      const slugOutro = normalizarSlugModelo(c.marca, c.modelo);
      await db.collection('modelos').doc(slugOutro).set({
        marca: c.marca,
        modelo: c.modelo,
        adaptacoes: firebase.firestore.FieldValue.arrayUnion(modeloNome)
      }, { merge: true });
    }

    // Atualiza a busca na hora, sem precisar recarregar a página.
    mesclarModeloNoSistema({ marca: marcaNome, modelo: modeloNome, adaptacoes: nomesAdaptacoes });
    adminChips.forEach(c => {
      if (c.marca) mesclarModeloNoSistema({ marca: c.marca, modelo: c.modelo, adaptacoes: [modeloNome] });
    });
    indexarDados();
    construirSlugParaTexto();
    popularFabricantes();

    adminSucesso.style.display = 'block';
    buscaInput.value = modeloNome;
    renderResultados(modeloNome);
    atualizarPainelSeAberto();
    setTimeout(fecharAdmin, 1200);
  } catch (e) {
    console.error(e);
    adminErro.textContent = 'Não foi possível salvar agora. Verifique a conexão com a internet e tente de novo.';
    adminErro.style.display = 'block';
  } finally {
    adminSalvarBtn.disabled = false;
    adminSalvarBtn.innerHTML = '<i class="fas fa-floppy-disk"></i> Salvar';
  }
});

carregarCatalogo();

const cores = {
  samsung: { fundo:"#1428a0", texto:"#ffffff" },
  motorola: { fundo:"#001526", texto:"#ffffff" },
  xiaomi: { fundo:"#ff6a08", texto:"#000000" },
  apple: { fundo:"#dcdcdc", texto:"#000000" },
  asus: { fundo:"#000000", texto:"#ffffff" },
  infinix: { fundo:"#8ec142", texto:"#000000" },
  itel: { fundo:"#fd0137", texto:"#ffffff" },
  lg: { fundo:"#a50034", texto:"#ffffff" },
  nokia: { fundo:"#1c4598", texto:"#ffffff" },
  oppo: { fundo:"#006b33", texto:"#ffffff" },
  oscal: { fundo:"#9c40dd", texto:"#ffffff" },
  realme: { fundo:"#ffc913", texto:"#000000" },
  tecno: { fundo:"#0064fe", texto:"#ffffff" },
  jovi: { fundo:"#1c4598", texto:"#ffffff" }
};

const fabSelect = document.getElementById('fabricante');
const fabSelectCapa = document.getElementById('fabricanteCapa');

// Função (em vez de bloco fixo) pra poder repopular os selects quando o
// painel de admin cadastra uma marca nova, sem precisar recarregar a página.
function popularFabricantes() {
  const fabricantes = [...new Set(dados.map(d => d.marca))].sort();
  const valorAtual = fabSelect.value;
  const valorAtualCapa = fabSelectCapa.value;

  fabSelect.innerHTML = '<option value="">Fabricante</option>';
  fabSelectCapa.innerHTML = '<option value="">Fabricante</option>';

  fabricantes.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    fabSelect.appendChild(opt);

    const optCapa = document.createElement('option');
    optCapa.value = f;
    optCapa.textContent = f;
    fabSelectCapa.appendChild(optCapa);
  });

  if (fabricantes.includes(valorAtual)) fabSelect.value = valorAtual;
  if (fabricantes.includes(valorAtualCapa)) fabSelectCapa.value = valorAtualCapa;
}
popularFabricantes();

fabSelect.addEventListener('change', () => {
  const modeloSelect = document.getElementById('modelo');
  modeloSelect.innerHTML = '<option value="">Modelo</option>';
  modeloSelect.disabled = !fabSelect.value;
  
  if (fabSelect.value) {
    const modelos = dados.filter(d => d.marca === fabSelect.value).map(d => d.modelo);
    modelos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      modeloSelect.appendChild(opt);
    });
  }
});

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function gerarImagemPelicula() {
  const fabricante = document.getElementById('fabricante').value;
  const modelo = document.getElementById('modelo').value;
  
  if (!fabricante || !modelo) {
    alert("Selecione a fabricante e o modelo!");
    return;
  }

  const achado = dados.find(d => d.marca === fabricante && d.modelo === modelo);
  if (!achado) {
    alert("Modelo não encontrado!");
    return;
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext("2d");
  const est = cores[achado.marca.toLowerCase()] || { fundo:"#fff", texto:"#000" };

  ctx.clearRect(0, 0, 591, 591);
  ctx.fillStyle = est.fundo;
  ctx.fillRect(0, 0, 591, 591);

  const b = 12;
  ctx.fillStyle = "#0051ff";
  ctx.fillRect(0, 0, 591, b);
  ctx.fillRect(0, 0, b, 591);
  ctx.fillStyle = "#ff7a00";
  ctx.fillRect(0, 591 - b, 591, b);
  ctx.fillRect(591 - b, 0, b, 591);

  ctx.textAlign = "center";
  ctx.fillStyle = est.texto;
  ctx.textBaseline = "alphabetic";

  let y = b + 20;

  const boxW = 300, boxH = 110;
  const boxX = (591 - boxW) / 2;
  const boxY = y;

  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 9;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#fff";
  roundRect(ctx, boxX, boxY, boxW, boxH, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";

  const logo = new Image();
  logo.src = `logo2/${achado.marca.toLowerCase()}.png`;
  logo.onload = () => {
    const imgW = boxW - 40;
    const imgH = logo.height * (imgW / logo.width);
    ctx.drawImage(logo, boxX + (boxW - imgW) / 2, boxY + (boxH - imgH) / 2, imgW, imgH);
  };

  y = boxY + boxH + 50;

  let tamanho = 65;
  do {
    ctx.font = `bold ${tamanho}px Arial`;
    tamanho--;
  } while (ctx.measureText(achado.modelo).width > 591 - 60);

  ctx.fillStyle = est.texto;
  ctx.fillText(achado.modelo, 591 / 2, y);

  y += 60;

  ctx.font = "bold 30px Arial";
  ctx.fillText("Adaptações:", 591 / 2, y);

  y += 25;

  const areaAltura = 591 - y - b - 10;
  const areaLargura = 591 - 50;
  const numAdaptacoes = achado.adaptacoes.length;
  
  let colunas;
  if (numAdaptacoes <= 5) colunas = 1;
  else if (numAdaptacoes <= 10) colunas = 2;
  else if (numAdaptacoes <= 18) colunas = 3;
  else colunas = 4;
  
  const linhasPorCol = Math.ceil(numAdaptacoes / colunas);
  const gap = 17;
  const larguraCol = (areaLargura - (gap * (colunas - 1))) / colunas;
  
  let fonte = 35;
  let espacamento = fonte * 0.45;
  
  while ((linhasPorCol * (fonte + espacamento)) > areaAltura && fonte > 15) {
    fonte -= 1;
    espacamento = fonte * 0.45;
  }
  
  ctx.font = `bold ${fonte}px Arial`;
  let textoMuitoLongo = true;
  
  while (textoMuitoLongo && fonte > 15) {
    textoMuitoLongo = false;
    ctx.font = `bold ${fonte}px Arial`;
    
    achado.adaptacoes.forEach(t => {
      if (ctx.measureText(t).width > larguraCol - 8) textoMuitoLongo = true;
    });
    
    if (textoMuitoLongo) {
      fonte -= 1;
      espacamento = fonte * 0.45;
    }
  }
  
  ctx.font = `bold ${fonte}px Arial`;
  const inicioX = (591 - ((larguraCol * colunas) + (gap * (colunas - 1)))) / 2;
  const alturaTotal = linhasPorCol * (fonte + espacamento) - espacamento;
  const yInicio = y + (areaAltura - alturaTotal) / 2;
  
  achado.adaptacoes.forEach((t, i) => {
    const col = Math.floor(i / linhasPorCol);
    const lin = i % linhasPorCol;
    const x = inicioX + col * (larguraCol + gap) + larguraCol / 2;
    const yy = yInicio + lin * (fonte + espacamento);
    ctx.fillText(t, x, yy);
  });
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function addDpiToPng(base64Data, dpi) {
  const base64 = base64Data.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const ppm = Math.round(dpi / 0.0254);
  const ppmBytes = new Uint8Array([
    (ppm >> 24) & 0xFF,
    (ppm >> 16) & 0xFF,
    (ppm >> 8) & 0xFF,
    ppm & 0xFF
  ]);

  const physData = new Uint8Array(9);
  physData.set(ppmBytes, 0);
  physData.set(ppmBytes, 4);
  physData[8] = 1;

  const crcData = new Uint8Array(4 + 9);
  crcData[0] = 0x70; crcData[1] = 0x48; crcData[2] = 0x59; crcData[3] = 0x73;
  crcData.set(physData, 4);
  const crc = crc32(crcData);

  const crcBytes = new Uint8Array([
    (crc >> 24) & 0xFF,
    (crc >> 16) & 0xFF,
    (crc >> 8) & 0xFF,
    crc & 0xFF
  ]);

  const physChunk = new Uint8Array(4 + 4 + 9 + 4);
  physChunk[0] = 0; physChunk[1] = 0; physChunk[2] = 0; physChunk[3] = 9;
  physChunk[4] = 0x70; physChunk[5] = 0x48; physChunk[6] = 0x59; physChunk[7] = 0x73;
  physChunk.set(physData, 8);
  physChunk.set(crcBytes, 17);

  const newBytes = new Uint8Array(bytes.length + physChunk.length);
  newBytes.set(bytes.subarray(0, 33), 0);
  newBytes.set(physChunk, 33);
  newBytes.set(bytes.subarray(33), 33 + physChunk.length);

  let binary = '';
  for (let i = 0; i < newBytes.length; i++) {
    binary += String.fromCharCode(newBytes[i]);
  }
  return 'data:image/png;base64,' + btoa(binary);
}

function baixarImagemPelicula() {
  const fabricante = document.getElementById('fabricante').value;
  const modelo = document.getElementById('modelo').value;
  
  if (!fabricante || !modelo) {
    alert("Gere a imagem primeiro!");
    return;
  }

  const canvas = document.getElementById('canvas');
  const a = document.createElement("a");
  a.download = `${fabricante} ${modelo}.png`;
  a.href = addDpiToPng(canvas.toDataURL("image/png"), 300);
  a.click();
}

function gerarImagemCapa() {
  const fabricante = document.getElementById('fabricanteCapa').value;
  const linha1 = document.getElementById('linha1Capa').value.trim();
  const linha2 = document.getElementById('linha2Capa').value.trim();
  const linha3 = document.getElementById('linha3Capa').value.trim();
  
  if (!fabricante || (!linha1 && !linha2 && !linha3)) {
    alert("Selecione a fabricante e preencha pelo menos uma linha do modelo!");
    return;
  }

  const canvas = document.getElementById('canvasCapa');
  const ctx = canvas.getContext("2d");
  const est = cores[fabricante.toLowerCase()] || { fundo:"#0047AB", texto:"#000000" };

  // 1. Fundo totalmente branco
  ctx.clearRect(0, 0, 591, 591);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 591, 591);

  // 2. Borda com a cor da fabricante selecionada
  const b = 15;
  ctx.fillStyle = est.fundo;
  ctx.fillRect(0, 0, 591, b);
  ctx.fillRect(0, 0, b, 591);
  ctx.fillRect(0, 591 - b, 591, b);
  ctx.fillRect(591 - b, 0, b, 591);

  // 3. Círculo preto de 5x5 mm (marca de corte/furo)
  const mmToPx = 591 / 50;
  const raioCirculo = 2.5 * mmToPx; 
  const centroX = 25 * mmToPx;      
  const centroY = 10 * mmToPx;      

  ctx.beginPath();
  ctx.arc(centroX, centroY, raioCirculo, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // 4. Box para a logo da fabricante (posicionado abaixo do círculo)
  const boxW = 320;
  const boxH = 120;
  const boxX = (591 - boxW) / 2;
  const boxY = 180; 



  // 5. Carregar e desenhar a logo
  const logo = new Image();
  logo.src = `logo2/${fabricante.toLowerCase()}.png`;
  
  const linhasTexto = [linha1, linha2, linha3].filter(l => l !== "");
  
  logo.onload = () => {
    const maxImgW = boxW - 40;
    const imgRatio = logo.width / logo.height;
    let imgW = maxImgW;
    let imgH = imgW / imgRatio;
    
    if (imgH > boxH - 20) {
      imgH = boxH - 20;
      imgW = imgH * imgRatio;
    }
    
    ctx.drawImage(logo, boxX + (boxW - imgW) / 2, boxY + (boxH - imgH) / 2, imgW, imgH);
    desenharTextoModeloCapa(ctx, linhasTexto, b, boxY + boxH);
  };
  
  // Fallback caso a imagem não carregue
  logo.onerror = () => {
    ctx.fillStyle = est.fundo;
    ctx.font = "bold 42px Arial";
    ctx.fillText(fabricante.toUpperCase(), 591 / 2, boxY + boxH / 2 + 15);
    desenharTextoModeloCapa(ctx, linhasTexto, b, boxY + boxH);
  };
}

function desenharTextoModeloCapa(ctx, linhasTexto, b, startY) {
  let y = startY + 40;
  ctx.fillStyle = "#000000"; 
  ctx.textAlign = "center";
  
  const maxWidth = 591 - 80; // Margem de 40px de cada lado
  let tamanhoFonte = 60;
  
  // Filtrar linhas vazias
  const linhas = linhasTexto.filter(l => l.length > 0);
  
  // Ajustar fonte para caber na largura máxima
  while (tamanhoFonte >= 30) {
    let cabe = true;
    ctx.font = `bold ${tamanhoFonte}px Arial`;
    for (let i = 0; i < linhas.length; i++) {
      if (ctx.measureText(linhas[i]).width > maxWidth) {
        cabe = false;
        break;
      }
    }
    if (cabe) break;
    tamanhoFonte -= 2;
  }
  
  const alturaLinha = tamanhoFonte * 1.3;
  const alturaTotalTexto = linhas.length * alturaLinha;
  const espacoRestante = 591 - b - y;
  
  // Centralizar o bloco de texto no espaço restante abaixo da logo
  const yInicio = y + (espacoRestante - alturaTotalTexto) / 2 + alturaLinha;
  
  linhas.forEach((linha, i) => {
    ctx.fillText(linha, 591 / 2, yInicio + i * alturaLinha);
  });
}

function baixarImagemCapa() {
  const fabricante = document.getElementById('fabricanteCapa').value;
  const linha1 = document.getElementById('linha1Capa').value.trim();
  const linha2 = document.getElementById('linha2Capa').value.trim();
  const linha3 = document.getElementById('linha3Capa').value.trim();
  
  if (!fabricante || (!linha1 && !linha2 && !linha3)) {
    alert("Gere a imagem primeiro!");
    return;
  }

  const canvas = document.getElementById('canvasCapa');
  const partesModelo = [linha1, linha2, linha3].filter(p => p !== "").join(" ");
  const a = document.createElement("a");
  a.download = `${fabricante} ${partesModelo}.png`;
  a.href = addDpiToPng(canvas.toDataURL("image/png"), 300);
  a.click();
}

renderResultados('');
