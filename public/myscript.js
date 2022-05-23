const handleDelete= () => {
    if (confirm("Are you sure you want to delete this?")){
        let form = event.currentTarget.parentNode
        form.submit()
    }
    let button = event.currentTarget
    button.style.backgroundColor="DodgerBlue"
    return false
}