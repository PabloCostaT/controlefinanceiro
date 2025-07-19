#!/bin/bash

# Script para configurar arquivos de ambiente
# Expense Tracker Application

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Configurando arquivos de ambiente${NC}"

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Função para gerar chave aleatória
generate_key() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Função para configurar ambiente
setup_env() {
    local env_file=$1
    local template_file=$2
    
    if [ -f "$env_file" ]; then
        warning "Arquivo $env_file já existe. Deseja sobrescrever? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log "Pulando $env_file"
            return
        fi
    fi
    
    log "Criando $env_file..."
    cp "$template_file" "$env_file"
    
    # Gerar chaves aleatórias se necessário
    if [[ "$env_file" != ".env.example" ]]; then
        if command -v openssl >/dev/null 2>&1; then
            log "Gerando chaves de segurança para $env_file..."
            
            # Gerar chaves
            NEXTAUTH_SECRET=$(generate_key)
            JWT_SECRET=$(generate_key)
            ENCRYPTION_KEY=$(generate_key)
            
            # Substituir no arquivo
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s/CHANGE-ME-.*-nextauth-secret-key-minimum-32-characters-required/$NEXTAUTH_SECRET/g" "$env_file"
                sed -i '' "s/CHANGE-ME-.*-jwt-secret-key-minimum-32-characters-required/$JWT_SECRET/g" "$env_file"
                sed -i '' "s/CHANGE-ME-.*-encryption-key-minimum-32-characters-required/$ENCRYPTION_KEY/g" "$env_file"
                sed -i '' "s/your-nextauth-secret-key-here-minimum-32-characters/$NEXTAUTH_SECRET/g" "$env_file"
                sed -i '' "s/your-jwt-secret-key-here-minimum-32-characters/$JWT_SECRET/g" "$env_file"
                sed -i '' "s/your-encryption-key-here-minimum-32-characters/$ENCRYPTION_KEY/g" "$env_file"
            else
                # Linux
                sed -i "s/CHANGE-ME-.*-nextauth-secret-key-minimum-32-characters-required/$NEXTAUTH_SECRET/g" "$env_file"
                sed -i "s/CHANGE-ME-.*-jwt-secret-key-minimum-32-characters-required/$JWT_SECRET/g" "$env_file"
                sed -i "s/CHANGE-ME-.*-encryption-key-minimum-32-characters-required/$ENCRYPTION_KEY/g" "$env_file"
                sed -i "s/your-nextauth-secret-key-here-minimum-32-characters/$NEXTAUTH_SECRET/g" "$env_file"
                sed -i "s/your-jwt-secret-key-here-minimum-32-characters/$JWT_SECRET/g" "$env_file"
                sed -i "s/your-encryption-key-here-minimum-32-characters/$ENCRYPTION_KEY/g" "$env_file"
            fi
        else
            warning "OpenSSL não encontrado. Você precisará configurar as chaves manualmente."
        fi
    fi
    
    log "✅ $env_file configurado com sucesso!"
}

# Menu de opções
echo "Selecione o ambiente para configurar:"
echo "1) Desenvolvimento Local (.env.local)"
echo "2) Desenvolvimento Docker (.env.docker)"
echo "3) Produção (.env.production)"
echo "4) Testes (.env.test)"
echo "5) Todos os ambientes"
echo "0) Sair"

read -p "Opção: " option

case $option in
    1)
        setup_env ".env.local" ".env.example"
        ;;
    2)
        setup_env ".env.docker" ".env.example"
        ;;
    3)
        setup_env ".env.production" ".env.example"
        warning "IMPORTANTE: Configure as variáveis de produção antes de fazer deploy!"
        ;;
    4)
        setup_env ".env.test" ".env.example"
        ;;
    5)
        setup_env ".env.local" ".env.example"
        setup_env ".env.docker" ".env.example"
        setup_env ".env.production" ".env.example"
        setup_env ".env.test" ".env.example"
        ;;
    0)
        log "Saindo..."
        exit 0
        ;;
    *)
        error "Opção inválida!"
        ;;
esac

# Instruções finais
echo -e "${GREEN}"
echo "=========================================="
echo "✅ Configuração concluída!"
echo "=========================================="
echo "Próximos passos:"
echo "1. Configure as variáveis específicas do seu ambiente"
echo "2. Configure o banco de dados"
echo "3. Configure o SMTP para emails"
echo "4. Execute: npm run dev (desenvolvimento)"
echo "   ou: docker-compose up (Docker)"
echo "=========================================="
echo -e "${NC}"

# Verificar se .env existe (link simbólico para desenvolvimento)
if [ ! -f ".env" ]; then
    if [ -f ".env.local" ]; then
        log "Criando link simbólico .env -> .env.local"
        ln -sf .env.local .env
    fi
fi
