#!/bin/bash

# Script de Monitoramento para Docker Swarm
# Expense Tracker Application

set -e

STACK_NAME="expense-tracker"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Função para mostrar status dos serviços
show_services() {
    echo -e "${BLUE}📊 Status dos Serviços${NC}"
    echo "=================================="
    docker stack services ${STACK_NAME} --format "table {{.Name}}\t{{.Mode}}\t{{.Replicas}}\t{{.Image}}"
    echo ""
}

# Função para mostrar uso de recursos
show_resources() {
    echo -e "${BLUE}💾 Uso de Recursos${NC}"
    echo "=================================="
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" \
        $(docker ps --filter "label=com.docker.stack.namespace=${STACK_NAME}" --format "{{.Names}}")
    echo ""
}

# Função para mostrar logs
show_logs() {
    local service=$1
    local lines=${2:-50}
    
    echo -e "${BLUE}📋 Logs do serviço: ${service}${NC}"
    echo "=================================="
    docker service logs --tail ${lines} ${STACK_NAME}_${service}
    echo ""
}

# Função para verificar saúde dos serviços
health_check() {
    echo -e "${BLUE}🏥 Verificação de Saúde${NC}"
    echo "=================================="
    
    # Verificar se a aplicação está respondendo
    if curl -s -o /dev/null -w "%{http_code}" https://despesas.seulimacasafacil.com.br/api/health | grep -q "200"; then
        echo -e "${GREEN}✅ Aplicação principal: OK${NC}"
    else
        echo -e "${RED}❌ Aplicação principal: FALHA${NC}"
    fi
    
    # Verificar API
    if curl -s -o /dev/null -w "%{http_code}" https://api-despesas.seulimacasafacil.com.br/health | grep -q "200"; then
        echo -e "${GREEN}✅ API: OK${NC}"
    else
        echo -e "${RED}❌ API: FALHA${NC}"
    fi
    
    echo ""
}

# Função para backup
backup() {
    echo -e "${BLUE}💾 Iniciando Backup${NC}"
    echo "=================================="
    
    BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="expense_tracker_backup_${BACKUP_DATE}.sql"
    
    # Executar backup do banco
    docker exec $(docker ps --filter "name=postgres" --format "{{.Names}}" | head -1) \
        pg_dump -U postgres expense_tracker > ${BACKUP_FILE}
    
    echo -e "${GREEN}✅ Backup salvo em: ${BACKUP_FILE}${NC}"
    echo ""
}

# Função para mostrar volumes
show_volumes() {
    echo -e "${BLUE}📁 Volumes${NC}"
    echo "=================================="
    docker volume ls --filter "name=expense_tracker"
    echo ""
    
    echo -e "${BLUE}💾 Uso de Espaço dos Volumes${NC}"
    echo "=================================="
    docker system df -v | grep expense_tracker || echo "Nenhum volume encontrado"
    echo ""
}

# Menu principal
case "$1" in
    "services"|"s")
        show_services
        ;;
    "resources"|"r")
        show_resources
        ;;
    "logs"|"l")
        SERVICE=${2:-"expense_tracker_app"}
        LINES=${3:-50}
        show_logs $SERVICE $LINES
        ;;
    "health"|"h")
        health_check
        ;;
    "backup"|"b")
        backup
        ;;
    "volumes"|"v")
        show_volumes
        ;;
    "all"|"a")
        show_services
        show_resources
        health_check
        show_volumes
        ;;
    *)
        echo -e "${YELLOW}🔧 Monitor do Expense Tracker${NC}"
        echo "=================================="
        echo "Uso: $0 [comando]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  services, s    - Mostrar status dos serviços"
        echo "  resources, r   - Mostrar uso de recursos"
        echo "  logs, l [serv] - Mostrar logs (padrão: expense_tracker_app)"
        echo "  health, h      - Verificar saúde dos serviços"
        echo "  backup, b      - Fazer backup do banco de dados"
        echo "  volumes, v     - Mostrar informações dos volumes"
        echo "  all, a         - Mostrar todas as informações"
        echo ""
        echo "Exemplos:"
        echo "  $0 services"
        echo "  $0 logs expense_tracker_worker 100"
        echo "  $0 health"
        ;;
esac
