export interface ReducedPokemon {
    icon: string;
    id: number;
    order: number;
    name: string;
    names: { name: string; languageCode: string }[];
    form: string;
    generation: string;
    stats: { name: string; base_stat: number }[];
    types: string[];
    moves: string[];
    abilities: string[];
    isDefault: boolean;
    isBattleOnly: boolean;
    isMega: boolean;
    isBaby: boolean;
    isLegendary: boolean;
    isMythical: boolean;
}
