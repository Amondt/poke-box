export interface FilterValues {
    searchBar: string;
    firstType: string;
    secondType: string;
    isFilters: {
        isBattleOnly: boolean;
        isMega: boolean;
        isLegendary: boolean;
        isMythical: boolean;
        isBaby: boolean;
    };
    generationFilters: {
        generationI: boolean;
        generationII: boolean;
        generationIII: boolean;
        generationIV: boolean;
        generationV: boolean;
        generationVI: boolean;
        generationVII: boolean;
        generationVIII: boolean;
    };
    hp: {
        value: number | null;
        comparisonSign: string;
    };
    attack: {
        value: number | null;
        comparisonSign: string;
    };
    defense: {
        value: number | null;
        comparisonSign: string;
    };
    speed: {
        value: number | null;
        comparisonSign: string;
    };
    'special-attack': {
        value: number | null;
        comparisonSign: string;
    };
    'special-defense': {
        value: number | null;
        comparisonSign: string;
    };
    firstMove: string;
    secondMove: string;
    ability: string;
}
