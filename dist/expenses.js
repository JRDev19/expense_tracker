"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editExpense = exports.getExpenseById = exports.deleteExpense = exports.getExpenses = exports.saveExpense = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Rutas de los archivos
const expensesPath = path_1.default.join(__dirname, 'expensesdoc.json');
const idPath = path_1.default.join(__dirname, 'lastId.json');
// Función para obtener el último ID
const getLastId = () => {
    if (!fs_1.default.existsSync(idPath))
        return 0;
    return JSON.parse(fs_1.default.readFileSync(idPath, 'utf-8')).lastId;
};
// Función para guardar el último ID
const saveLastId = (id) => {
    fs_1.default.writeFileSync(idPath, JSON.stringify({ lastId: id }), 'utf-8');
};
// Guardar un gasto con ID autoincremental
const saveExpense = (expense) => {
    let expenses = [];
    if (fs_1.default.existsSync(expensesPath)) {
        expenses = JSON.parse(fs_1.default.readFileSync(expensesPath, 'utf-8'));
    }
    // Obtener nuevo ID
    const newId = getLastId() + 1;
    saveLastId(newId);
    expenses.push(Object.assign(Object.assign({ id: newId }, expense), { date: new Date().toISOString() }));
    fs_1.default.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2), 'utf-8');
    console.log(`✅ Expense saved with ID: ${newId}`);
};
exports.saveExpense = saveExpense;
// Obtener todos los gastos
const getExpenses = () => {
    if (!fs_1.default.existsSync(expensesPath))
        return [];
    return JSON.parse(fs_1.default.readFileSync(expensesPath, 'utf-8'));
};
exports.getExpenses = getExpenses;
const deleteExpense = (id) => {
    if (!fs_1.default.existsSync(expensesPath)) {
        console.log("No expenses found.");
        return;
    }
    // Leer el archivo de gastos
    const data = fs_1.default.readFileSync(expensesPath, 'utf-8');
    let expenses = JSON.parse(data);
    // Comprobar si el gasto con el id existe
    const expenseExists = expenses.some(expense => expense.id === id);
    if (!expenseExists) {
        console.log(`No expense found with ID ${id}`);
        return;
    }
    // Filtrar los gastos eliminando el que coincida con el `id`
    expenses = expenses.filter(expense => expense.id !== id);
    // Guardar el archivo actualizado
    fs_1.default.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2), 'utf-8');
    console.log(`Expense with ID ${id} has been deleted.`);
};
exports.deleteExpense = deleteExpense;
const getExpenseById = (id) => {
    if (!fs_1.default.existsSync(expensesPath)) {
        return undefined;
    }
    const data = fs_1.default.readFileSync(expensesPath, 'utf-8');
    const expenses = JSON.parse(data);
    return expenses.find(expense => expense.id === id); // Devolver el gasto si se encuentra
};
exports.getExpenseById = getExpenseById;
const editExpense = (id, updatedExpense) => {
    if (!fs_1.default.existsSync(expensesPath)) {
        console.log("No expenses found.");
        return;
    }
    const data = fs_1.default.readFileSync(expensesPath, 'utf-8');
    let expenses = JSON.parse(data);
    // Buscar el índice del gasto
    const expenseIndex = expenses.findIndex(expense => expense.id === id);
    if (expenseIndex === -1) {
        console.log(`No expense found with ID ${id}`);
        return;
    }
    // Actualizar el gasto
    expenses[expenseIndex] = Object.assign(Object.assign(Object.assign({}, expenses[expenseIndex]), updatedExpense), { date: new Date().toISOString() });
    // Guardar el archivo actualizado
    fs_1.default.writeFileSync(expensesPath, JSON.stringify(expenses, null, 2), 'utf-8');
    console.log(`Expense with ID ${id} has been updated.`);
};
exports.editExpense = editExpense;
