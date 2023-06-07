import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#116D6E',
    },
    background: {
      default: '#C2DEDC',
    },
  },
});

function App() {
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editTodoId, setEditTodoId] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        'https://dev.hisptz.com/dhis2/api/dataStore/issaMhando?fields=.',
        {
          auth: {
            username: 'admin',
            password: 'district',
          },
        }
      );

      if (response.data.entries) {
        setTodos(response.data.entries.map((entry) => entry.value));
      }

      setError(null);
      console.log(response.data.entries);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const createTodo = async (todo) => {
    try {
      await axios.post(
        'https://dev.hisptz.com/dhis2/api/dataStore/issaMhando/' + todo.id,
        todo,
        {
          auth: {
            username: 'admin',
            password: 'district',
          },
        }
      );

      setTodos((prevTodos) => [...prevTodos, todo]);
      setNewTodo('');
      setNewDescription('');
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleTitleChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setNewDescription(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (newTodo.trim() !== '') {
      const todo = {
        id: Date.now().toString(),
        title: newTodo,
        description: newDescription,
        completed: false,
        created: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      createTodo(todo);
    }
  };

  const handleToggleTodo = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);

    try {
      await axios.put(
        'https://dev.hisptz.com/dhis2/api/dataStore/issaMhando/' + id,
        updatedTodos.find((todo) => todo.id === id),
        {
          auth: {
            username: 'admin',
            password: 'district',
          },
        }
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleDeleteTodo = async (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    try {
      await axios.delete(
        'https://dev.hisptz.com/dhis2/api/dataStore/issaMhando/' + id,
        {
          auth: {
            username: 'admin',
            password: 'district',
          },
        }
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleStartEdit = (id, title, description) => {
    setEditTodoId(id);
    setEditedTitle(title);
    setEditedDescription(description);
  };

  const handleUpdateTodo = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            title: editedTitle,
            description: editedDescription,
            lastUpdated: new Date().toISOString(),
          }
        : todo
    );
    setTodos(updatedTodos);
    setEditTodoId('');
    setEditedTitle('');
    setEditedDescription('');

    try {
      await axios.put(
        'https://dev.hisptz.com/dhis2/api/dataStore/issaMhando/' + id,
        updatedTodos.find((todo) => todo.id === id),
        {
          auth: {
            username: 'admin',
            password: 'district',
          },
        }
      );
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditTodoId('');
    setEditedTitle('');
    setEditedDescription('');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Todo App
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          {currentDate}
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            type="text"
            label="Enter a new todo"
            variant="outlined"
            fullWidth
            value={newTodo}
            onChange={handleTitleChange}
          />
          <TextField
            type="text"
            label="Enter a description"
            variant="outlined"
            fullWidth
            value={newDescription}
            onChange={handleDescriptionChange}
            style={{ marginTop: '10px' }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: 10, marginBottom: 10}}>
            Add Todo
          </Button>
        </form>

<List>
  {todos.map((todo, index) => (
    <React.Fragment key={todo.id}>
      <ListItem
        disablePadding
        sx={{ position: 'relative', marginBottom: '10px' }}
      >
        <Checkbox
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo.id)}
          color="primary"
        />
        {editTodoId === todo.id ? (
          <>
            <div>
              <TextField
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                fullWidth
                variant="standard"
              />
              <TextField
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                fullWidth
                variant="standard"
                style={{ marginTop: '10px' }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconButton
                aria-label="save"
                onClick={() => handleUpdateTodo(todo.id)}
              >
                <Save />
              </IconButton>
              <IconButton
                aria-label="cancel"
                onClick={handleCancelEdit}
              >
                <Cancel />
              </IconButton>
            </div>
          </>
        ) : (
          <Box
            component="div"
            sx={{
              textDecoration: todo.completed ? 'line-through' : 'none',
              flexGrow: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {todo.title}
            </Typography>
            <Box sx={{ marginTop: '5px' }}>
              <Typography variant="body2">{todo.description}</Typography>
            </Box>
          </Box>
        )}
        <div>
          {editTodoId !== todo.id && (
            <IconButton
              onClick={() =>
                handleStartEdit(todo.id, todo.title, todo.description)
              }
              color="primary"
              aria-label="edit"
            >
              <Edit />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleDeleteTodo(todo.id)}
            color="primary"
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </div>
      </ListItem>
      {index !== todos.length - 1 && (
        <Divider variant="fullWidth" component="li" />
      )}
    </React.Fragment>
  ))}
</List>
        {error && (
          <Typography variant="body1" align="center" color="error">
            Error: {error}
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;