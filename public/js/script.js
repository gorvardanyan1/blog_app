const token = localStorage.getItem('token')



fetch('/blog', {
    headers: {
        'Authorization': token,
    }
})
    .then(res => res.json())
    .then(result => renderBlogs(result))
    .catch(error => console.error(error))


function renderBlogs(blogs) {
    const blogsDiv = document.querySelector('.blogsDiv')

    blogs.forEach(blog => {
        blogsDiv.innerHTML += `
        <div class='blogCommentDiv'>
            <div class='blog'>
                <h3>${blog.title}</h3>
                <h5>${blog.author}</h5>
                <a href='updateBlogForm.html#${blog._id}'>Update</a>
                <button onclick=deleteBlog('${blog._id}')>Delete</button>
                <p>${blog.body}</p>
            </div>
            <div>
                <form onsubmit="commentSubmit(event)" data-id='${blog._id}' method='POST'>
                    <input type="text" name="comment" placeholder="comment">
                    <input type="submit" >
                 </form>
                <div class='messagesDiv'>
                ${renderComments(blog)}
                </div>
            </div>
        </div>
     `

    })

}
function commentSubmit(e) {
    e.preventDefault();
    let id = e.target.getAttribute('data-id')
    const comment = e.target.comment.value
    fetch(`/blog/comment/${id}`, {
        method: "POST",
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment })
    })
        .then(result => result.json())
        .then(res => location.reload())
        .catch(error => console.log(error))
}

function deleteBlog(id) {
    fetch(`/blog/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        }

    })
        .then(result => result.json())
        .then(res => location.reload())
        .catch(error => console.log(error))

}

function renderComments(blog) {
    const { comments } = blog
    let div = ''
    comments.forEach(elem => {
        div += `
        <div>
           <h3>${elem.comment} |author: ${elem.author} <button blog-id=${blog._id} onclick=deleteComment(event,'${elem._id}')>Delete</button> </h3>
        </div>
        `

    })
    return div
}

function deleteComment(e, commentId) {
    let blogId = e.target.getAttribute('blog-id');
    fetch(`/blog/comment/${blogId}/${commentId}`,
        {
            method: "DELETE",
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            }
        }
    ).then(result => result.json())
        .then(res => location.reload())
        .catch(err => console.error(err))

}

function logOut(){
    localStorage.removeItem('token')
}