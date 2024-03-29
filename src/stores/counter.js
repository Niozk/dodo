import axios from 'axios';
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getAuth } from 'firebase/auth';

export const useTodoStore = defineStore('store', {
    state: () => ({
        todos: [],
        currentTodo: useStorage('currentTodo', {})
    }),
    actions: {
        async getTodos() {
            try {
                const userId = getAuth().currentUser.uid;
                const response = await axios.get(`http://localhost:8080/todos/${userId}`);
                const todos = response.data.map(item => ({
                    id: item.id,
                    author: item.author,
                    todo: item.todo,
                }));
                this.todos = todos;
            } catch (error) {
                console.error(error);
            }
        },
        async getTodoById(id) {
            try {
                const response = await axios.get(`http://localhost:8080/todos/get/${id}`);
                const todo = {
                    id: response.data.id,
                    author: response.data.author,
                    todo: response.data.todo
                };
                return this.currentTodo = todo;
            } catch (error) {
                console.error(error);
            }
        },
        async newTodo({ author, todo }) {
            try {
                const userId = getAuth().currentUser.uid;
                const response = await axios.post('http://localhost:8080/todos/new', {
                    author,
                    todo,
                    userId
                });
                this.getTodos();
                return response.data;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        async deleteTodo(id) {
            try {
                const response = await axios.get(`http://localhost:8080/todos/get/${id}`);
                if (!response.data) {
                    return console.log('todo not found');
                }
                await axios.delete(`http://localhost:8080/todos/delete/${id}`);
                this.getTodos();
            } catch (error) {
                console.error(error);
            }
        },
        async updateTodo (id, author, todo) {
            try {
                const userId = getAuth().currentUser.uid;
                const response = await axios.get(`http://localhost:8080/todos/get/${id}`);
                if (!response.data) {
                    return console.log('todo not found');
                }
                await axios.put(`http://localhost:8080/todos/put/${id}`, {
                    author,
                    todo,
                    userId
                });
                this.getTodoById(id);
            } catch (error) {
                console.error(error)
            }
        }
    },
})