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

explorer:
	@echo "Iniciando Hyperledger Explorer..."
	@cd ./blockchain/explorer && docker compose -f docker-compose.yml up --build 
	@echo "Hyperledger Explorer iniciado."

up: blockchain compose explorer
	@echo "Blockchain + Docker corriendo + explorer."

down:
	@echo "Bajando stack de Docker..."
	@chmod +x $(BLOCKCHAIN_DOWN)
	@cd ./blockchain/explorer && docker compose -f docker-compose.yml down -v &> /dev/null
	@docker compose -f $(COMPOSE_FILE) down -v &> /dev/null
	@cd $(BLOCKCHAIN_DIR) && ./down.sh &> /dev/null

clean: down
	@echo "Limpiando blockchain..."
	@rm -rf ./blockchain/data || true
	@echo "Limpieza completa."

logs:
	@docker compose -f $(COMPOSE_FILE) logs -f