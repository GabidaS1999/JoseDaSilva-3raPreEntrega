export const generateUserErrorInfo = (user) =>{
    return `Una o mas propiedades fueron enviadas incompletas o no son validas.
    Lista de propiedades requeridas:
    ->first_name: type String. recibido ${user.first_name}
    ->email: type String, recibido: ${user.email}`;
}

export const generateUserErrorInfoENG = (user) => {
    return `One or more properties were sent incomplete or are not valid.
    List of required properties:
    ->first_name: type String. received ${user.first_name}
    ->email: type String. received: ${user.email}`;
}

export const generateUserErrorInfoFR = (user) => {
    return `Une ou plusieurs propriétés ont été envoyées incomplètes ou ne sont pas valides.
    Liste des propriétés requises :
    ->first_name: type String. reçu ${user.first_name}
    ->email: type String. reçu: ${user.email}`;
}

export const generateUserErrorInfoPT = (user) => {
    return `Uma ou mais propriedades foram enviadas incompletas ou não são válidas.
    Lista de propriedades requeridas:
    ->first_name: tipo String. recebido ${user.first_name}
    ->email: tipo String. recebido: ${user.email}`;
}