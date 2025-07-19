# Makefile para Expense Tracker
# Comandos úteis para desenvolvimento e deploy

.PHONY: help install dev build test validate-env setup-env watch-env clean docker-build docker-up docker-down deploy

# Cores para output
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m

help: ## Mostrar esta ajuda
	@echo "$(BLUE)Expense Tracker - Comandos Disponíveis$(NC)"
	@echo "======================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Instalar dependências
	@echo "$(BLUE)📦 Instalando dependências...$(NC)"
	npm install

dev: validate-env ## Executar em modo desenvolvimento
	@echo "$(BLUE)🚀 Iniciando aplicação em modo desenvolvimento...$(NC)"
	npm run dev

build: validate-env ## Build da aplicação
	@echo "$(BLUE)🔨 Fazendo build da aplicação...$(NC)"
	npm run build

test: validate-env ## Executar testes
	@echo "$(BLUE)🧪 Executando testes...$(NC)"
	npm test

validate-env: ## Validar variáveis de ambiente
	@echo "$(BLUE)🔍 Validando variáveis de ambiente...$(NC)"
	@chmod +x validate-env.sh
	@./validate-env.sh

setup-env: ## Configurar arquivos de ambiente
	@echo "$(BLUE)⚙️ Configurando arquivos de ambiente...$(NC)"
	@chmod +x setup-env.sh
	@./setup-env.sh

watch-env: ## Monitorar mudanças nos arquivos de ambiente
	@echo "$(BLUE)👀 Monitorando arquivos de ambiente...$(NC)"
	@chmod +x watch-env.sh
	@./watch-env.sh

clean: ## Limpar arquivos temporários
	@echo "$(BLUE)🧹 Limpando arquivos temporários...$(NC)"
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf dist
	rm -rf build

docker-build: ## Build da imagem Docker
	@echo "$(BLUE)🐳 Fazendo build da imagem Docker...$(NC)"
	docker build -t expense-tracker .

docker-up: ## Subir containers Docker
	@echo "$(BLUE)🐳 Subindo containers Docker...$(NC)"
	docker-compose up -d

docker-down: ## Parar containers Docker
	@echo "$(BLUE)🐳 Parando containers Docker...$(NC)"
	docker-compose down

docker-logs: ## Ver logs dos containers
	@echo "$(BLUE)📋 Logs dos containers Docker...$(NC)"
	docker-compose logs -f

deploy: validate-env ## Deploy para produção
	@echo "$(BLUE)🚀 Fazendo deploy para produção...$(NC)"
	@chmod +x deploy.sh
	@./deploy.sh

lint: ## Executar linter
	@echo "$(BLUE)🔍 Executando linter...$(NC)"
	npm run lint

format: ## Formatar código
	@echo "$(BLUE)✨ Formatando código...$(NC)"
	npm run format

type-check: ## Verificar tipos TypeScript
	@echo "$(BLUE)📝 Verificando tipos TypeScript...$(NC)"
	npm run type-check

security-check: ## Verificar vulnerabilidades
	@echo "$(BLUE)🔒 Verificando vulnerabilidades...$(NC)"
	npm audit

update-deps: ## Atualizar dependências
	@echo "$(BLUE)📦 Atualizando dependências...$(NC)"
	npm update

backup-db: ## Fazer backup do banco de dados
	@echo "$(BLUE)💾 Fazendo backup do banco de dados...$(NC)"
	@chmod +x monitor.sh
	@./monitor.sh backup

restore-db: ## Restaurar backup do banco de dados
	@echo "$(BLUE)🔄 Restaurando backup do banco de dados...$(NC)"
	@chmod +x monitor.sh
	@./monitor.sh restore

status: ## Ver status dos serviços
	@echo "$(BLUE)📊 Status dos serviços...$(NC)"
	@chmod +x monitor.sh
	@./monitor.sh status

logs: ## Ver logs da aplicação
	@echo "$(BLUE)📋 Logs da aplicação...$(NC)"
	@chmod +x monitor.sh
	@./monitor.sh logs expense_tracker_app 100

# Comandos compostos
full-setup: setup-env install validate-env ## Configuração completa inicial
	@echo "$(GREEN)✅ Configuração completa finalizada!$(NC)"

dev-setup: setup-env install validate-env docker-up ## Setup para desenvolvimento
	@echo "$(GREEN)✅ Ambiente de desenvolvimento pronto!$(NC)"

prod-deploy: validate-env build deploy ## Deploy completo para produção
	@echo "$(GREEN)✅ Deploy para produção finalizado!$(NC)"

health-check: validate-env status ## Verificação completa de saúde
	@echo "$(GREEN)✅ Verificação de saúde finalizada!$(NC)"
