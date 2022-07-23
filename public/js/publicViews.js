const handleClick= ()=>{
    // event.preventDefault()
    const icon = event.currentTarget
    icon.classList.add("spin")
    const formElement = icon.parentNode
    const inputField1 = icon.previousElementSibling.previousElementSibling
    const inputField2 = icon.previousElementSibling
    const outputField = icon.nextElementSibling
    const numLikesBox = formElement.parentNode.nextElementSibling
    


    
    //////WORKING XMLHTTP code
    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", '/users/addRemoveLike', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            icon.classList.remove("spin")
            const resp = JSON.parse(this.responseText)
            const {likeButtonSize, numLikes} = resp
            likeButtonSize === "big" ? icon.classList.add("fa-2xl") : icon.classList.remove('fa-2xl')
            numLikesBox.innerHTML = `${numLikes} likes`
            // alert(`like button: ${resp.likeButtonSize}, number of likes: ${resp.numLikes}`)
        }
    }
    xhr.send(`${inputField2.name}=${inputField2.value}&${inputField1.name}=${inputField1.value}`)
    
}

const handleSort = () =>{
    const formElement = document.getElementById("sortOptions")
    formElement.submit()
}

const handleSwitchView = () =>{
    const formElement = document.getElementById("switchView")
    formElement.submit()
}