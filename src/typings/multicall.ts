
export type MultiCallResponse<T> = T | null


export interface Call {
    address: string // Address of the contract
    name: string // Function name on the contract (example: balanceOf)
    params?: any[] // Function params
}

export interface MulticallOptions {
    requireSuccess?: boolean;
    oncePreGroup?: number; // use in multicallv3
}