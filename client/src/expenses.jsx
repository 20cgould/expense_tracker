import React from 'react';
import "./index.css";
import { Link } from 'react-router-dom';
import { useOutletContext  } from 'react-router-dom';
import { format } from 'date-fns';
// Removed unused import
import * as cookie from "cookie";





export function Expenses() {
    const { expenses, budget, change_expenses, total, change_total } = useOutletContext();
    // Removed unused variables
    let budget_div = null;
    console.log(budget);
    
    if(budget === 0 || budget === undefined){
        budget_div = <Link id="new_budget" to={"/new_budget"}>new Budget</Link>

    }
    else{
        budget_div = <div id="budget"> <h1>budget: ${budget}</h1></div>
    }

    
    
    

    return (
        <>
            <div id="page">
                {expenses.map((expense) => (
                    <div key={expense.id}>
                        < Make_Expense expense={expense} expenses={expenses} change_expenses={change_expenses} total = {total} change_total = {change_total} />
                    </div>
                ))}
            </div>
             <div id="new_expense">
                <h2><Link to={`/new_expense`}>New Expense</Link></h2>
                
            </div>
             <div id="total">
                <h2>Total expenses: -${total}</h2>
            </div>
            {budget_div}
            
            
        </>
    ) 
}
function Make_Expense({ expense,expenses, change_expenses, total, change_total }) {
        
        const { id, name, amount, date, description } = expense;
        const formattedDate = format(new Date(date), 'yyyy-MM-dd');
        
        
        
       
        async function delete_expense(event, id) {
            event.preventDefault();
            try {
                const response = await fetch(`http://localhost:8000/delete/${id}/`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': cookie.parse(document.cookie).csrftoken,
                    },
                });
                if (response.ok) {
                    change_expenses(expenses.filter(expense => expense.id !== id));
                    change_total(total - parseFloat(amount));
                } else {
                    console.error('Failed to delete expense');
                }
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }


        
    
        return (
            <div className="expense">
                <div className="expense_item">{name}</div>
                <div className="expense_item">Amount: {amount}</div>
                <div className="expense_item">Date: {formattedDate}</div>
                <div className="expense_item">Description: {description}</div>
                <button className="button" onClick={(e) => delete_expense(e, id)} >delete</button>
                
            </div>
            
        );

        

 
    }
    
    
    
    
                


