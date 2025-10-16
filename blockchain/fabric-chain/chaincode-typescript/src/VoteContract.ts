import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import {Vote, VoteOption} from './Vote';

@Info({title: 'VoteContract', description: 'Smart contract for managing votes'})
export class VoteContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const assets: Vote[] = [
            { electionID: 'election1', tav: '551fafac', option: VoteOption.MACRI },
            { electionID: 'election1', tav: '042b4e924b5f80', option: VoteOption.MILEI },
            { electionID: 'election2', tav: '9277ee1a', option: VoteOption.CFK },
        ];

        for (const asset of assets) {
            await ctx.stub.putState(asset.tav, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.tav} initialized`);
        }
    }

    @Transaction()
    public async CreateVote(
        ctx: Context,
        role: string,
        electionID: string,
        tav: string,
        option: VoteOption
    ): Promise<void> {

        if (role !== 'admin') {
            throw new Error(`You don't have the permission WRONG ROLE`);
        }

        const exists = await this.VoteExists(ctx, tav);
        if (exists) {
            throw new Error(`The election with ${tav} already exists`);
        }

        const asset: Vote= { electionID, tav, option };
        await ctx.stub.putState(tav, Buffer.from(JSON.stringify(asset)));
    }

    @Transaction(false)
    public async ReadVote(ctx: Context, tav: string): Promise<string> {
        const voteJSON = await ctx.stub.getState(tav);
        if (!voteJSON || voteJSON.length === 0) {
            throw new Error(`The vote ${tav} does not exist`);
        }
        return voteJSON.toString();
    }

    @Transaction(false)
    @Returns('boolean')
    public async VoteExists(ctx: Context, tav: string): Promise<boolean> {
        const voteJSON = await ctx.stub.getState(tav);
        return voteJSON && voteJSON.length > 0;
    }

    @Transaction(false)
    public async GetAllVotes(ctx: Context): Promise<string> {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch {
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}
