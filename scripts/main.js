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
            id: allData.length > 0 ? allData[allData.length - 1].id + 1 : allData.length,
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
        const targetProject = allData.findIndex(proj => proj.id == project);
        const todo = createTodo(name, description, priority, targetProject);
        allData[targetProject].todoItems.push(todo);
        uploadToLocalStorage('', '', true);
    }

    const addProject = (name) => {
        allData.push(createProject(name));
        uploadToLocalStorage('', '', true);
    }

    const toggleTodoFinished = (project, id) => {
        const targetProject = allData.findIndex(proj => proj.id == project)
        allData[targetProject].todoItems[id].finished = allData[targetProject].todoItems[id].finished ? false : true;
    }

    const uploadToLocalStorage = (name, data, uploadAll = false) => {
        if(uploadAll){
            localStorage.setItem('todoData', JSON.stringify(allData));
            return;
        }
        localStorage.setItem(name, data);
    }

    const deleteTodo = (id) => {
        const targetProject = allData.findIndex(project => project.id == localStorage.getItem('current-project').split('-')[1])
        allData[targetProject].todoItems.splice(id, 1);
        uploadToLocalStorage('', '', true);
    }
    const deleteProject = (id) => {
        let project = allData.find(item => item.id == id);
        allData.splice(project.id, 1);
        uploadToLocalStorage('current-project', `project-0`);
        uploadToLocalStorage('', '', true);
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
        toggleTodoFinished,
        deleteTodo,
        deleteProject
    }

})();

const DOMController = (function(){
    const projectsElement = document.getElementById('subjects');    
    const notesContainer = document.getElementById('notes-container');

    const render = () => {
        const currentProject = localStorage.getItem('current-project');
        const currentProjectObject = todoList.allData.find(project => project.id == [currentProject.split('-')[1]]);

        projectsElement.innerHTML = `<a href="#!" class="subject-item subject-bottom modal-trigger" id="addProjectItem" data-target="newSubjectModal"> Add Project <i class="material-icons">add</i></a>`;
        todoList.allData.forEach((project) => {
            const current = document.getElementById(`project-div-${project.id}`)
            
            const projectElement = createProjectElement(project, currentProject);
            projectsElement.appendChild(projectElement);
        });

        document.getElementById('project-name-title').innerHTML = `${currentProjectObject.projectName} Todoz 
            ${currentProjectObject.id == 0 ? '' : `<i class="material-icons" id="delete-project">delete</i>`}`;
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
        element.classList.add('note', 'card', `priority-${todo.todoPriority}`, `finished-${todo.finished}`);
        element.id = `todo-${todo.id}`;
        element.innerHTML = `
            <div class="note-title">
                <div class="note-title-content">
                    <h5 class="text-flow"> 
                        <i class="material-icons ${finishedBtnClass} finish-btn" id=${todo.id}>${finishedBtnIcon}</i>  ${todo.todoName}
                    </h5>
                    <span class="priority">Priority: ${todo.todoPriority}</span>
                </div>
                
                <div>
                    <i class="material-icons edit-note" id="${todo.id}">edit</i>
                    <i class="material-icons delete-note" id="${todo.id}">delete</i>
                </div>
            </div>
            <div class="note-text">
                <p class="text-flow">${todo.todoDesc}</p>
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
        if(name.value.length <= 0){
            return;
        }
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

    const deleteNoteClick = (e) => {
        if(confirm('Are you sure you want to delete this Todo?')){
            todoList.deleteTodo(e.target.id);
        } else{
            return;
        }
        render();
    }
    const deleteProjectClick = () => {
        console.log(`deleting project ${localStorage.getItem('current-project').split('-')[1]}`);
        if(confirm('Are you sure you want to delete this project?')){    
            todoList.deleteProject(localStorage.getItem('current-project').split('-')[1]);
        } else{
            return;
        }
        render();
    }

    const bindEvents = () => {
        document.getElementById('addProjectBtn').addEventListener('click', addProjectClick);
        document.getElementById('addTodoBtn').addEventListener('click', addTodoClick);
        if(document.getElementById('delete-project')){
            document.getElementById('delete-project').addEventListener('click', deleteProjectClick);
        }

        document.querySelectorAll('.project-tab').forEach((item) => {
            item.addEventListener('click', projectTabClick);
        })
        document.querySelectorAll('.finish-btn').forEach((item) => {
            item.addEventListener('click', finishBtnClick);
        })
        document.querySelectorAll('.delete-note').forEach((item) => {
            item.addEventListener('click', deleteNoteClick);
        })
        
    }
    render();

    return {
        render
    }
})();