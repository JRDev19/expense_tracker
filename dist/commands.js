"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { program } = require('commander');
const inquirer_1 = __importDefault(require("inquirer"));
const expenses_1 = require("./expenses");
program.version('0.0.1')
    .description('A CLI tool for managing expenses');
program.command('add')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the expense description:',
        },
        {
            type: 'number',
            name: 'cost',
            message: 'Enter the spent'
        }
    ]);
    (0, expenses_1.saveExpense)(answers);
}));
program.command('list')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const expenses = (0, expenses_1.getExpenses)();
    const expensesObject = expenses.reduce((acc, expense) => {
        acc[expense.id] = { title: expense.title, cost: expense.cost };
        return acc;
    }, {});
    console.table(expensesObject);
}));
program.command('delete <id>')
    .action((id) => {
    const expenseId = parseInt(id, 10); // Convertir el id de string a number
    if (isNaN(expenseId)) {
        console.log("Invalid ID. Please provide a valid number.");
        return;
    }
    (0, expenses_1.deleteExpense)(expenseId);
});
program.command('edit <id>')
    .action((id) => __awaiter(void 0, void 0, void 0, function* () {
    const expenseId = parseInt(id, 10); // Convertir el id de string a number
    if (isNaN(expenseId)) {
        console.log("Invalid ID. Please provide a valid number.");
        return;
    }
    // Obtener el gasto actual por ID
    const expense = (0, expenses_1.getExpenseById)(expenseId);
    if (!expense) {
        console.log(`No expense found with ID ${expenseId}`);
        return;
    }
    // Usar inquirer para editar el gasto con los valores por defecto
    const answers = yield inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the expense description:',
            default: expense.title, // Valor por defecto
        },
        {
            type: 'number',
            name: 'cost',
            message: 'Enter the spent:',
            default: expense.cost, // Valor por defecto
        }
    ]);
    // Llamar a la función de editar con los nuevos valores
    (0, expenses_1.editExpense)(expenseId, answers);
}));
program.parse(process.argv);
