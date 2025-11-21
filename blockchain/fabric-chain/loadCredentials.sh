#!/bin/bash
# This script updates the admin private key path in the Hyperledger Explorer connection profile

KEYFILE=$(find "$PWD/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore" -name "*_sk")
HOST_PREFIX="$PWD/test-network/organizations"
CONTAINER_PREFIX="/tmp/crypto"
  
KEYFILE_CONTAINER="${KEYFILE/$HOST_PREFIX/$CONTAINER_PREFIX}"

EXPLORER_CONFIG="$PWD/../explorer/connection-profile/test-network.json"

jq --arg key "$KEYFILE_CONTAINER" '.organizations.Org1MSP.adminPrivateKey.path = $key' \
"$EXPLORER_CONFIG" > "$EXPLORER_CONFIG.tmp" && mv "$EXPLORER_CONFIG.tmp" "$EXPLORER_CONFIG" 

echo "Updated admin private key path in Explorer connection profile to: $KEYFILE_CONTAINER"