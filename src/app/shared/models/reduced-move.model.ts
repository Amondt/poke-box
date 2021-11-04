export interface ReducedMove {
    name: string;
    id: number;
    damageClass: string | null;
    names: { name: string; languageCode: string }[];
}
