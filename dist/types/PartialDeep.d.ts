export declare type PartialDeep<T> = T extends Primitive ? Partial<T> : T extends object ? PartialObjectDeep<T> : unknown;
declare type Primitive = undefined | boolean | string;
declare type PartialObjectDeep<ObjectType extends object> = {
    [KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType]>;
};
export {};
