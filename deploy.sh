#!/bin/bash

# Script de Deploy para Docker Swarm
# Expense Tracker Application

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
STACK_NAME="expense-tracker"
IMAGE_NAME="expense-tracker"
REGISTRY_URL="registry.seulimacasafacil.com.br"

echo -e "${BLUE}🚀 Iniciando deploy do Expense Tracker${NC}"

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

# Verificar se está em um nó manager
if ! docker node ls >/dev/null 2>&1; then
    error "Este script deve ser executado em um nó manager do Docker Swarm"
fi

# Verificar se a rede existe
if ! docker network ls | grep -q "network_public"; then
    warning "Rede 'network_public' não encontrada. Criando..."
    docker network create --driver overlay --attachable network_public
fi

# Verificar se os volumes existem
log "Verificando volumes..."
if ! docker volume ls | grep -q "expense_tracker_uploads"; then
    log "Criando volume expense_tracker_uploads..."
    docker volume create expense_tracker_uploads
fi

if ! docker volume ls | grep -q "expense_tracker_backups"; then
    log "Criando volume expense_tracker_backups..."
    docker volume create expense_tracker_backups
fi

# Build da imagem (se necessário)
if [ "$1" = "--build" ]; then
    log "Fazendo build da imagem..."
    docker build -t ${IMAGE_NAME}:latest .
    
    if [ ! -z "$REGISTRY_URL" ]; then
        log "Fazendo push para o registry..."
        docker tag ${IMAGE_NAME}:latest ${REGISTRY_URL}/${IMAGE_NAME}:latest
        docker push ${REGISTRY_URL}/${IMAGE_NAME}:latest
    fi
fi

# Verificar se o arquivo .env.production existe
if [ ! -f ".env.production" ]; then
    warning "Arquivo .env.production não encontrado. Usando valores padrão."
fi

# Deploy do stack
log "Fazendo deploy do stack..."
docker stack deploy -c stack.yaml ${STACK_NAME}

# Aguardar serviços ficarem prontos
log "Aguardando serviços ficarem prontos..."
sleep 10

# Verificar status dos serviços
log "Verificando status dos serviços..."
docker stack services ${STACK_NAME}

# Verificar se todos os serviços estão rodando
SERVICES_COUNT=$(docker stack services ${STACK_NAME} --format "{{.Replicas}}" | grep -c "0/")
if [ "$SERVICES_COUNT" -gt 0 ]; then
    warning "Alguns serviços ainda não estão prontos. Aguarde alguns minutos."
else
    log "✅ Todos os serviços estão rodando!"
fi

# Mostrar logs dos serviços (últimas 50 linhas)
if [ "$1" = "--logs" ] || [ "$2" = "--logs" ]; then
    log "Mostrando logs dos serviços..."
    docker service logs --tail 50 ${STACK_NAME}_expense_tracker_app
fi

# Informações finais
echo -e "${GREEN}"
echo "=========================================="
echo "🎉 Deploy concluído com sucesso!"
echo "=========================================="
echo "Stack: ${STACK_NAME}"
echo "URL: https://despesas.seulimacasafacil.com.br"
echo "API: https://api-despesas.seulimacasafacil.com.br"
echo ""
echo "Comandos úteis:"
echo "  docker stack services ${STACK_NAME}"
echo "  docker service logs ${STACK_NAME}_expense_tracker_app"
echo "  docker stack rm ${STACK_NAME}"
echo "=========================================="
echo -e "${NC}"
