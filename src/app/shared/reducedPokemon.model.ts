export interface ReducedPokemon {
    icon: string;
    id: number;
    names: { name: string; languageCode: string }[];
    stats: { name: string; base_stat: number }[];
    types: string[];
}
