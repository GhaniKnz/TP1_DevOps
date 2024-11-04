// saver.test.js

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { getTeaByName, saveTea, generateNewTeaId } from './saver.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('node:fs');

describe('getTeaByName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit retourner l\'objet du thé lorsque le thé avec le nom donné existe', () => {
    const mockTeas = [{ id: 1, name: 'Earl Grey', description: 'A black tea' }];
    readFileSync.mockReturnValue(JSON.stringify(mockTeas));
    existsSync.mockReturnValue(true);

    const result = getTeaByName('Earl Grey');

    expect(result).toEqual(mockTeas[0]);
  });

  it('doit retourner undefined si aucun thé avec le nom donné n\'existe', () => {
    const mockTeas = [{ id: 1, name: 'Earl Grey', description: 'A black tea' }];
    readFileSync.mockReturnValue(JSON.stringify(mockTeas));
    existsSync.mockReturnValue(true);

    const result = getTeaByName('Green Tea');

    expect(result).toBeUndefined();
  });

  it('doit gérer l\'absence du fichier de données en retournant undefined', () => {
    existsSync.mockReturnValue(false);

    const result = getTeaByName('Earl Grey');

    expect(result).toBeUndefined();
  });
});

describe('saveTea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('doit sauvegarder un nouveau thé lorsqu\'aucun thé avec le même nom ou id n\'existe', () => {
    const newTea = { id: 2, name: 'Green Tea', description: 'A refreshing tea' };
    const mockTeas = [{ id: 1, name: 'Earl Grey', description: 'A black tea' }];
    readFileSync.mockReturnValue(JSON.stringify(mockTeas));
    existsSync.mockReturnValue(true);

    saveTea(newTea);

    expect(writeFileSync).toHaveBeenCalledWith('data.json', JSON.stringify([...mockTeas, newTea], null, 2));
  });

  it('doit lancer une erreur si un thé avec le même nom mais un id différent existe', () => {
    const existingTea = { id: 1, name: 'Earl Grey', description: 'A black tea' };
    const newTea = { id: 2, name: 'Earl Grey', description: 'Another tea' };
    const mockTeas = [existingTea];
    readFileSync.mockReturnValue(JSON.stringify(mockTeas));
    existsSync.mockReturnValue(true);

    expect(() => saveTea(newTea)).toThrow('Tea with name Earl Grey already exists');
  });
});

describe('generateNewTeaId', () => {
  it('doit retourner une valeur numérique', () => {
    const id = generateNewTeaId();
    expect(typeof id).toBe('number');
  });
});
