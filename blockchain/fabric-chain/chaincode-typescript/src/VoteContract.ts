import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import { Vote, UUID } from './Vote';

@Info({title: 'VoteContract', description: 'Smart contract for managing votes'})
export class VoteContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const assets: Vote[] = [
            {electionID: 'election1', tav: '551fafac', option: 'c18c6e9d-bc74-4b72-9f7e-ef7e2c7a1a91' as UUID},
            {electionID: 'election1', tav: '561tafsd', option: 'c18c6e9d-bc74-4b72-9f7e-ef7e2c7a1a91' as UUID},
            {electionID: 'election1', tav: '9277ee1a', option: 'c18c6e9d-bc74-4b72-9f7e-ef7e2c7a1a91' as UUID},
            {electionID: 'election1', tav: '042b4e92', option: 'b21d7a3c-5f48-4e8a-bef0-203b7a6c3d22' as UUID},
            {electionID: 'election1', tav: '12dhzs3a', option: 'a63f82e7-7f3e-470a-8f5a-10d9e8dfc145' as UUID},
        ];

        for (const asset of assets) {
            await ctx.stub.putState(asset.tav, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.tav} initialized`);
        }
    }

    @Transaction()
    public async CreateVote(
        ctx: Context,
        electionID: string,
        tav: string,
        option: UUID
    ): Promise<void> {
        const clientID = ctx.clientIdentity.getID();
        if (!clientID.includes("admin")) {
            throw new Error("Permission denied: only Admin can create votes. CLIENTID ====== " + clientID);
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

    @Transaction(false)
    public async CountVotes(ctx: Context): Promise<string> {
        const clientID = ctx.clientIdentity.getID();
        if (!clientID.includes("admin")) {
            throw new Error("Permission denied: only admin can audit votes");
        }

        const iterator = await ctx.stub.getStateByRange('', '');
        const counts: Record<string, number> = {};

        let result = await iterator.next();
        while (!result.done) {
            const strValue = result.value.value.toString();
            try {
                const record = JSON.parse(strValue);
                const option = record.option;
                counts[option] = (counts[option] || 0) + 1;
            } catch {
                // ignorar errores de parseo
            }
            result = await iterator.next();
        }

        await iterator.close();

        return JSON.stringify(counts);
    }



}
