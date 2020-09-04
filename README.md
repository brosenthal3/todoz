# Todoz
Todoz is a simple todo list, made with vanilla JavaScript and styled with Materialize CSS. This project may still contain bugs.

## Features:
- You can add and delete projects.
- You can add todo's for each project.
- Each todo can have a different priority (low, medium, high).
- You can mark todo's as done, or delete them.

This project also makes use of the localStorage web API, so that all the todo's and projects are saved, even if you reload or close the window.
To reset all the data, press F12 to go to the console and type in:
```javascript
localStorage.clear();
todoList.uploadToLocalStorage('current-project', 'project-0');
```
This will clear the storage and by reloading the page you will see that the site will return to it's initial state.

## Todo:
There are multiple things that I still want to add to this project:
- Edit option for todo's and projects (working on this one).
- Better/cleaner UI. 
- "View All Todo's" tab.
- Due date for each todo.
- Rewrite this project using React/Vue/Angular (once I learn these).
