import fs from 'fs';
import path from 'path';

interface Expense {
    id: number;
    title: string;
    cost: number;
    date: string;
}

// Rutas de los archivos
const expensesPath = path.join(__dirname, 'expensesdoc.json');
const idPath = path.join(__dirname, 'lastId.json');

// Función para obtener el último ID
const getLastId = (): number => {
    if (!fs.existsSync(idPath)) return 0;
    return JSON.parse(fs.readFileSync(idPath, 'utf-8')).lastId;
};

// Función para guardar el último ID
const saveLastId = (id: number): void => {
    fs.writeFileSync(idPath, JSON.stringify({ lastId: id }), 'utf-8');
};

// Guardar un gasto con ID autoincremental
export const saveExpense = (expense: Omit<Expense, 'id' | 'date'>): void => {
    let expenses: Expense[] = [];

    if (fs.existsSync(expensesPath)) {
        expenses = JSON.parse(fs.readFileSync(expensesPath, 'utf-8')) as Expense[];
    }

    // Obtener nuevo ID
    const newId = getLastId() + 1;
    saveLastId(newId);

    expenses.push({ id: newId, ...expense, date: new Date().toISOString() });

    fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2), 'utf-8');

    console.log(`✅ Expense saved with ID: ${newId}`);
};

// Obtener todos los gastos
export const getExpenses = (): Expense[] => {
    if (!fs.existsSync(expensesPath)) return [];

    return JSON.parse(fs.readFileSync(expensesPath, 'utf-8')) as Expense[];
};

export const deleteExpense = (id: number): void => {
    if (!fs.existsSync(expensesPath)) {
        console.log("No expenses found.");
        return;
    }

    // Leer el archivo de gastos
    const data = fs.readFileSync(expensesPath, 'utf-8');
    let expenses: Expense[] = JSON.parse(data);

    // Comprobar si el gasto con el id existe
    const expenseExists = expenses.some(expense => expense.id === id);

    if (!expenseExists) {
        console.log(`No expense found with ID ${id}`);
        return;
    }

    // Filtrar los gastos eliminando el que coincida con el `id`
    expenses = expenses.filter(expense => expense.id !== id);

    // Guardar el archivo actualizado
    fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2), 'utf-8');

    console.log(`Expense with ID ${id} has been deleted.`);
};

export const getExpenseById = (id: number): Expense | undefined => {
    if (!fs.existsSync(expensesPath)) {
        return undefined;
    }

    const data = fs.readFileSync(expensesPath, 'utf-8');
    const expenses: Expense[] = JSON.parse(data);

    return expenses.find(expense => expense.id === id); // Devolver el gasto si se encuentra
};

export const editExpense = (id: number, updatedExpense: Omit<Expense, 'id' | 'date'>): void => {
    if (!fs.existsSync(expensesPath)) {
        console.log("No expenses found.");
        return;
    }

    const data = fs.readFileSync(expensesPath, 'utf-8');
    let expenses: Expense[] = JSON.parse(data);

    // Buscar el índice del gasto
    const expenseIndex = expenses.findIndex(expense => expense.id === id);

    if (expenseIndex === -1) {
        console.log(`No expense found with ID ${id}`);
        return;
    }

    // Actualizar el gasto
    expenses[expenseIndex] = { ...expenses[expenseIndex], ...updatedExpense, date: new Date().toISOString() };

    // Guardar el archivo actualizado
    fs.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2), 'utf-8');

    console.log(`Expense with ID ${id} has been updated.`);
};
