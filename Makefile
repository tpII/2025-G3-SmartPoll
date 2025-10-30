# Makefile para levantar blockchain y docker-compose

COMPOSE_FILE := ./docker-compose.stack.yml
BLOCKCHAIN_DIR := ./blockchain/fabric-chain
BLOCKCHAIN_INIT := ./blockchain/fabric-chain/init.sh
BLOCKCHAIN_DOWN := ./blockchain/fabric-chain/down.sh

.PHONY: all blockchain up down clean logs

all: up

blockchain:
	@echo "Iniciando blockchain..."
	@chmod +x $(BLOCKCHAIN_INIT)
	@cd $(BLOCKCHAIN_DIR) && ./init.sh
	@echo "Blockchain iniciada."

compose:
	@echo "Levantando stack de Docker..."
	@docker compose -f $(COMPOSE_FILE) up -d --build &> /dev/null

up: blockchain compose
	@echo "Blockchain + Docker corriendo."

down:
	@echo "Bajando stack de Docker..."
	@chmod +x $(BLOCKCHAIN_DOWN)
	@docker compose -f $(COMPOSE_FILE) down &> /dev/null
	@cd $(BLOCKCHAIN_DIR) && ./down.sh &> /dev/null

clean: down
	@echo "Limpiando blockchain..."
	@rm -rf ./blockchain/data || true
	@echo "Limpieza completa."

logs:
	@docker compose -f $(COMPOSE_FILE) logs -f