# 💰 Expense Tracker - Gerenciador de Despesas

Um sistema completo para gerenciamento de despesas pessoais e em grupo, desenvolvido com Next.js, TypeScript e Tailwind CSS.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/seulimacasafacil-8090s-projects/v0-teste)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/bly2LTs7Xz4)

## 🚀 Funcionalidades

- ✅ **Cadastro de Despesas**: Interface intuitiva para adicionar despesas rapidamente
- 👥 **Gestão de Membros**: Adicione e gerencie membros em projetos compartilhados
- 📊 **Dashboard Financeiro**: Visualize gastos com gráficos e relatórios
- 🔄 **Despesas Recorrentes**: Configure despesas que se repetem automaticamente
- 📱 **Design Responsivo**: Funciona perfeitamente em desktop, tablet e smartphone
- 🎨 **Interface Moderna**: Design limpo e intuitivo com Tailwind CSS
- 🔐 **Sistema de Permissões**: Controle de acesso baseado em funções
- 📈 **Relatórios Detalhados**: Análises completas dos seus gastos

## 🐳 Instalação com Docker

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) (versão 20.10 ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versão 2.0 ou superior)
- [Git](https://git-scm.com/) para clonar o repositório

### 🚀 Instalação Rápida

1. **Clone o repositório:**
\`\`\`bash
git clone https://github.com/seu-usuario/expense-tracker.git
cd expense-tracker
\`\`\`

2. **Execute com Docker Compose:**
\`\`\`bash
# Para produção (recomendado)
docker-compose up -d

# Para desenvolvimento
docker-compose -f docker-compose.dev.yml up -d
\`\`\`

3. **Acesse a aplicação:**
- **Aplicação**: http://localhost:3000
- **Banco de dados**: localhost:5432 (produção) ou localhost:5433 (desenvolvimento)
- **Redis**: localhost:6379

### 🛠️ Comandos Úteis

\`\`\`bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados do banco)
docker-compose down -v

# Ver logs da aplicação
docker-compose logs -f app

# Ver logs do banco de dados
docker-compose logs -f postgres

# Reconstruir as imagens
docker-compose build --no-cache

# Executar apenas a aplicação
docker-compose up app

# Executar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up -d
\`\`\`

### 🔧 Configuração Avançada

#### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

\`\`\`env
# Aplicação
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000

# Banco de dados
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/expense_tracker
POSTGRES_DB=expense_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# Redis (opcional)
REDIS_URL=redis://redis:6379

# Autenticação (configure conforme necessário)
NEXTAUTH_SECRET=seu-secret-super-seguro-aqui
NEXTAUTH_URL=http://localhost:3000

# Upload de arquivos (opcional)
UPLOAD_MAX_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
\`\`\`

#### Personalizar Portas

Para alterar as portas padrão, edite o arquivo `docker-compose.yml`:

\`\`\`yaml
services:
  app:
    ports:
      - "8080:3000"  # Aplicação na porta 8080
  
  postgres:
    ports:
      - "5433:5432"  # PostgreSQL na porta 5433
\`\`\`

### 🏗️ Estrutura dos Containers

| Serviço | Descrição | Porta | Status |
|---------|-----------|-------|--------|
| **app** | Aplicação Next.js | 3000 | Obrigatório |
| **postgres** | Banco de dados PostgreSQL | 5432 | Recomendado |
| **redis** | Cache Redis | 6379 | Opcional |
| **nginx** | Proxy reverso | 80/443 | Opcional |

### 📊 Monitoramento

#### Verificar Status dos Containers

\`\`\`bash
# Ver containers em execução
docker-compose ps

# Ver uso de recursos
docker stats

# Ver logs em tempo real
docker-compose logs -f
\`\`\`

#### Health Checks

\`\`\`bash
# Verificar se a aplicação está respondendo
curl http://localhost:3000/api/health

# Verificar conexão com o banco
docker-compose exec postgres pg_isready -U postgres
\`\`\`

### 🔄 Backup e Restore

#### Backup do Banco de Dados

\`\`\`bash
# Criar backup
docker-compose exec postgres pg_dump -U postgres expense_tracker > backup.sql

# Backup com timestamp
docker-compose exec postgres pg_dump -U postgres expense_tracker > "backup_$(date +%Y%m%d_%H%M%S).sql"
\`\`\`

#### Restore do Banco de Dados

\`\`\`bash
# Restaurar backup
docker-compose exec -T postgres psql -U postgres expense_tracker < backup.sql
\`\`\`

### 🚀 Deploy em Produção

#### Docker Swarm

\`\`\`bash
# Inicializar swarm
docker swarm init

# Deploy da stack
docker stack deploy -c docker-compose.yml expense-tracker
\`\`\`

#### Kubernetes

\`\`\`bash
# Converter docker-compose para Kubernetes
kompose convert

# Aplicar no cluster
kubectl apply -f .
\`\`\`

### 🐛 Troubleshooting

#### Problemas Comuns

1. **Porta já em uso:**
\`\`\`bash
# Verificar qual processo está usando a porta
lsof -i :3000

# Parar containers conflitantes
docker-compose down
\`\`\`

2. **Erro de permissão no banco:**
\`\`\`bash
# Recriar volumes do banco
docker-compose down -v
docker-compose up -d postgres
\`\`\`

3. **Aplicação não conecta ao banco:**
\`\`\`bash
# Verificar se o banco está rodando
docker-compose logs postgres

# Testar conexão
docker-compose exec app ping postgres
\`\`\`

4. **Rebuild completo:**
\`\`\`bash
# Limpar tudo e reconstruir
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
\`\`\`

### 📝 Logs e Debugging

\`\`\`bash
# Logs detalhados da aplicação
docker-compose logs -f --tail=100 app

# Entrar no container da aplicação
docker-compose exec app sh

# Verificar variáveis de ambiente
docker-compose exec app env

# Monitorar recursos
docker-compose exec app top
\`\`\`

## 🛠️ Desenvolvimento Local

### Sem Docker

Se preferir executar sem Docker:

\`\`\`bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
\`\`\`

### Com Docker (Desenvolvimento)

\`\`\`bash
# Modo desenvolvimento com hot reload
docker-compose -f docker-compose.dev.yml up -d

# Ver logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f app-dev
\`\`\`

## 📚 Documentação Adicional

- [Guia de Contribuição](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- 📧 Email: suporte@expense-tracker.com
- 💬 Discord: [Servidor da Comunidade](https://discord.gg/expense-tracker)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/expense-tracker/issues)
- 📖 Wiki: [Documentação Completa](https://github.com/seu-usuario/expense-tracker/wiki)

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Docker**
\`\`\`

Por fim, vamos criar um arquivo de configuração do Next.js otimizado para Docker:
