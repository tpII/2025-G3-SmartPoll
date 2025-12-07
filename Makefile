# Makefile para levantar blockchain y docker-compose

COMPOSE_FILE := ./docker-compose.stack.yml
BLOCKCHAIN_DIR := ./blockchain/fabric-chain
BLOCKCHAIN_INIT := ./blockchain/fabric-chain/init.sh
BLOCKCHAIN_DOWN := ./blockchain/fabric-chain/down.sh
FABRIC_VERSION := 2.5.14
CA_VERSION := 1.5.15

.PHONY: all prepare blockchain up down clean logs

all: prepare up

prepare:
	@echo "Descargando imagenes..."
	@curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
	@./install-fabric.sh -f $(FABRIC_VERSION) -c $(CA_VERSION) d &> /dev/null
	@rm -f install-fabric.sh
	@echo "Imagenes descargadas."

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
	@cd ./blockchain/explorer && docker compose -f docker-compose.yml up -d --build &> /dev/null
	@echo "Hyperledger Explorer iniciado."

up: blockchain compose explorer
	@echo "Blockchain + Docker corriendo + explorer."

down:
	@chmod +x $(BLOCKCHAIN_DOWN)
	@echo "Bajando explorer..."
	@cd ./blockchain/explorer && docker compose -f docker-compose.yml down -v &> /dev/null
	@echo "Bajando stack de Docker..."
	@docker compose -f $(COMPOSE_FILE) down -v &> /dev/null
	@echo "Bajando blockchain..."
	@cd $(BLOCKCHAIN_DIR) && ./down.sh &> /dev/null

clean: down
	@echo "Limpiando blockchain..."
	@rm -rf ./blockchain/data || true
	@echo "Limpieza completa."

logs:
	@docker compose -f $(COMPOSE_FILE) logs -f