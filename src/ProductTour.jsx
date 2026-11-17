import React, { useState } from 'react';
import { Icon } from './ui';

const screens = [
  { id: 'agendamento', label: 'Cliente', number: '01', title: 'O próximo corte começa no celular.', description: 'Um fluxo de agendamento com a identidade da sua barbearia. O cliente informa seus dados e escolhe os serviços, o profissional e o horário disponível.', points: ['Agendamento pelo navegador do celular', 'Horários conforme a disponibilidade da equipe', 'Nome, logo e cores da sua barbearia'], alt: 'Tela real do agendamento online com identidade Murialan e início da conversa para informar o nome', width: 628, height: 906 },
  { id: 'profissional', label: 'Profissional', number: '02', title: 'Cada profissional acompanha sua rotina.', description: 'Uma área para consultar a agenda, acompanhar comissões e organizar o atendimento ao longo do dia.', points: ['Agenda própria e visão da equipe', 'Encaixes e bloqueios de horários', 'Comissão, valores previstos e notificações'], alt: 'Área real do profissional com agenda, encaixe rápido, bloqueio de agenda e resumo de comissões', width: 1323, height: 639 },
  { id: 'painel', label: 'Gestão', number: '03', title: 'A operação inteira, à vista.', description: 'O painel reúne indicadores do período e avisos que ajudam a secretaria e a gestão a acompanhar o que precisa de atenção.', points: ['Faturamento, agendamentos e novos clientes', 'Avisos de vencimento e saldo dos planos', 'Atendimentos pendentes de conclusão'], alt: 'Dashboard real do sistema com indicadores, avisos de planos e agenda do mês em ambiente sem movimentação', width: 1331, height: 642 },
  { id: 'financeiro', label: 'Financeiro', number: '04', title: 'Do atendimento ao fechamento.', description: 'Acompanhe as entradas dos atendimentos, registre saídas e consulte os valores da equipe para fechar o período.', points: ['Faturamento bruto, líquido e previsto', 'Comissões e fechamento da equipe', 'Movimentações e outros pagamentos'], alt: 'Tela real do financeiro com faturamento, comissões por profissional e movimentações do mês', width: 1283, height: 639 },
  { id: 'relatorios', label: 'Relatórios', number: '05', title: 'Os números também saem em PDF.', description: 'Selecione o período, confira a prévia e baixe o relatório para acompanhar os resultados da barbearia.', points: ['Relatórios mensais e anuais', 'Faturamento, comissões e atendimentos', 'Prévia e download em PDF'], alt: 'Tela real de relatórios com seleção de período, prévia de indicadores e botão para baixar PDF', width: 1330, height: 635 },
];

export default function ProductTour() {
  const [selected, setSelected] = useState(0);
  const screen = screens[selected];
  function navigate(event) {
    const next = event.key === 'ArrowRight' ? (selected + 1) % screens.length : event.key === 'ArrowLeft' ? (selected + screens.length - 1) % screens.length : event.key === 'Home' ? 0 : event.key === 'End' ? screens.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  }
  return <section className="product-tour" id="telas" aria-labelledby="tour-title"><div className="container">
    <div className="tour-heading"><div><span className="kicker"><i />POR DENTRO DA PLATAFORMA</span><h2 id="tour-title">DO PRIMEIRO HORÁRIO.<br />AO ÚLTIMO NÚMERO.</h2></div><p>Explore telas reais do sistema, da experiência do cliente à gestão da barbearia.</p></div>
    <div className="tour-tabs" role="tablist" aria-label="Telas reais do sistema">{screens.map((item, index) => <button type="button" key={item.id} role="tab" id={`tour-tab-${item.id}`} aria-selected={selected === index} aria-controls="tour-panel" tabIndex={selected === index ? 0 : -1} onKeyDown={navigate} onClick={() => setSelected(index)}><span>{item.number}</span>{item.label}</button>)}</div>
    <div className={`tour-panel ${screen.id === 'agendamento' ? 'tour-phone' : ''}`} role="tabpanel" id="tour-panel" aria-labelledby={`tour-tab-${screen.id}`} tabIndex={0}>
      <div className="tour-capture" key={screen.id}><div className="tour-image-scroll" tabIndex={0} role="region" aria-label={`Captura da tela: ${screen.label}`}><img src={`/media/product/${screen.id}.png`} alt={screen.alt} width={screen.width} height={screen.height} loading="lazy" decoding="async" /></div><div className="tour-image-caption"><span>CAPTURA REAL DO SISTEMA</span><a href={`/media/product/${screen.id}.png`} target="_blank" rel="noopener noreferrer">Ampliar tela <Icon size={14} /></a></div>{screen.id !== 'agendamento' && <p className="tour-scroll-hint">Deslize a imagem para explorar a tela.</p>}</div>
      <div className="tour-copy"><span className="tour-number">{screen.number} / {screen.label}</span><h3>{screen.title}</h3><p>{screen.description}</p><ul>{screen.points.map(point => <li key={point}><Icon name="check" size={16} />{point}</li>)}</ul><a className="text-link" href="#demonstracao">Ver em uma demonstração <span><Icon size={17} /></span></a></div>
    </div>
    <p className="tour-brand-note"><Icon name="spark" size={18} /><span><strong>A marca nas telas é um exemplo de implantação.</strong> Sua barbearia recebe o próprio nome, a própria logo e as próprias cores, mantendo a base de funcionalidades e o layout. Datas, valores e regras exibidos pertencem ao exemplo.</span></p>
  </div></section>;
}

export function OperationResources() {
  const resources = [
    ['calendar', 'Uma agenda que acompanha o dia', 'Agendamentos, encaixes e bloqueios, com disponibilidade por profissional.'],
    ['people', 'Planos com créditos', 'Cadastre planos mensais e acompanhe o consumo e os créditos de cada cliente.'],
    ['chart', 'Fechamento e repasses', 'Consulte comissões e acompanhe os pagamentos da equipe por período.'],
    ['message', 'Contato pelo WhatsApp', 'Mensagem de confirmação pronta para o cliente enviar ao profissional pelo WhatsApp.'],
    ['spark', 'Avisos para a equipe', 'Notificações de novos agendamentos, mediante ativação e permissão do dispositivo.'],
    ['grid', 'Gestão com contexto', 'Clientes, serviços, profissionais, financeiro e relatórios na mesma plataforma.'],
  ];
  return <section className="operation-resources" aria-labelledby="operation-title"><div className="container"><div className="section-heading"><div><span className="kicker"><i />OS DETALHES DA ROTINA TAMBÉM CONTAM</span><h2 id="operation-title">MAIS CONTROLE.<br />DO SEU JEITO.</h2></div><p>Recursos que conectam o atendimento de hoje à gestão do mês.</p></div><div className="operation-grid">{resources.map(([icon, title, text]) => <article key={title}><Icon name={icon} size={24} /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>;
}
