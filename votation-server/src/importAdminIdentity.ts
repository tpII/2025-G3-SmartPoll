import { createGateway } from './fabricConfig.ts';
import { TextDecoder } from 'node:util';

const utf8Decoder = new TextDecoder();


async function blockchainGateway(tav, electionId, candidate) {
  const gateway = await createGateway();
  const network = gateway.getNetwork('mychannel');
  const contract = network.getContract('basic');

  try {
    const submitResult = await contract.submitTransaction('CreateVote', electionId, tav, candidate);
    console.log('Vote submitted:', utf8Decoder.decode(submitResult));

    const getResult = await contract.evaluateTransaction('GetAllVotes');
    console.log('Current votes:', utf8Decoder.decode(getResult));
  } finally {
    gateway.close();
  }
}

export { blockchainGateway }
