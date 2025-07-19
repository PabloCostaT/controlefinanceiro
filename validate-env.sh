#!/bin/bash

# Script para validar variáveis de ambiente
# Expense Tracker Application

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Arrays para armazenar resultados
FAILED_VARS=()
WARNING_VARS=()
MISSING_VARS=()

echo -e "${BLUE}🔍 Validando configurações de ambiente${NC}"
echo "=========================================="

# Função para log
log() {
    echo -e "${GREEN}[✓] $1${NC}"
    ((PASSED_CHECKS++))
}

error() {
    echo -e "${RED}[✗] $1${NC}"
    ((FAILED_CHECKS++))
    FAILED_VARS+=("$1")
}

warning() {
    echo -e "${YELLOW}[⚠] $1${NC}"
    ((WARNING_CHECKS++))
    WARNING_VARS+=("$1")
}

info() {
    echo -e "${CYAN}[ℹ] $1${NC}"
}

# Função para verificar se variável existe e não está vazia
check_required_var() {
    local var_name=$1
    local var_value=${!var_name}
    local description=$2
    
    ((TOTAL_CHECKS++))
    
    if [ -z "$var_value" ]; then
        error "$var_name não está definida - $description"
        MISSING_VARS+=("$var_name")
        return 1
    else
        log "$var_name está definida"
        return 0
    fi
}

# Função para verificar variável opcional
check_optional_var() {
    local var_name=$1
    local var_value=${!var_name}
    local description=$2
    
    ((TOTAL_CHECKS++))
    
    if [ -z "$var_value" ]; then
        warning "$var_name não está definida (opcional) - $description"
        return 1
    else
        log "$var_name está definida"
        return 0
    fi
}

