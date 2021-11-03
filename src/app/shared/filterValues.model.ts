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
}
