import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import {Heading} from './heading.jsx';
import {Expenses} from './expenses.jsx';
import './index.css';
import 'vite/modulepreload-polyfill';
import { useEffect } from 'react';
import {createHashRouter, Outlet, RouterProvider} from 'react-router-dom';
import { New_Expense } from './new_expense.jsx';
import { New_budget } from './new_budget.jsx';


const router = createHashRouter([
  {
    path: "/",
    element: <Main/>,
    children: [
      {
        index: true,
        element: <Expenses/>,
      },
      {
        path: "/new_expense",
        element: <New_Expense />,
      },
      {
        path: "/new_budget",
        element: <New_budget />,
      }
    ]
  },
]);

function Main() {
  const [expenses, change_expenses] = useState([]);
  const [user,change_user] = useState("");
  const [budget,change_budget] = useState(0);



  useEffect(() => {
    const fetchbudget = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_budget/', {
          method: 'GET',
          credentials: 'same-origin',
        });
        if (response.ok) {
          const budget = await response.json();
          
          change_budget(budget.budget.amount);
        } else {
          console.error('Failed to fetch budget');
        }
      } catch (error) {
        console.error('Error fetching  budget:', error);
      }
    };
    fetchbudget();
    
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_expenses/', {
          method: 'GET',
          credentials: 'same-origin',
        });
        if (response.ok) {
          const data = await response.json();
          let expenses_list = data.expenses;
          for(let i = 0; i < expenses_list.length; i++){
            expenses_list[i] = JSON.parse(expenses_list[i]);

          }

          
          change_expenses(expenses_list);
          console.log(expenses_list);
          
        } else {
          console.error('Failed to fetch expenses');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
    
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_user/', {
          method: 'GET',
          credentials: 'same-origin',
        });
        if (response.ok) {
          const user = await response.json();
          change_user(user.first_name);
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);




  
  return(
    <>
      <Heading user={user}/>
      <Outlet context={{budget,expenses,change_budget,change_expenses}} />
    </>
  );
}

export default Main;


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider> 
  </React.StrictMode>
);
