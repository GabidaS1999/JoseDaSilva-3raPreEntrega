const button = document.getElementById('logout');

button.addEventListener('click', e => {
    e.preventDefault();
    
    fetch('/api/session/logout', {
        method: 'DELETE'
    })
    .then(result => {
        if(result.status === 200){
            localStorage.clear(); 
            window.location.replace('/users/login');
        } else {
            console.error("Failed to log out");
        }
    })
    .catch(error => {
        console.error('Error during logout:', error);
    });
});





