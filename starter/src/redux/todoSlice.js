import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getAsyncTodos = createAsyncThunk(
    'todos/getTodosAsync',
    async () => {
        const res = await fetch('http://localhost:7000/todos');
        if (res.ok){
            const todos = await res.json();
            return { todos };
        }
    }
)

export const addTodoAsync = createAsyncThunk(
    'todos/addTodosAsync',
    async (payload) => {
        const res = await fetch("http://localhost:7000/todos", {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({ title: payload.title }),
        });
        if (res.ok){
            const todo = await res.json();
            return { todo };
        }
    }
);

export const toggleCompleteAsync = createAsyncThunk(
    '/todos/completeTodoAsync',
    async (payload) => {
        const res = await fetch(`http://localhost:7000/todos/${payload.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: payload.completed }),
        });
        if (res.ok){
            const todo = await res.json();
            return { todo };
        }
    }
);

export const deleteTodoAsync = createAsyncThunk(
    'todos/deleteTodoAsync',
    async (payload) => {
        const res = await fetch(`http://localhost:7000/todos/${payload.id}`, {
            method: 'DELETE',
        });
        if (res.ok){
            const todo = await res.json();
            return { id: payload.id };
        }
    }
);
export const todoSlice = createSlice({
    name: "todos",
    initialState: [],
    reducers: {
        addTodo: (state, action) => {
            const todo = {
                id: new Date(),
                title: action.payload.title,
                completed: false,
            };
            state.push(todo);
        },
        toggleComplete: (state, action) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id);
            state[index].completed = action.payload.completed; //or maybe just true
        },
        deleteTodo: (state, action) => {
            return state.filter((todo) => todo.id !== action.payload.id);
        },
    },
    extraReducers: {
        [getAsyncTodos.fulfilled]: (state, action) => {
            return action.payload.todos;
        },
        [addTodoAsync.fulfilled]: (state, action) => {
            return action.payload.todo;
        },
        [toggleCompleteAsync.fulfilled]: (state, action) => {
            //finding index matching id
            const index = state.findIndex(
                (todo) => todo.id === action.payload.todo.id
            );
            state[index].completed = action.payload.todo.completed;
        },
        [deleteTodoAsync.fulfilled]: (state, action) => {
            return state.filter((todo) => todo.id !== action.payload.id);
        },
    }
});

export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;