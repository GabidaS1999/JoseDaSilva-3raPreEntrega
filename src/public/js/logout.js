const button = document.getElementById('logout');

button.addEventListener('click', e => {
    e.preventDefault();
    
    fetch('/api/session/logout', {
        method: 'DELETE'
    })
    .then(result =>
        {if(result.status === 200){
            window.location.replace('/users/login')
        }
    }
    )
});




