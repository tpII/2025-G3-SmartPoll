import * as grpc from '@grpc/grpc-js';
import { connect, hash, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import { TextDecoder } from 'node:util';

const utf8Decoder = new TextDecoder();

async function blockchainGateway(tav, electionId, candidate) {
    // Certificados y clave del Admin de Org1
    const credentials = await fs.readFile('/home/ivan/Facultad/2025-G3-SmartPoll/blockchain/fabric-chain/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/cert.pem');
    const privateKeyPem = await fs.readFile('/home/ivan/Facultad/2025-G3-SmartPoll/blockchain/fabric-chain/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/43edec7ca3abd05ee0c256cff94913d7596e5c3fd60ad60a4d53a9fcac748758_sk');
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    const signer = signers.newPrivateKeySigner(privateKey);

    // Certificado TLS del peer/gateway
    const tlsRootCert = await fs.readFile('/home/ivan/Facultad/2025-G3-SmartPoll/blockchain/fabric-chain/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/cacerts/localhost-7054-ca-org1.pem');
    const client = new grpc.Client('localhost:7051', grpc.credentials.createSsl(tlsRootCert));

    const gateway = connect({
        identity: { mspId: 'Org1MSP', credentials },
        signer,
        hash: hash.sha256,
        client,
    });

    try {
        const network = gateway.getNetwork('mychannel'); 
        const contract = network.getContract('basic'); // chaincode

        const submitResult = await contract.submitTransaction('CreateVote',"admin", electionId, tav,candidate);
        console.log('Vote submitted:', utf8Decoder.decode(submitResult));

        const getResult = await contract.evaluateTransaction('GetAllVotes');
        console.log('Current votes:', utf8Decoder.decode(getResult));
    } finally {
        gateway.close();
        client.close();
    }
}

export {blockchainGateway}
