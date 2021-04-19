export const testData: Array<TArticles> = [
    { name: 'Formation Python', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 3, TVA: 20 },
    { name: 'Formation TS', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 1, TVA: 20 },
    { name: 'Formation Gestioen de projet', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 6, TVA: 20 },
    { name: 'Formation', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 3, TVA: 20 },
    { name: 'Formation', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 6, TVA: 20 },
    { name: 'Formation Gestioen de projet', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 3, TVA: 20 },
    { name: 'Formation TS', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 6, TVA: 20 },
    { name: 'Formation', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 3, TVA: 20 },
    { name: 'Formation Gestioen de projet', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 6, TVA: 20 },
    { name: 'Formation', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 3, TVA: 20 },
    { name: 'Formation TS', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 1, TVA: 20 },
    { name: 'Formation', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 3, TVA: 20 },
    { name: 'Formation Gestioen de projet', description: 'Cours python avec EEDDSI-DEV qui sont nul', prix: 410, quantity: 7, TVA: 20 },
];

export interface TArticles {
    name: string;
    description: string;
    quantity: number;
    prix: number;
    TVA: number;
}