# Função para validar URL
validate_url() {
    local url=$1
    local var_name=$2
    
    if [[ $url =~ ^https?:// ]]; then
        log "$var_name tem formato de URL válido"
        return 0
    else
        error "$var_name não tem formato de URL válido: $url"
        return 1
    fi
}

# Função para validar email
validate_email() {
    local email=$1
    local var_name=$2
    
    if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        log "$var_name tem formato de email válido"
        return 0
    else
        error "$var_name não tem formato de email válido: $email"
        return 1
    fi
}

# Função para validar porta
validate_port() {
    local port=$1
    local var_name=$2
    
    if [[ $port =~ ^[0-9]+$ ]] && [ "$port" -ge 1 ] && [ "$port" -le 65535 ]; then
        log "$var_name tem porta válida"
        return 0
    else
        error "$var_name não tem porta válida: $port"
        return 1
    fi
}

# Função para validar tamanho mínimo de string
validate_min_length() {
    local value=$1
    local min_length=$2
    local var_name=$3
    
    if [ ${#value} -ge $min_length ]; then
        log "$var_name tem tamanho adequado (${#value} caracteres)"
        return 0
    else
        error "$var_name muito curta (${#value} caracteres, mínimo $min_length)"
        return 1
    fi
}

# Função para testar conexão com banco
test_database_connection() {
    if [ -n "$DATABASE_URL" ]; then
        info "Testando conexão com banco de dados..."
        
        # Extrair componentes da URL do banco
        if [[ $DATABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
            local db_user="${BASH_REMATCH[1]}"
            local db_pass="${BASH_REMATCH[2]}"
            local db_host="${BASH_REMATCH[3]}"
            local db_port="${BASH_REMATCH[4]}"
            local db_name="${BASH_REMATCH[5]}"
            
            # Testar conexão usando psql se disponível
            if command -v psql >/dev/null 2>&1; then
                if PGPASSWORD="$db_pass" psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" -c "SELECT 1;" >/dev/null 2>&1; then
                    log "Conexão com banco de dados bem-sucedida"
                else
                    warning "Não foi possível conectar ao banco de dados"
                fi
            else
                warning "psql não encontrado - pulando teste de conexão com banco"
            fi
        else
            error "DATABASE_URL tem formato inválido"
        fi
    fi
}

# Função para testar conexão com Redis
test_redis_connection() {
    if [ -n "$REDIS_URL" ]; then
        info "Testando conexão com Redis..."
        
        # Extrair host e porta do Redis
        if [[ $REDIS_URL =~ redis://([^:]+):([0-9]+) ]]; then
            local redis_host="${BASH_REMATCH[1]}"
            local redis_port="${BASH_REMATCH[2]}"
            
            # Testar conexão usando redis-cli se disponível
            if command -v redis-cli >/dev/null 2>&1; then
                if redis-cli -h "$redis_host" -p "$redis_port" ping >/dev/null 2>&1; then
                    log "Conexão com Redis bem-sucedida"
                else
                    warning "Não foi possível conectar ao Redis"
                fi
            else
                warning "redis-cli não encontrado - pulando teste de conexão com Redis"
            fi
        else
            warning "REDIS_URL tem formato inválido ou é localhost"
        fi
    fi
}

# Carregar arquivo de ambiente
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    if [ -f ".env.local" ]; then
        ENV_FILE=".env.local"
    elif [ -f ".env.docker" ]; then
        ENV_FILE=".env.docker"
    elif [ -f ".env.production" ]; then
        ENV_FILE=".env.production"
    else
        error "Nenhum arquivo de ambiente encontrado!"
        exit 1
    fi
fi

info "Carregando variáveis de $ENV_FILE"
set -a
source "$ENV_FILE"
set +a

echo ""
echo -e "${PURPLE}📋 Validando variáveis obrigatórias...${NC}"
echo "----------------------------------------"

# Validar variáveis obrigatórias da aplicação
check_required_var "NODE_ENV" "Ambiente de execução (development/production/test)"
check_required_var "NEXT_PUBLIC_APP_URL" "URL base da aplicação"
check_required_var "NEXT_PUBLIC_API_URL" "URL da API"

# Validar URLs se definidas
if [ -n "$NEXT_PUBLIC_APP_URL" ]; then
    validate_url "$NEXT_PUBLIC_APP_URL" "NEXT_PUBLIC_APP_URL"
fi

if [ -n "$NEXT_PUBLIC_API_URL" ]; then
    validate_url "$NEXT_PUBLIC_API_URL" "NEXT_PUBLIC_API_URL"
fi

# Validar autenticação
echo ""
echo -e "${PURPLE}🔐 Validando configurações de autenticação...${NC}"
echo "------------------------------------------------"

check_required_var "NEXTAUTH_URL" "URL do NextAuth"
check_required_var "NEXTAUTH_SECRET" "Chave secreta do NextAuth"
check_required_var "JWT_SECRET" "Chave secreta do JWT"
check_required_var "ENCRYPTION_KEY" "Chave de criptografia"

# Validar tamanho das chaves
if [ -n "$NEXTAUTH_SECRET" ]; then
    validate_min_length "$NEXTAUTH_SECRET" 32 "NEXTAUTH_SECRET"
fi

if [ -n "$JWT_SECRET" ]; then
    validate_min_length "$JWT_SECRET" 32 "JWT_SECRET"
fi

if [ -n "$ENCRYPTION_KEY" ]; then
    validate_min_length "$ENCRYPTION_KEY" 32 "ENCRYPTION_KEY"
fi

# Validar banco de dados
echo ""
echo -e "${PURPLE}💾 Validando configurações de banco de dados...${NC}"
echo "------------------------------------------------"

check_required_var "DATABASE_URL" "String de conexão do PostgreSQL"

# Validar configurações de email
echo ""
echo -e "${PURPLE}📧 Validando configurações de email...${NC}"
echo "--------------------------------------------"

check_optional_var "SMTP_HOST" "Servidor SMTP"
check_optional_var "SMTP_PORT" "Porta do SMTP"
check_optional_var "SMTP_USER" "Usuário do SMTP"
check_optional_var "SMTP_PASS" "Senha do SMTP"
check_optional_var "SMTP_FROM" "Email remetente"

# Validar porta SMTP
if [ -n "$SMTP_PORT" ]; then
    validate_port "$SMTP_PORT" "SMTP_PORT"
fi

# Validar email remetente
if [ -n "$SMTP_FROM" ]; then
    validate_email "$SMTP_FROM" "SMTP_FROM"
fi

# Validar configurações de cache
echo ""
echo -e "${PURPLE}⚡ Validando configurações de cache...${NC}"
echo "-------------------------------------------"

check_optional_var "REDIS_URL" "URL do Redis para cache"

# Validar configurações de armazenamento
echo ""
echo -e "${PURPLE}☁️ Validando configurações de armazenamento...${NC}"
echo "-----------------------------------------------"

if [ "$S3_ENABLED" = "true" ]; then
    check_required_var "S3_ACCESS_KEY" "Chave de acesso S3"
    check_required_var "S3_SECRET_KEY" "Chave secreta S3"
    check_required_var "S3_BUCKET" "Nome do bucket S3"
    check_required_var "S3_ENDPOINT" "Endpoint do S3"
    check_required_var "S3_REGION" "Região do S3"
    
    if [ -n "$S3_PORT" ]; then
        validate_port "$S3_PORT" "S3_PORT"
    fi
else
    check_optional_var "UPLOAD_DIR" "Diretório para uploads locais"
    check_optional_var "MAX_FILE_SIZE" "Tamanho máximo de arquivo"
fi

# Validar configurações de segurança
echo ""
echo -e "${PURPLE}🛡️ Validando configurações de segurança...${NC}"
echo "--------------------------------------------"

check_optional_var "RATE_LIMIT_MAX" "Limite de requisições por janela"
check_optional_var "RATE_LIMIT_WINDOW" "Janela de tempo para rate limiting"
check_optional_var "CORS_ORIGIN" "Origem permitida para CORS"

# Validar timezone
echo ""
echo -e "${PURPLE}🌍 Validando configurações regionais...${NC}"
echo "--------------------------------------------"

check_optional_var "TZ" "Timezone do sistema"
check_optional_var "GENERIC_TIMEZONE" "Timezone genérico"

# Testes de conectividade
echo ""
echo -e "${PURPLE}🔌 Testando conectividade...${NC}"
echo "--------------------------------"

test_database_connection
test_redis_connection

# Validações específicas por ambiente
echo ""
echo -e "${PURPLE}🎯 Validações específicas do ambiente...${NC}"
echo "--------------------------------------------"

case "$NODE_ENV" in
    "production")
        # Em produção, certas variáveis são obrigatórias
        check_required_var "SMTP_HOST" "SMTP obrigatório em produção"
        check_required_var "SMTP_USER" "Usuário SMTP obrigatório em produção"
        check_required_var "SMTP_PASS" "Senha SMTP obrigatória em produção"
        
        # Verificar se não estamos usando valores padrão perigosos
        if [ "$NEXTAUTH_SECRET" = "your-nextauth-secret-key-here-minimum-32-characters" ]; then
            error "NEXTAUTH_SECRET ainda está com valor padrão em produção!"
        fi
        
        if [ "$JWT_SECRET" = "your-jwt-secret-key-here-minimum-32-characters" ]; then
            error "JWT_SECRET ainda está com valor padrão em produção!"
        fi
        
        if [[ "$DATABASE_URL" == *"password"* ]]; then
            warning "DATABASE_URL parece estar usando senha padrão"
        fi
        ;;
        
    "development")
        info "Ambiente de desenvolvimento - validações relaxadas"
        ;;
        
    "test")
        info "Ambiente de teste - usando configurações de teste"
        ;;
        
    *)
        warning "NODE_ENV desconhecido: $NODE_ENV"
        ;;
esac

# Relatório final
echo ""
echo "=========================================="
echo -e "${BLUE}📊 Relatório de Validação${NC}"
echo "=========================================="
echo -e "Total de verificações: ${CYAN}$TOTAL_CHECKS${NC}"
echo -e "Passou: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Falhou: ${RED}$FAILED_CHECKS${NC}"
echo -e "Avisos: ${YELLOW}$WARNING_CHECKS${NC}"

if [ $FAILED_CHECKS -gt 0 ]; then
    echo ""
    echo -e "${RED}❌ Variáveis com problemas:${NC}"
    for var in "${FAILED_VARS[@]}"; do
        echo -e "  ${RED}• $var${NC}"
    done
fi

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}📝 Variáveis faltando:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "  ${RED}• $var${NC}"
    done
    
    echo ""
    echo -e "${CYAN}💡 Para configurar as variáveis faltando:${NC}"
    echo "1. Edite o arquivo $ENV_FILE"
    echo "2. Ou execute: ./setup-env.sh"
    echo "3. Consulte .env.example para referência"
fi

if [ ${#WARNING_VARS[@]} -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠️ Avisos (opcionais):${NC}"
    for var in "${WARNING_VARS[@]}"; do
        echo -e "  ${YELLOW}• $var${NC}"
    done
fi

echo ""
if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✅ Todas as validações obrigatórias passaram!${NC}"
    echo -e "${GREEN}🚀 Aplicação pronta para execução${NC}"
    exit 0
else
    echo -e "${RED}❌ Algumas validações falharam${NC}"
    echo -e "${RED}🔧 Corrija os problemas antes de continuar${NC}"
    exit 1
fi
