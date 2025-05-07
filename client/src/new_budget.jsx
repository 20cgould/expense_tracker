import React, { use } from 'react';
import { useEffect } from 'react';
import * as cookie from 'cookie';
import {useNavigate} from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

export function New_budget(){


    const navigate = useNavigate();
    const { expenses, budget, change_expenses, change_budget } = useOutletContext();

    useEffect(() => {
        const form = document.getElementById("form");
        if (!form) return;

        const handleSubmit = async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const budget = formData.get("budget");
            try {
                const response = await fetch("http://localhost:8000/new_budget/", {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
                    },
                    body: JSON.stringify({ budget }),
                });
                if (response.ok) {
                    change_budget(budget);
                    navigate("/"); // 
                } else {
                    console.error("Failed to create budget");
                }
            } catch (error) {
                console.error("Error creating budget:", error);
            }
        };

        form.addEventListener("submit", handleSubmit);
        return () => form.removeEventListener("submit", handleSubmit); // cleanup
    }, [navigate]); // 
        
        
   
   
    
    return(
        <div id="new_budget">
            <h2>New Budget</h2>
            <form id="form" method="POST" action="http://localhost:8000/new_budget/">
                <label htmlFor="budget">Budget:</label>
                <input type="number" name="budget" id="budget" required />
                <button type="submit" id="submit_button">Submit</button>
            </form>
        </div>
    );
    
}