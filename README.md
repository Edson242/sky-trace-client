# ✈️ SkyTrace Client

O **SkyTrace Client** é a interface tática operacional do ecossistema SkyTrace. Ele transforma um fluxo denso de dados de telemetria em uma estação de controle visual e imersiva. Projetado com foco em UI/UX para cenários de alta pressão, ele permite que operadores monitorem riscos climáticos e tomem decisões instantâneas.

## 🌟 Principais Funcionalidades (A Interface Tática)

- **Radar Dinâmico (Mapa em Tempo Real):** As aeronaves são renderizadas no mapa com ícones que rotacionam de acordo com a proa real do avião. As cores mudam dinamicamente (verde, amarelo, vermelho) refletindo o nível de ameaça atual.
- **Dashboard de Telemetria Analítica:** Ao selecionar um voo, o operador acessa um painel imersivo contendo:
  - **Perfil Vertical:** Gráfico mostrando o histórico recente de altitude, destacando áreas onde o voo entrou em estado crítico.
  - **Impacto Ambiental:** Gráfico cruzado que compara a força da natureza (ventos e precipitação) com a velocidade da aeronave, provando visualmente como o clima afeta o voo.
- **Sistema de Alertas Sensoriais:** Quando um voo entra em risco severo, o sistema dispara notificações visuais (*Toasts*) e alarmes sonoros automáticos para garantir a atenção imediata do operador.
- **Comando de Desvio (C2):** O operador tem poder de ação. Através do painel, é possível emitir um comando de "Desvio de Rota", enviando a ordem de volta ao servidor e registrando a ação de forma auditável.
- **Sidebar de Setor:** Uma visão geral constante que lista todas as aeronaves ativas, categorizando-as por risco e monitorando a saúde da conexão em tempo real.

## 🛠️ Tecnologias Utilizadas

- **Base:** React.js com Vite e TypeScript.
- **Gerenciamento de Estado:** Zustand (otimizado para evitar lentidão durante picos de atualizações em tempo real).
- **Estilização:** Tailwind CSS (Tema Dark Mode focado em interfaces militares/táticas).
- **Motores Visuais:** Leaflet com OpenStreetMap (Radar) e Recharts (Gráficos analíticos).

## 🚀 Deploy

O deploy em ambiente de produção do **SkyTrace Client** foi realizado na **Vercel**, garantindo entrega rápida de conteúdo (CDN) e integração contínua (CI/CD) simplificada.

---

### 💻 Como rodar localmente

1. Clone o repositório: `git clone https://github.com/Edson242/sky-trace-client`
2. Instale as dependências: `npm install`
3. Inicie o ambiente de desenvolvimento: `npm run dev`
4. Acesse no navegador: `http://localhost:5173`

*(Nota: É necessário clicar ao menos uma vez na tela para que o navegador permita a execução dos alarmes sonoros nativos).*