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
    let s = document.createElement("select")
    s.id = id
    s.classList.add("browser-default")
    let option = null
    option = document.createElement("option")
    option.value = ""
    option.innerHTML = "..."
    s.appendChild(option)
    option = document.createElement("option")
    option.value = "view"
    option.innerHTML = "View"
    s.appendChild(option)
    option = document.createElement("option")
    option.value = "create"
    option.innerHTML = "Create"
    s.appendChild(option)
    option = document.createElement("option")
    option.value = "delete"
    option.innerHTML = "Delete"
    s.appendChild(option)
    return s
}

const fillTable = (tableId, data) => {
    let table = document.getElementById(tableId)
    removeAllChildNodes(table)
    if (data.length === 0) return
    let thead = document.createElement("thead")
    let tr = document.createElement("tr")
    let checkbox = makeCheckbox("all-checkboxes")
    tr.appendChild(checkbox)
    for (const [key, value] of Object.entries(data[0])) {
        if (key !== "_id") {
            let th = document.createElement("th")
            th.innerHTML = key
            tr.appendChild(th)
        }
    }
    let th = document.createElement("th")
    tr.appendChild(th)
    thead.appendChild(tr)
    table.appendChild(thead)
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
        let dropdown = makeDropdown("dropdown_" + datarow._id)
        td.appendChild(dropdown)
        tr.appendChild(td)
        tbody.appendChild(tr)
        table.appendChild(tbody)
    }
}
