import React from "react";
import { useEffect } from "react";
import * as cookie from "cookie";
import './index.css';

export function New_Expense() {
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = document.getElementById('new_expense_form');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log(data);

        try {
            const response = await fetch('http://localhost:8000/new_expense/', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': cookie.parse(document.cookie).csrftoken,
    
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Expense added successfully');
                window.location.href = '/';
            } else {
                console.error('Failed to add expense');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
        }

        
    }

    useEffect(() => {
        const form = document.getElementById('new_expense_form');
        form.addEventListener('submit', handleSubmit);
        

        return () => {
            form.removeEventListener('submit', handleSubmit);
        };
    }
    , []);

    

    return(       
        <div>
            <h1>New Expense</h1>
            <div className="form_container">
               <form id="new_expense_form">
                

                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
                <br />
                <label htmlFor="amount">Amount:</label>
                <input type="number" id="amount" name="amount" required />
                <br />
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" name="date" required />
                <br />
                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description"></textarea>
                <br />
                <button id="submit">Add Expense</button>
            </form> 
            </div>
            
        </div>
    )
}
