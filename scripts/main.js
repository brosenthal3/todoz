const todoList = (function() {
    let allData = [];

    const createProject = (name) => {
        return {
            projectName: name,
            id: allData.length,
            todoItems: []
        }
    }
    const createTodo = (name, description, priority, project) => {
        return {
            todoName: name,
            todoDesc: description,
            todoPriority: priority,
            project: project
        }
    }
    const addTodo = (name, description, priority, project) => {
        const todo = createTodo(name, description, priority, project);
        allData[todo.project].todoItems.push(todo);
    }
    const addProject = (name) => {
        allData.push(createProject(name));
    }

    addProject('Default');
    addTodo('name', 'desc', 'high', 0);
    
    return {
        allData,
        addProject,
        addTodo
    }

})();

const storage = (function(){
    const uploadToLocalStorage = () => {
        localStorage.setItem('TodoData', JSON.stringify(todoList.allData));
    }
    const getLocalStorageData = () => {
        return JSON.parse(localStorage.getItem('TodoData'));
    }
    const clearLocalStorage = () => {
        localStorage.clear();
    }
    clearLocalStorage();
    uploadToLocalStorage();
    console.log(getLocalStorageData());

})();

const DOMController = (function(){
    const projectsElement = document.getElementById('subjects');

    const render = () => {
        const data = todoList.allData;
        data.forEach((project) => {
            if(document.getElementById(`project-${project.id}`)) return;
            const element = document.createElement('div');
            element.innerHTML = `<li class="subject-item" id="project-${[project.id]}">${project.projectName}<i class="material-icons">brightness_1</i></li>`
            projectsElement.insertBefore(element, document.getElementById('addProjectItem'));
        })
    }

    const addProjectClick = () => {
        const name = document.getElementById('project-name').value;
        if(name.length <= 0){
            return;
        } else{
            todoList.addProject(name);
        }
        render();
    }
    const addTodoClick = () => {
        const name = document.getElementById('todoName').value;
        const desc = document.getElementById('todoContent').value;
        const priority = document.getElementById('todoPriority').value;
        const project = 0; //for now, change later.
        todoList.addTodo(name, desc, priority, project);
        render();
    }

    const bindEvents = () => {
        document.getElementById('addProjectBtn').addEventListener('click', addProjectClick);
        document.getElementById('addTodoBtn').addEventListener('click', addTodoClick);

    }

    render();
    bindEvents();
})();