const { program } = require('commander');
import inquirer from "inquirer";
import { saveExpense, getExpenses, deleteExpense, getExpenseById, editExpense } from "./expenses";

program.version('0.0.1')
    .description('A CLI tool for managing expenses');

program.command('add')
    .action(async () => {
        const answers = await inquirer.prompt<{ title: string; cost: number }>([
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
        ])
        saveExpense(answers);
    })

program.command('list')
    .action(async () => {
        const expenses = getExpenses();
        const expensesObject = expenses.reduce((acc: { [key: number]: { title: string; cost: number } }, expense) => {
            acc[expense.id] = { title: expense.title, cost: expense.cost };
            return acc;
        }, {}); 
        
        console.table(expensesObject);
    })

program.command('delete <id>')
    .action((id: string) => {
        const expenseId = parseInt(id, 10);  // Convertir el id de string a number
        if (isNaN(expenseId)) {
            console.log("Invalid ID. Please provide a valid number.");
            return;
        }
        deleteExpense(expenseId);
    })

program.command('edit <id>')
    .action(async (id: string) => {
        const expenseId = parseInt(id, 10);  // Convertir el id de string a number
        if (isNaN(expenseId)) {
            console.log("Invalid ID. Please provide a valid number.");
            return;
        }

        // Obtener el gasto actual por ID
        const expense = getExpenseById(expenseId);

        if (!expense) {
            console.log(`No expense found with ID ${expenseId}`);
            return;
        }

        // Usar inquirer para editar el gasto con los valores por defecto
        const answers = await inquirer.prompt([
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
        editExpense(expenseId, answers);
    })

program.parse(process.argv);