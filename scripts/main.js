const todoList = (function() {
    let allData;
    if(localStorage.todoData){
        allData = JSON.parse(localStorage.getItem('todoData'));
    } else {
        allData = [];
    }
    console.log(allData);

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
            project: project,
            id: allData[project].todoItems.length,
            finished: false
        }
    }
    const addTodo = (name, description, priority, project) => {
        const todo = createTodo(name, description, priority, project);
        allData[todo.project].todoItems.push(todo);
        uploadToLocalStorage('', '', true);
    }

    const addProject = (name) => {
        allData.push(createProject(name));
        uploadToLocalStorage('', '', true);
    }

    const toggleTodoFinished = (project, id) => {
        allData[project].todoItems[id].finished = allData[project].todoItems[id].finished ? false : true;
    }

    const uploadToLocalStorage = (name, data, uploadAll = false) => {
        if(uploadAll){
            localStorage.setItem('todoData', JSON.stringify(allData));
            return;
        }
        localStorage.setItem(name, data);
    }

    if(!localStorage.todoData){
        addProject('Default');
        addTodo('Example Todo', 'This is the description of the default example todo.', 'low', 0);
        uploadToLocalStorage('current-project', 'project-0');
    }
    
    return {
        allData,
        addProject,
        addTodo,
        uploadToLocalStorage,
        toggleTodoFinished
    }

})();

const DOMController = (function(){
    const projectsElement = document.getElementById('subjects');    
    const notesContainer = document.getElementById('notes-container');

    const render = () => {
        const currentProject = localStorage.getItem('current-project');
        const currentProjectObject = todoList.allData[currentProject.split('-')[1]];

        todoList.allData.forEach((project) => {
            const current = document.getElementById(`project-div-${project.id}`)
            if(current){
                current.parentNode.removeChild(current);
            };
            const projectElement = createProjectElement(project, currentProject);
            projectsElement.insertBefore(projectElement, document.getElementById('addProjectItem'));
        });

        document.getElementById('project-name-title').textContent = currentProjectObject.projectName;
        notesContainer.innerHTML = '';
        if(currentProjectObject.todoItems.length == 0){
            notesContainer.innerHTML = `<p class="text-flow">There are currently no todos in this project.</p>`
        }

        currentProjectObject.todoItems.forEach((todo) => {
            const todoElement = createTodoElement(todo);
            notesContainer.appendChild(todoElement);
        });

        bindEvents();
    }

    const createProjectElement = (project, currentProject) => {
        const element = document.createElement('div');
        element.id = `project-div-${project.id}`;
        //add a blue dot if the project is the current one selected
        element.innerHTML = currentProject == `project-${project.id}` ? `
        <li class="subject-item project-tab" id="project-${[project.id]}">
            ${project.projectName}
            <i class="material-icons">brightness_1</i>
        </li>` : 
        `<li class="subject-item project-tab" id="project-${[project.id]}">
            ${project.projectName}
        </li>`;
        return element;
    }

    const createTodoElement = (todo) => {
        const element = document.createElement('div');
        const finishedBtnClass = todo.finished ? 'finished-icon' : 'not-finished-icon';
        const finishedBtnIcon = todo.finished ? 'check_circle' : 'remove_circle_outline';
        element.classList.add('note', 'card', `priority-${todo.todoPriority}`);
        element.id = `todo-${todo.id}`;
        element.innerHTML = `
            <div class="note-title">
                <h5 class="text-flow"> 
                <i class="material-icons ${finishedBtnClass} finish-btn" id=${todo.id}>${finishedBtnIcon}</i>  ${todo.todoName}</h5>
                <div>
                    <i class="material-icons">edit</i>
                    <i class="material-icons">delete</i>
                </div>
            </div>
            <div class="note-text">
                <p class="text-flow">${todo.todoDesc}</p>
                <p class="text-flow">Priority: ${todo.todoPriority}</p>
            </div>`
        return element;
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
        const name = document.getElementById('todoName');
        const desc = document.getElementById('todoContent');
        const priority = document.getElementById('todoPriority');
        const project = localStorage.getItem('current-project').split('-')[1];
        console.log(project);
        todoList.addTodo(name.value, desc.value, priority.value, project);
        name.value = '';
        desc.value = '';
        
        render();
    }

    const projectTabClick = (e) => {
        todoList.uploadToLocalStorage('current-project', e.target.id);
        render();
    }

    const finishBtnClick = (e) => {
        todoList.toggleTodoFinished(+localStorage.getItem('current-project').split('-')[1], e.target.id);
        render();
    }

    const bindEvents = () => {
        document.getElementById('addProjectBtn').addEventListener('click', addProjectClick);
        document.getElementById('addTodoBtn').addEventListener('click', addTodoClick);

        document.querySelectorAll('.project-tab').forEach((item) => {
            item.addEventListener('click', projectTabClick);
        })
        document.querySelectorAll('.finish-btn').forEach((item) => {
            item.addEventListener('click', finishBtnClick);
        })
    }
    render();
})();