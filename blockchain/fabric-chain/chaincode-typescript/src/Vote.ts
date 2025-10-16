import { Object, Property } from 'fabric-contract-api';
export const VoteOption = {
    MACRI: 'Macri gato',
    MILEI: 'Milei',
    CFK: 'CFK'
} as const;

export type VoteOption = typeof VoteOption[keyof typeof VoteOption];

@Object()
export class Vote {             
    @Property()
    public electionID: string;      
    
    @Property()
    public tav: string;

    @Property()
    public option: VoteOption;
}