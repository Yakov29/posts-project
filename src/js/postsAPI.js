import axios from 'axios';

const API_URL = 'https://669a39809ba098ed61fed14b.mockapi.io/fruits/posts';

const postsList = document.querySelector('.posts__list');
const nameInput = document.querySelector('input[name="name"]');
const textInput = document.querySelector('input[name="text"]');
const submitButton = document.querySelector('.submit__post');
const editForm = document.querySelector('.edit__form');
const editNameInput = document.querySelector('input[name="edit-name"]');
const editTextInput = document.querySelector('input[name="edit-text"]');
const editIdInput = document.querySelector('input[name="edit-id"]');
const updateButton = document.querySelector('.update__post');
const cancelEditButton = document.querySelector('.cancel__edit');

const renderPosts = (posts) => {
    postsList.innerHTML = posts.map(post => `
        <li class="posts__item">
            <h4 class="item__name">${post.name}</h4>
            <p class="item__text">${post.text}</p>
            <button class="edit__post" data-id="${post.id}">✏️</button>
            <button class="delete__posts" data-id="${post.id}">❌</button>
        </li>
    `).join('');
};

const getPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        const posts = response.data;
        renderPosts(posts);
    } catch (error) {
        console.error('Помилка при отриманні постів:', error);
    }
};

const addPost = async () => {
    try {
        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (!name || !text) {
            alert('Будь ласка, заповніть усі поля.');
            return;
        }

        await axios.post(API_URL, { name, text });

        nameInput.value = '';
        textInput.value = '';

        getPosts();
    } catch (error) {
        console.error('Помилка при додаванні поста:', error);
    }
};

const deletePost = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
        getPosts();
    } catch (error) {
        console.error('Помилка при видаленні поста:', error);
    }
};

const showEditForm = (post) => {
    editNameInput.value = post.name;
    editTextInput.value = post.text;
    editIdInput.value = post.id;
    editForm.style.display = 'block';
};

const updatePost = async () => {
    try {
        const name = editNameInput.value.trim();
        const text = editTextInput.value.trim();
        const id = editIdInput.value;

        if (!name || !text) {
            alert('Будь ласка, заповніть усі поля.');
            return;
        }

        await axios.put(`${API_URL}/${id}`, { name, text });

        editNameInput.value = '';
        editTextInput.value = '';
        editIdInput.value = '';
        editForm.style.display = 'none';

        getPosts();
    } catch (error) {
        console.error('Помилка при оновленні поста:', error);
    }
};

const cancelEdit = () => {
    editNameInput.value = '';
    editTextInput.value = '';
    editIdInput.value = '';
    editForm.style.display = 'none';
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
                console.error('Помилка при отриманні поста:', error);
            });
    }
});

updateButton.addEventListener('click', updatePost);
cancelEditButton.addEventListener('click', cancelEdit);

getPosts();
