const handleClick = (e) => {
    const icon = e.currentTarget
    icon.classList.add("spin")
    const formElement = icon.parentNode
    const inputField1 = icon.previousElementSibling.previousElementSibling
    const inputField2 = icon.previousElementSibling
    const numLikesBox = formElement.parentNode.nextElementSibling

    //////WORKING XMLHTTP code
    var xhr = new XMLHttpRequest()
    xhr.open("PATCH", "/users/addRemoveLike", true)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            icon.classList.remove("spin")
            const resp = JSON.parse(this.responseText)
            const { likeButtonSize, numLikes } = resp
            likeButtonSize === "big"
                ? icon.classList.add("fa-2xl")
                : icon.classList.remove("fa-2xl")
            if (numLikes === 0) {
                numLikesBox.classList.add("hidden")
            } else {
                numLikesBox.classList.remove("hidden")
            }
            const likeorlikes = numLikes > 1 ? "likes" : "like"
            numLikesBox.innerHTML = `${numLikes} ${likeorlikes}`
        }
    }
    const sendstring = `${inputField2.name}=${inputField2.value}&${inputField1.name}=${inputField1.value}`
    console.log(sendstring)
    xhr.send(sendstring)
}

const handleClickViewStory = (e) => {
    // const icon = document.getElementById("votenum")
    const icon = e.currentTarget
    icon.classList.add("spin")
    const formElement = document.getElementById("addRemoveLike")
    const inputField1 = document.getElementById("userid")
    const inputField2 = document.getElementById("storyID")
    const numLikesBox = document.getElementById("votenum")

    //////WORKING XMLHTTP code
    var xhr = new XMLHttpRequest()
    xhr.open("PATCH", "/users/addRemoveLike", true)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Request finished. Do processing here.
            icon.classList.remove("spin")
            const resp = JSON.parse(this.responseText)
            const { likeButtonSize, numLikes } = resp
            likeButtonSize === "big"
                ? icon.classList.add("fa-2xl")
                : icon.classList.remove("fa-2xl")
            if (numLikes === 0) {
                numLikesBox.classList.add("hidden")
            } else {
                numLikesBox.classList.remove("hidden")
            }
            const likeorlikes = numLikes > 1 ? "likes" : "like"
            numLikesBox.innerHTML = `${numLikes} ${likeorlikes}`
        }
    }
    xhr.send(
        `${inputField2.name}=${inputField2.value}&${inputField1.name}=${inputField1.value}`
    )
}

const handleSort = () => {
    const formElement = document.getElementById("sortOptions")
    formElement.submit()
}

const handleFilterByAuthor = () => {
    const formElement = document.getElementById("filterByAuthor")
    formElement.submit()
}

const handlePageSelect = () => {
    const formElement = document.getElementById("pagination")
    formElement.submit()
}

const handleSwitchView = () => {
    const formElement = document.getElementById("switchView")
    formElement.submit()
}

const prevPage = () => {
    const formElement = document.getElementById("pagination")
    // let sel = formElement.children[2]
    let sel = document.getElementById("pageNumber")
    sel.value = (+sel.value - 1).toString()
    formElement.submit()
    this.disabled = true
}

const nextPage = () => {
    const formElement = document.getElementById("pagination")
    // let sel = formElement.children[2]
    let sel = document.getElementById("pageNumber")
    sel.value = (+sel.value + 1).toString()
    formElement.submit()
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

const makeCheckbox = (id) => {
    let th = document.createElement("th")
    let label = document.createElement("label")
    let input = document.createElement("input")
    input.type = "checkbox"
    input.id = id
    let s = document.createElement("span")
    label.appendChild(input)
    label.appendChild(s)
    th.appendChild(label)
    return th
}


const makeDropdown = (id) => {
    let div = document.createElement('div')
    let a = document.createElement('a')
    a.classList.add('dropdown-trigger')
    a.classList.add('btn')
    a.classList.add('dots')
    a.setAttribute('href','#');
    a.setAttribute('data-target',id);
    a.innerHTML = "..."

    let ul = document.createElement('ul')
    ul.id = id
    ul.classList.add('dropdown-content')
    let li = null
    let lia = null

    li = document.createElement('li')
    lia = document.createElement('a')
    lia.setAttribute('href','/users/profile/'+id);
    lia.innerHTML = "View"
    li.appendChild(lia)
    ul.appendChild(li)

    li = document.createElement('li')
    lia = document.createElement('a')
    lia.setAttribute('href','/users/edit/'+id);
    lia.innerHTML = "Edit"
    li.appendChild(lia)
    ul.appendChild(li)

    li = document.createElement('li')
    lia = document.createElement('a')
    lia.setAttribute('href','#');
    lia.innerHTML = "Delete"
    li.appendChild(lia)
    ul.appendChild(li)

    div.appendChild(a)
    div.appendChild(ul)
    return div
}

const fillTable = (tableId, data) => {
    if (data.length === 0) return
    let table = document.getElementById(tableId)
    //clear the table body if it exists
    let existingBody = table.getElementsByTagName('tbody')
    if (existingBody.length>0){
        table.removeChild(existingBody[0])
    }
    
    // let thead = document.createElement("thead")
    // let tr = document.createElement("tr")
    // let checkbox = makeCheckbox("all-checkboxes")
    // tr.appendChild(checkbox)
    // for (const [key, value] of Object.entries(data[0])) {
    //     if (key !== "_id") {
    //         let th = document.createElement("th")
    //         th.innerHTML = key
    //         tr.appendChild(th)
    //     }
    // }
    // let th = document.createElement("th")
    // tr.appendChild(th)
    // thead.appendChild(tr)
    // table.appendChild(thead)

    let tbody = document.createElement("tbody")
    for (let datarow of data) {
        let tr = document.createElement("tr")
        let checkbox = makeCheckbox("sel_" + datarow._id)
        tr.appendChild(checkbox)
        for (const [key, value] of Object.entries(datarow)) {
            if (key !== "_id") {
                let td = document.createElement("td")
                td.innerHTML = value
                tr.appendChild(td)
            }
        }
        let td = document.createElement("td")
        let dropdown = makeDropdown(datarow._id)
        td.appendChild(dropdown)
        tr.appendChild(td)
        tbody.appendChild(tr)
    }
    console.log(tbody)
    
    table.appendChild(tbody)
}
