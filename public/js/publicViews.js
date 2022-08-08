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
            if (numLikes === 0) { 
                numLikesBox.classList.add("hidden")
            } else{
                numLikesBox.classList.remove("hidden")
            }
            const likeorlikes = numLikes>1 ? "likes" : "like"
            numLikesBox.innerHTML = `${numLikes} ${likeorlikes}`
        }
    }
    xhr.send(`${inputField2.name}=${inputField2.value}&${inputField1.name}=${inputField1.value}`)
    
}

const handleSort = () =>{
    const formElement = document.getElementById("sortOptions")
    formElement.submit()
}

const handlePageSelect = () =>{
    const formElement = document.getElementById("pagination")
    formElement.submit()
}

const handleSwitchView = () =>{
    const formElement = document.getElementById("switchView")
    formElement.submit()
}

const prevPage = () =>{
    const formElement = document.getElementById("pagination")
    let sel = formElement.children[2]
    sel.value = (+sel.value-1).toString()
    formElement.submit()
}

const nextPage = () =>{
    const formElement = document.getElementById("pagination")
    let sel = formElement.children[2]
    sel.value = (+sel.value+1).toString()
    formElement.submit()
}