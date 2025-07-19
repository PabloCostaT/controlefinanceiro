#!/bin/bash

# Script para monitorar mudanças nos arquivos de ambiente
# e revalidar automaticamente

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}👀 Monitorando arquivos de ambiente...${NC}"
echo "Pressione Ctrl+C para parar"

# Função para executar validação
run_validation() {
    echo ""
    echo -e "${YELLOW}🔄 Arquivo modificado, revalidando...${NC}"
    echo "========================================"
    ./validate-env.sh
    echo ""
    echo -e "${BLUE}👀 Continuando monitoramento...${NC}"
}

# Verificar se fswatch está disponível
if command -v fswatch >/dev/null 2>&1; then
    # Usar fswatch (macOS/Linux com fswatch instalado)
    fswatch -o .env* | while read f; do run_validation; done
elif command -v inotifywait >/dev/null 2>&1; then
    # Usar inotifywait (Linux)
    while inotifywait -e modify .env* 2>/dev/null; do
        run_validation
    done
else
    # Fallback: polling manual
    echo -e "${YELLOW}⚠️ fswatch/inotifywait não encontrado, usando polling...${NC}"
    
    declare -A file_times
    
    # Inicializar tempos dos arquivos
    for file in .env*; do
        if [ -f "$file" ]; then
            file_times["$file"]=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null)
        fi
    done
    
    while true; do
        sleep 2
        
        for file in .env*; do
            if [ -f "$file" ]; then
                current_time=$(stat -c %Y "$file" 2>/dev/null || stat -f %m "$file" 2>/dev/null)
                if [ "${file_times[$file]}" != "$current_time" ]; then
                    file_times["$file"]=$current_time
                    run_validation
                    break
                fi
            fi
        done
    done
fi
