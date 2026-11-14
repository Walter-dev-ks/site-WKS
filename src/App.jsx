import React, { useState, useEffect } from 'react';
import { Icon, ProductPreview, faq } from './ui';
import { sales, media } from './config';

const themes = [{ name: 'Azul', color: '#3384ff' }, { name: 'Dourado', color: '#c59b51' }, { name: 'Verde', color: '#2aad85' }];
const views = [{ id: 'agenda', label: 'Agenda da equipe' }, { id: 'clientes', label: 'Gestão de clientes' }, { id: 'financeiro', label: 'Visão financeira' }];
function Logo() {
  return <a className="brand" href="#inicio" aria-label="WKS Systems — início"><span className="logo-crop"><img src="/media/wks-logo-light.png" alt="WKS Systems — Soluções que impulsionam" width="1536" height="1024" /></span></a>;
}
function CTA({ children = 'Agendar demonstração', dark = false, className = '' }) {
  return <a className={`button ${dark ? 'button-dark' : 'button-blue'} ${className}`} href="#demonstracao">{children}<Icon size={18} /></a>;
}
function Kicker({ children }) { return <span className="kicker"><i />{children}</span>; }

function AgendaPreview({ name = 'Sua Barbearia', color = '#3384ff' }) {
  return <div className="agenda-app" style={{ '--accent': color }}>
    <div className="app-toolbar"><span className="app-initial">{name.slice(0, 1).toUpperCase()}</span><strong>{name}</strong><span className="app-toolbar-right">VISÃO DA EQUIPE<Icon name="calendar" size={17} /></span></div>
    <div className="agenda-heading"><div><span>ROTINA ORGANIZADA</span><h3>Sua agenda, em um lugar.</h3></div><span className="date-pill">Dia de exemplo</span></div>
    <div className="week-strip">{['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((day, i) => <span className={i === 3 ? 'selected' : ''} key={day}>{day}<strong>{12 + i}</strong></span>)}</div>
    <div className="agenda-columns"><div className="time-column"><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span></div>{['André', 'Lucas', 'Marcos'].map((barber, i) => <div className="barber-column" key={barber}><div className="barber-name"><span>{barber[0]}</span>{barber}</div><div className={`appointment appointment-${i}`}><small>{i === 1 ? '10:00' : '09:00'} · 45 min</small><strong>{['Rafael Martins', 'Pedro Alves', 'Gabriel Costa'][i]}</strong><span>{i === 1 ? 'Corte + barba' : 'Corte masculino'}</span></div><div className="appointment secondary"><small>11:00 · 30 min</small><strong>{['João Lima', 'Daniel Souza', 'Mateus Dias'][i]}</strong><span>Corte masculino</span></div></div>)}</div>
    <div className="app-footnote">Prévia conceitual · nomes e dados fictícios</div>
  </div>;
}
function FinancePreview() {
  return <div className="finance-app"><div className="app-toolbar"><Icon name="chart" /><strong>Visão financeira</strong><span className="date-pill">Mês de exemplo</span></div><div className="finance-content"><span className="app-label">ACOMPANHE A OPERAÇÃO</span><h3>Os números, à vista.</h3><div className="finance-totals"><div><span>Entradas</span><strong>R$ 12.480<span>,00</span></strong></div><span className="chart-icon"><Icon name="chart" size={26} /></span></div><div className="chart-bars" aria-label="Gráfico ilustrativo de movimentações">{[32, 53, 41, 72, 55, 87, 67, 95, 76, 100].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div><div className="chart-axis"><span>INÍCIO DO MÊS</span><span>FIM DO MÊS</span></div><div className="finance-row"><span>Comissões da equipe</span><strong>R$ 3.744,00</strong></div><div className="finance-row"><span>Saídas registradas</span><strong>R$ 1.920,00</strong></div><div className="app-footnote">Dados ilustrativos · não representam resultados de clientes</div></div></div>;
}
function ProductView({ view, color = '#3384ff', name = 'Sua Barbearia' }) {
  const source = media[view] || (view === 'agenda' ? media.dashboard : null);
  if (source) return <img className="real-capture" src={source} alt={`Captura real do sistema — ${view}`} />;
  if (view === 'clientes') return <ProductPreview name={name} color={color} />;
  if (view === 'financeiro') return <FinancePreview />;
  return <AgendaPreview name={name} color={color} />;
}
function BenefitList({ items }) {
  return <ul className="benefits">{items.map(([title, text]) => <li key={title}><span className="check-disc"><Icon name="check" size={15} /></span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul>;
}
function FeatureSection({ id, kicker, title, items, view, reverse = false }) {
  return <section id={id} className={`feature-section ${reverse ? 'reverse' : ''}`}><div className="container feature-layout"><div className="feature-copy"><Kicker>{kicker}</Kicker><h2>{title}</h2><BenefitList items={items} /><a className="text-link" href="#demonstracao">Ver em uma demonstração<span><Icon size={17} /></span></a></div><div className={`feature-stage stage-${view}`}><div className="stage-photo" /><div className="stage-product"><ProductView view={view} /></div><span className="stage-note">PRÉVIA ILUSTRATIVA DO PRODUTO</span></div></div></section>;
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [view, setView] = useState('agenda');
  const [theme, setTheme] = useState(0);
  const [shop, setShop] = useState('Sua Barbearia');
  const [error, setError] = useState('');
  const color = themes[theme].color;
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const elements = document.querySelectorAll('.feature-copy, .feature-stage, .brand-section-heading, .brand-playground, .section-heading, .steps article, .faq-layout > div, .demo-panel, .proof-grid > div');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    elements.forEach((element, index) => {
      element.style.setProperty('--reveal-delay', (index % 2) * 75 + 'ms');
      element.classList.add('reveal-pending');
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach(element => element.classList.remove('reveal-pending'));
    };
  }, []);
  function requestDemo(event) {
    event.preventDefault();
    if (!/^\d{12,13}$/.test(sales.whatsapp)) {
      setError('O WhatsApp comercial está sendo configurado. Em breve você poderá solicitar sua demonstração por aqui.');
      return;
    }
    const data = new FormData(event.currentTarget);
    const message = `Olá, WKS Systems! Quero uma demonstração do sistema.\nNome: ${data.get('name')}\nBarbearia: ${data.get('shop')}`;
    window.location.assign(`https://wa.me/${sales.whatsapp}?text=${encodeURIComponent(message)}`);
  }
  return <>
    <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <header className="header"><div className="container header-inner"><Logo /><nav id="main-nav" className={menu ? 'nav open' : 'nav'} aria-label="Navegação principal">{[['#sistema', 'O sistema'], ['#recursos', 'Recursos'], ['#sua-marca', 'Sua marca'], ['#duvidas', 'Dúvidas']].map(([href, label]) => <a href={href} key={href} onClick={() => setMenu(false)}>{label}</a>)}</nav><CTA className="nav-cta">Agendar demonstração</CTA><button className="menu-button" aria-label={menu ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menu} aria-controls="main-nav" onClick={() => setMenu(!menu)}><Icon name={menu ? 'close' : 'menu'} /></button></div></header>
    <main id="conteudo">
      <section className="hero" id="inicio"><div className="container hero-content"><Kicker>WKS SYSTEMS / CRM PARA BARBEARIAS</Kicker><h1>SUA BARBEARIA.<br />NO PRÓXIMO NÍVEL.</h1><p>Sua agenda, seus clientes, o seu nome na fachada.<br className="desktop-break" /> A WKS organiza os bastidores para você cuidar do que faz melhor.</p><div className="hero-actions"><CTA /><a href="#sistema" className="hero-secondary">Conhecer o sistema <Icon size={16} /></a></div></div>
        <div className="container hero-product" id="sistema"><div className="hero-color-block" /><div className="hero-photo-card"><img src="/media/barber.jpg" alt="Barbeiro atendendo um cliente na barbearia" width="600" height="700" /></div><div className="hero-dashboard" id="product-preview" role="tabpanel" aria-labelledby={`view-${view}`}><ProductView view={view} /></div><div className="floating-notice"><span><Icon name={view === 'financeiro' ? 'chart' : 'check'} size={19} /></span><div><strong>{view === 'agenda' ? 'Mais clareza na rotina.' : view === 'clientes' ? 'Cada cliente, bem atendido.' : 'Sua gestão, mais próxima.'}</strong><small>Sua marca. Nossa tecnologia.</small></div></div><div className="hero-small-label"><Icon name="spark" size={16} /><span>COM A IDENTIDADE<br />DA SUA BARBEARIA</span></div></div>
        <div className="hero-controls" role="tablist" aria-label="Explore as prévias do sistema">{views.map(item => <button key={item.id} id={`view-${item.id}`} role="tab" aria-selected={view === item.id} aria-controls="product-preview" tabIndex={view === item.id ? 0 : -1} onKeyDown={event => { const index = views.findIndex(entry => entry.id === view); const next = event.key === 'ArrowRight' ? (index + 1) % views.length : event.key === 'ArrowLeft' ? (index + views.length - 1) % views.length : event.key === 'Home' ? 0 : event.key === 'End' ? views.length - 1 : null; if (next !== null) { event.preventDefault(); setView(views[next].id); event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus(); } }} onClick={() => setView(item.id)}><i />{item.label}</button>)}</div><p id="hero-preview-note" className="illustration-note">Telas conceituais com dados fictícios. Veja o produto real na demonstração.</p>
      </section>
      <section className="proof-strip"><div className="container"><Kicker>TECNOLOGIA QUE JÁ SAIU DO PAPEL</Kicker><div className="proof-grid"><div><strong>EM OPERAÇÃO</strong><p>Sistema pronto e em uso por uma barbearia.</p></div><div><strong>COM A SUA MARCA</strong><p>Seu nome, sua logo e as suas cores.</p></div><div><strong>TUDO CONECTADO</strong><p>Agenda, clientes, equipe e financeiro.</p></div></div></div></section>
      <div id="recursos">
        <FeatureSection id="agenda" kicker="ORGANIZE O MOVIMENTO" title={<>MENOS IMPROVISO.<br />MAIS CONTROLE.</>} view="agenda" items={[
          ['Sua agenda em uma visão', 'Acompanhe agendamentos e a visão diária da barbearia sem depender de informações espalhadas.'],
          ['O ritmo da sua equipe', 'Organize os profissionais e seus horários de atendimento.'],
          ['Cada serviço no seu tempo', 'Cadastre serviços, preços e duração para estruturar a sua operação.']
        ]} />
        <FeatureSection id="clientes" kicker="CONHEÇA QUEM SENTA NA SUA CADEIRA" title={<>CLIENTES COM NOME.<br />ATENDIMENTO COM MEMÓRIA.</>} view="clientes" reverse items={[
          ['Informação que acompanha o cliente', 'Mantenha contatos, preferências e observações reunidos no cadastro.'],
          ['Planos para a sua operação', 'Organize os planos de atendimento e acompanhe as informações de cada cliente.'],
          ['Uma base para atender melhor', 'Deixe os detalhes acessíveis para a equipe e dê mais contexto a cada atendimento.']
        ]} />
        <FeatureSection id="financeiro" kicker="ENXERGUE O NEGÓCIO POR INTEIRO" title={<>CUIDE DO CORTE.<br />ACOMPANHE AS CONTAS.</>} view="financeiro" items={[
          ['Financeiro sem perder de vista', 'Consulte as movimentações e registre as saídas do negócio.'],
          ['Equipe e comissões', 'Defina os percentuais dos profissionais e acompanhe as comissões.'],
          ['Números para decidir', 'Explore relatórios por período e o faturamento por serviço.']
        ]} />
      </div>
      <section id="sua-marca" className="brand-section"><div className="container"><div className="brand-section-heading"><div><Kicker>SUA IDENTIDADE EM PRIMEIRO PLANO</Kicker><h2>A TECNOLOGIA É NOSSA.<br />A MARCA É SUA.</h2></div><p>O mesmo sistema, com a assinatura da sua barbearia. Experimente abaixo um nome e uma cor.</p></div><div className="brand-playground"><div className="brand-settings"><span className="settings-number">01 / SEU NOME</span><label htmlFor="brand-name">Como sua barbearia se chama?</label><input id="brand-name" value={shop} maxLength={30} onChange={e => setShop(e.target.value)} autoComplete="off" /><span className="settings-number">02 / SUAS CORES</span><div className="swatches" role="group" aria-label="Cor da simulação">{themes.map((item, i) => <button key={item.name} aria-label={item.name} aria-pressed={theme === i} style={{ '--swatch': item.color }} onClick={() => setTheme(i)}>{theme === i && <Icon name="check" size={18} />}</button>)}<span>{themes[theme].name}</span></div><span className="settings-number">03 / SUA LOGO</span><p>A sua logo completa a identidade visual do sistema.</p><div className="scope-note"><Icon name="lock" size={16} /><span>Mesmas funcionalidades e layout.<br />Personalização de nome, logo e cores.</span></div></div><div className="brand-live-preview" style={{ '--accent': color }}><div className="custom-brand-heading"><span>{(shop.trim() || 'S')[0].toUpperCase()}</span><div><small>BEM-VINDO À</small><strong>{shop.trim() || 'Sua Barbearia'}</strong></div><Icon name="spark" size={24} /></div>{media.identity ? <img className="real-capture" src={media.identity} alt="Personalização visual real do sistema" /> : <AgendaPreview name={shop.trim() || 'Sua Barbearia'} color={color} />}<span className="brand-preview-note">SIMULAÇÃO VISUAL · NÃO É UMA CAPTURA DO SISTEMA REAL</span></div></div></div></section>
      <section className="process-section"><div className="container"><div className="section-heading"><div><Kicker>SEU PRÓXIMO PASSO</Kicker><h2>VEJA. CONVERSE.<br />COLOQUE SUA MARCA.</h2></div><CTA>Conhecer a WKS</CTA></div><div className="steps">{[['01', 'Conheça o sistema', 'Uma demonstração do produto real para entender como ele se encaixa na sua rotina.'], ['02', 'Alinhe a proposta', 'Converse sobre os valores, as condições e a personalização da sua identidade.'], ['03', 'Traga sua marca', 'Defina nome, logo e cores para dar ao sistema a cara da sua barbearia.']].map(([n, title, description]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
      <section className="faq-section" id="duvidas"><div className="container faq-layout"><div><Kicker>CONVERSA DIRETA</Kicker><h2>PERGUNTAS REAIS.<br />RESPOSTAS CLARAS.</h2></div><div className="faq-list">{faq.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" size={18} /></summary><p>{answer}</p></details>)}</div></div></section>
      <section className="demo-section" id="demonstracao"><div className="container demo-panel"><div className="demo-copy"><Kicker>CONHEÇA O SISTEMA EM FUNCIONAMENTO</Kicker><h2>SUA BARBEARIA<br />TEM PERSONALIDADE.<br />SEU SISTEMA TAMBÉM.</h2><p>Vamos conversar sobre a sua operação? Veja a plataforma real e conheça a proposta da WKS Systems.</p><div className="demo-photo"><img src="/media/barber.jpg" alt="Atendimento profissional em uma barbearia" loading="lazy" /></div></div><form className="demo-form" onSubmit={requestDemo}><span className="form-kicker">AGENDE SUA DEMONSTRAÇÃO</span><h3>Vamos falar da<br />sua barbearia?</h3><label htmlFor="lead-name">Seu nome<input id="lead-name" name="name" placeholder="Como podemos chamar você?" autoComplete="name" required maxLength={80} /></label><label htmlFor="lead-shop">Nome da barbearia<input id="lead-shop" name="shop" placeholder="O nome que está na sua fachada" autoComplete="organization" required maxLength={100} /></label><button className="button button-dark" type="submit">Conversar pelo WhatsApp<Icon name="message" size={19} /></button><p className="privacy-note"><Icon name="lock" size={13} />Você revisa a mensagem no WhatsApp antes de enviar.</p>{!sales.whatsapp && <p className="pending-contact">WhatsApp comercial em configuração.</p>}<p className="form-error" role="status" aria-live="polite">{error}</p></form></div></section>
    </main>
    <footer><div className="container footer-grid"><div className="footer-brand"><Logo /><p>Gestão para barbearias.<br />Tecnologia com a sua identidade.</p><CTA>Vamos conversar</CTA></div><div><h3>O sistema</h3><a href="#agenda">Agenda e equipe</a><a href="#clientes">Gestão de clientes</a><a href="#financeiro">Financeiro e relatórios</a></div><div><h3>WKS Systems</h3><a href="#sua-marca">Sua identidade</a><a href="#duvidas">Dúvidas frequentes</a><a href="#demonstracao">Demonstração</a></div><div className="footer-statement">SOLUÇÕES<br />QUE IMPULSIONAM.<span>Sua marca. Nossa tecnologia.</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} WKS Systems. Todos os direitos reservados.</span><a href="#inicio">Voltar ao topo ↑</a></div></footer>
    <div className="mobile-sticky"><CTA /></div>
  </>;
}
