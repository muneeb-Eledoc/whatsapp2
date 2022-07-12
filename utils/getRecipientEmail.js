const getRecipientEmail = (users, userLoggedIn)=>{
    return users.filter(uToF=> uToF !== userLoggedIn.email)[0]
}

export default getRecipientEmail