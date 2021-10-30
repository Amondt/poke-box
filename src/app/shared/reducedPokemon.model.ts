export interface ReducedPokemon {
    icon: string;
    id: number;
    order: number;
    isDefault: boolean;
    name: string;
    names: { name: string; languageCode: string }[];
    stats: { name: string; base_stat: number }[];
    types: string[];
}
