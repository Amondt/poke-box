import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./dashboard/dashboard.module').then(
                (m) => m.DashboardModule
            ),
    },
    {
        path: 'pokedex',
        loadChildren: () =>
            import('./pokedex/pokedex.module').then((m) => m.PokedexModule),
    },
    {
        path: 'team-builder',
        loadChildren: () =>
            import('./team-builder/team-builder.module').then(
                (m) => m.TeamBuilderModule
            ),
    },
    {
        path: 'cardex',
        loadChildren: () =>
            import('./cardex/cardex.module').then((m) => m.CardexModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
