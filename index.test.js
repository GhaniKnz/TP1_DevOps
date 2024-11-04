// index.test.js

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addTea } from './index.js';
import { getTeaByName, saveTea, generateNewTeaId } from './saver.js';

// Mock des fonctions à tester
vi.mock('./saver.js');

// Mock des fonctions de fichiers
vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

describe('addTea', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Réinitialiser les mocks avant chaque test
  });

  it('doit créer un nouveau thé lorsque le thé avec le même nom n\'existe pas', () => {
    // Arrange
    const newTeaDto = { name: 'Jasmine', description: 'A fragrant tea' };
    getTeaByName.mockReturnValue(undefined); // Simuler l'absence du thé
    generateNewTeaId.mockReturnValue(1); // Simuler un nouvel ID
    saveTea.mockImplementation(() => {}); // Simuler une sauvegarde réussie

    // Act
    const result = addTea(newTeaDto);

    // Assert
    expect(result.success).toBe(true);
    expect(getTeaByName).toHaveBeenCalledWith('Jasmine'); // Vérifier que la fonction a été appelée avec le bon nom
    expect(saveTea).toHaveBeenCalledWith({ id: 1, ...newTeaDto }); // Vérifier que saveTea a été appelé avec le bon objet
  });

  it('doit mettre à jour un thé existant lorsque le thé avec le même nom existe', () => {
    // Arrange
    const existingTea = { id: 1, name: 'Jasmine', description: 'A fragrant tea' };
    const newTeaDto = { name: 'Jasmine', description: 'An updated fragrant tea' };
    getTeaByName.mockReturnValue(existingTea); // Simuler l'existence du thé

    // Act
    const result = addTea(newTeaDto);

    // Assert
    expect(result.success).toBe(true);
    expect(getTeaByName).toHaveBeenCalledWith('Jasmine'); // Vérifier que la fonction a été appelée avec le bon nom
    expect(saveTea).toHaveBeenCalledWith({ id: 1, ...newTeaDto }); // Vérifier que saveTea a été appelé avec le bon objet
  });

  it('doit retourner un échec si saveTea lance une erreur', () => {
    // Arrange
    const newTeaDto = { name: 'Chamomile', description: 'A soothing tea' };
    getTeaByName.mockReturnValue(undefined); // Simuler l'absence du thé
    generateNewTeaId.mockReturnValue(2); // Simuler un nouvel ID
    saveTea.mockImplementation(() => {
      throw new Error('Failed to save tea'); // Simuler une erreur lors de la sauvegarde
    });

    // Act
    const result = addTea(newTeaDto);

    // Assert
    expect(result.success).toBe(false); // Vérifier que le résultat indique un échec
    expect(getTeaByName).toHaveBeenCalledWith('Chamomile'); // Vérifier que la fonction a été appelée avec le bon nom
    expect(saveTea).toHaveBeenCalledWith({ id: 2, ...newTeaDto }); // Vérifier que saveTea a été appelé avec le bon objet
  });
});
