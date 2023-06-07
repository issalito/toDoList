import React, { useState } from 'react';
import { TextField, ListItem, Checkbox, IconButton, Box } from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';

const TodoListItem = ({ todo, handleToggleTodo, handleDeleteTodo, handleUpdateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    handleUpdateTodo(todo.id, editedTitle, editedDescription);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setEditedDescription(event.target.value);
  };

  return (
    <ListItem disablePadding sx={{ position: 'relative' }}>
      <Checkbox
        checked={todo.complete}
        onChange={() => handleToggleTodo(todo.id)}
        color="primary"
      />
      {isEditing ? (
        <>
          <TextField
            value={editedTitle}
            onChange={handleTitleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            value={editedDescription}
            onChange={handleDescriptionChange}
            fullWidth
            variant="standard"
            style={{ marginTop: '10px' }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <IconButton onClick={handleSaveEdit} color="primary">
              <Save />
            </IconButton>
            <IconButton onClick={handleCancelEdit} color="primary">
              <Cancel />
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <TextField
            value={todo.title}
            disabled
            fullWidth
            variant="standard"
          />
          <TextField
            value={todo.description}
            disabled
            fullWidth
            variant="standard"
            style={{ marginTop: '10px' }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <IconButton onClick={handleStartEdit} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDeleteTodo(todo.id)} color="primary">
              <Delete />
            </IconButton>
          </Box>
        </>
      )}
    </ListItem>
  );
};

export default TodoListItem;
