import { createGateway } from './fabricConfig.ts';
import { TextDecoder } from 'node:util';

const utf8Decoder = new TextDecoder();

export class VotingClient {
  private gateway: ReturnType<typeof createGateway> | null = null;

  constructor() {}

  private async getGateway() {
    if (!this.gateway) {
      this.gateway = await createGateway();
    }
    return this.gateway;
  }

  // Método para emitir un voto
  async castVote(tav: string, electionId: string, candidate: string): Promise<string> {
    const gateway = await this.getGateway();
    const network = gateway.getNetwork('election');
    const contract = network.getContract('votationChaincode');

    try {
      const result = await contract.submitTransaction('CreateVote', electionId, tav, candidate);
      return utf8Decoder.decode(result);
    } finally {
      gateway.close();
      this.gateway = null;
    }
  }

  // Método para obtener todos los votos
  async getVotes(): Promise<string> {
    const gateway = await this.getGateway();
    const network = gateway.getNetwork('election');
    const contract = network.getContract('votationChaincode');

    try {
      const result = await contract.evaluateTransaction('CountVotes');
      return utf8Decoder.decode(result);
    } finally {
      gateway.close();
      this.gateway = null;
    }
  }
}