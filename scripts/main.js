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
            id: allData[project].todoItems.length
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

    const uploadToLocalStorage = (name, data, uploadAll = false) => {
        if(uploadAll){
            localStorage.setItem('todoData', JSON.stringify(allData));
            return;
        }
        localStorage.setItem(name, data);
    }

    if(!localStorage.todoData){
        addProject('Default');
        addTodo('Example Todo', 'This is the description of the default example todo.', 'high', 0);
    }
    uploadToLocalStorage('todoData', JSON.stringify(allData));
    uploadToLocalStorage('current-project', 'project-0');
    
    return {
        allData,
        addProject,
        addTodo,
        uploadToLocalStorage
    }

})();

const DOMController = (function(){
    const projectsElement = document.getElementById('subjects');    
    const notesContainer = document.getElementById('notes-container');

    const data = todoList.allData;

    const render = () => {
        const currentProject = localStorage.getItem('current-project');
        const currentProjectObject = data[currentProject.split('-')[1]];

        data.forEach((project) => {
            //remove the current element so it can be properly rendered.
            const current = document.getElementById(`project-div-${project.id}`)
            if(current){
                current.parentNode.removeChild(current);
            };
            //create the element to be appended
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
            //append the project tab
            projectsElement.insertBefore(element, document.getElementById('addProjectItem'));
        });

        document.getElementById('project-name-title').textContent = currentProjectObject.projectName;
        notesContainer.innerHTML = '';
        if(currentProjectObject.todoItems.length == 0){
            notesContainer.innerHTML = `<p class="text-flow">There are currently no todos in this project.</p>`
        }
        currentProjectObject.todoItems.forEach((todo) => {
            const element = document.createElement('div');
            element.classList.add('note', 'card');
            element.id = `todo-${todo.id}`;
            element.innerHTML = `
                <div class="note-title">
                    <h5 class="text-flow ">${todo.todoName}</h5>
                </div>
                <div class="note-text">
                    <p class="text-flow">${todo.todoDesc}</p>
                    <p class="text-flow">Priority: ${todo.todoPriority}</p>
                </div>`
            notesContainer.appendChild(element);
        });

        bindEvents();
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
        const project = localStorage.getItem('current-project').split('-')[1];
        console.log(project);
        todoList.addTodo(name, desc, priority, project);
        render();
    }

    const projectTabClick = (e) => {
        todoList.uploadToLocalStorage('current-project', e.target.id);
        render();
    }

    const bindEvents = () => {
        document.getElementById('addProjectBtn').addEventListener('click', addProjectClick);
        document.getElementById('addTodoBtn').addEventListener('click', addTodoClick);

        document.querySelectorAll('.project-tab').forEach((item) => {
            item.addEventListener('click', projectTabClick);
        })
    }
    render();
})();