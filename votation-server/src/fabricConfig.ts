// fabricConfig.ts
import * as grpc from '@grpc/grpc-js';
import { connect, hash, signers  } from '@hyperledger/fabric-gateway';
import * as crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export async function createGateway(): Promise<any> {
  // Certificados y clave del Admin de Org1
  const credentials = await fs.readFile('/app/keys/signcerts/cert.pem');

  // Leer dinámicamente la clave privada
  const keystoreDir = '/app/keys/keystore';
  const keyFiles = await fs.readdir(keystoreDir);
  if (keyFiles.length !== 1) throw new Error('Se espera exactamente un archivo en keystore');
  const privateKeyPem = await fs.readFile(path.join(keystoreDir, keyFiles[0]));
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = signers.newPrivateKeySigner(privateKey);

  // Certificado TLS del peer/gateway
  const tlsRootCert = await fs.readFile('/app/keys/cacerts/localhost-7054-ca-org1.pem');
  const client = new grpc.Client('peer0.org1.example.com:7051', grpc.credentials.createSsl(tlsRootCert));

  // Conectar gateway
  return connect({
    identity: { mspId: 'Org1MSP', credentials },
    signer,
    hash: hash.sha256,
    client,
  });
}
