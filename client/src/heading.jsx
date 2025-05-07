import React, { use } from 'react';
import ReactDOM from 'react-dom/client';
import { useEffect } from 'react';

export function Heading({user}) {
    
    useEffect(() => {
            const logout_button = document.getElementById('logout');
            logout_button.addEventListener('click', () => {
                fetch('http://localhost:8000/registration/logout/', {
                    credentials: 'same-origin',
                })
                
                .then(response => {
                    if (response.ok) {
                        console.log('Logout successful');
                        window.location.href = '/';
                    } else {
                        console.error('Logout failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        }, []);
    

        return (
            <div id="header">
                <h1> Welcome {user}</h1>
                <div>
                    <button id="logout">Logout</button>
                </div>
            </div>
        )
}