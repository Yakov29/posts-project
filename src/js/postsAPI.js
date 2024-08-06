import axios from 'axios';
import data from '../templates/layout.hbs';

const API_URL = 'https://669a39809ba098ed61fed14b.mockapi.io/fruits/posts';

const postsList = document.querySelector('.posts__list');
const nameInput = document.querySelector('input[name="name"]');
const textInput = document.querySelector('input[name="text"]');
const hashtagsInput = document.querySelector('input[name="hashtags"]');
const submitButton = document.querySelector('.submit__post');
const commentForm = document.querySelector('.comment__form');
const commentNameInput = document.querySelector('input[name="comment-name"]');
const commentTextInput = document.querySelector('input[name="comment-text"]');
const commentIdInput = document.querySelector('input[name="comment-id"]');
const editForm = document.querySelector('.edit__form');
const editNameInput = document.querySelector('input[name="edit-name"]');
const editTextInput = document.querySelector('input[name="edit-text"]');
const editHashtagsInput = document.querySelector('input[name="edit-hashtags"]');
const editIdInput = document.querySelector('input[name="edit-id"]');
const updateButton = document.querySelector('.update__post');
const cancelEditButton = document.querySelector('.cancel__edit');
const addCommentButton = document.querySelector('.add__comment');
const cancelCommentButton = document.querySelector('.cancel__comment');

const renderPosts = (posts) => {
    postsList.innerHTML = data({ posts });
};

const getPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        const posts = response.data;
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

const addPost = async () => {
    const name = nameInput.value;
    const text = textInput.value;
    const hashtags = hashtagsInput.value.split(',').map(tag => tag.trim()); // Разделяем и очищаем хештеги
    const createdAt = new Date().toISOString(); // Создаем дату

    await axios.post(API_URL, { name, text, tags: hashtags, createdAt });

    nameInput.value = '';
    textInput.value = '';
    hashtagsInput.value = '';

    getPosts();
};

const deletePost = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    getPosts();
};

const showEditForm = async (post) => {
    editNameInput.value = post.name;
    editTextInput.value = post.text;
    editHashtagsInput.value = post.tags ? post.tags.join(', ') : ''; // Преобразуем массив хештегов в строку
    editIdInput.value = post.id;
    editForm.style.display = 'block';
};

const updatePost = async () => {
    const name = editNameInput.value;
    const text = editTextInput.value;
    const hashtags = editHashtagsInput.value.split(',').map(tag => tag.trim()); // Разделяем и очищаем хештеги
    const id = editIdInput.value;

    const updatedPost = {
        name,
        text,
        tags: hashtags,
    };

    await axios.put(`${API_URL}/${id}`, updatedPost);

    editNameInput.value = '';
    editTextInput.value = '';
    editHashtagsInput.value = '';
    editIdInput.value = '';
    editForm.style.display = 'none';

    getPosts();
};

const showCommentForm = (postId) => {
    commentIdInput.value = postId;
    commentForm.style.display = 'block';
};

const addComment = async () => {
    const name = commentNameInput.value;
    const text = commentTextInput.value;
    const postId = commentIdInput.value;

    const postResponse = await axios.get(`${API_URL}/${postId}`);
    const post = postResponse.data;

    const commentData = {
        name,
        text
    };

    const updatedPost = {
<<<<<<< HEAD
        ...post,
        comments: post.comments ? post.comments.concat(commentData) : [commentData]
=======
        name: post.name,
        text: post.text,
>>>>>>> d000114f1686b8917909dfaa5cfdf04b02e7edd3
    };

    await axios.put(`${API_URL}/${postId}`, updatedPost);

    commentNameInput.value = '';
    commentTextInput.value = '';
    commentIdInput.value = '';
    commentForm.style.display = 'none';

    getPosts();
};

const cancelEdit = () => {
    editNameInput.value = '';
    editTextInput.value = '';
    editHashtagsInput.value = '';
    editIdInput.value = '';
    editForm.style.display = 'none';
};

const cancelComment = () => {
    commentNameInput.value = '';
    commentTextInput.value = '';
    commentIdInput.value = '';
    commentForm.style.display = 'none';
};

submitButton.addEventListener('click', addPost);

postsList.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete__posts')) {
        const id = event.target.getAttribute('data-id');
        deletePost(id);
    } else if (event.target.classList.contains('edit__post')) {
        const id = event.target.getAttribute('data-id');
        axios.get(`${API_URL}/${id}`)
            .then(response => {
                showEditForm(response.data);
            })
            .catch(error => {
                console.error('Error fetching post:', error);
            });
    } else if (event.target.classList.contains('comment__posts')) {
        const id = event.target.getAttribute('data-id');
        showCommentForm(id);
    }
});

updateButton.addEventListener('click', updatePost);
cancelEditButton.addEventListener('click', cancelEdit);
addCommentButton.addEventListener('click', addComment);
cancelCommentButton.addEventListener('click', cancelComment);

getPosts();
