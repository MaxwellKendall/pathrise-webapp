/* Javascript */
// PLEASE SEE MANY EXAMPLES OF MY CSS SKILLS. DO NOT HAVE CAPACITY TO DEMONSTRATE HERE maxwellkendall.com or ckendallart.com
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


(() => {
    const localStorageKey = 'pathrise__webapp';
    var body = document.querySelector('body');
    var addModal = body.querySelector('div.add-modal');
    var deleteModal = body.querySelector('div.delete-modal');
    var deleteBtn = deleteModal.querySelector('button');
    var addButton = body.querySelector('button.add-button');
    var jobs = body.querySelector('ul.jobs');
    var numberOfJobs = body.querySelector('#js-number-of-jobs');
    var addForm = addModal.querySelector('form');
    var company = addModal.querySelector('input#js-company');
    var position = addModal.querySelector('input#js-position');
    var modalContainer = body.querySelector('.modal-container');

    Array
        .from(document.querySelectorAll('.modal-container__body'))
        .forEach((el) => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
            })
        })
    
    modalContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        if (deleteModal.classList.contains('hide')) {
            addModal.classList.add('hide');
        }
        else {
            deleteModal.classList.add('hide');
        }
    })

    var handleDelete = (e) => {
        const id = e.srcElement.dataset.id;
        var [job, position] = id.split('-');
        var newList = JSON
            .parse(localStorage.getItem(localStorageKey))
            .filter((arr) => {
                if (arr[0] === job && arr[1] === position) {
                    return false;
                }
                return true;
            });
        if (newList.length) {
            localStorage.setItem(localStorageKey, JSON.stringify(newList));
        }
        else {
            localStorage.removeItem(localStorageKey);
        }
        
        var jobToRemove = Array
            .from(jobs.children)
            .find((el) => {
                return el.id === `js-${id}`;
            });
        jobToRemove.remove();
        deleteModal.classList.add('hide');
        body.classList.remove('modal');
        numberOfJobs.innerHTML = `${newList.length} JOBS`
    }


    var showDeleteModal = (e) => {
        const id = e.srcElement.dataset.id;
        deleteModal.classList.remove('hide');
        body.classList.add('modal');
        deleteBtn.setAttribute('data-id', id)
    }

    var handleAddSingleJob = (company, job, dateAdded) => {
        var jobElement = document.createElement('li');
        jobElement.setAttribute('class', 'job')
        jobElement.setAttribute('id', `js-${company}-${job}`);
        jobElement.setAttribute('style', `background: ${getRandomColor()}`);
        var companyTitle = document.createElement('h2')
        var positionTitle = document.createElement('h3');
        var minutesAgo = document.createElement('span');
        console.log('dateAdded', dateAdded)
        var timeSinceAdded = (new Date().getTime() - dateAdded) / 60000;
        var deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'delete-btn');
        deleteBtn.setAttribute('data-id', `${company}-${job}`);
        deleteBtn.addEventListener('click', showDeleteModal);
        deleteBtn.innerHTML = 'X';
        companyTitle.innerHTML = company;
        positionTitle.innerHTML = job;
        minutesAgo.innerHTML = `Added ${timeSinceAdded} minutes ago`;
        jobElement.appendChild(companyTitle);
        jobElement.appendChild(positionTitle);
        jobElement.appendChild(minutesAgo);
        jobElement.appendChild(deleteBtn);
        jobs.appendChild(jobElement);
        var newNumberOfJobs = JSON.parse(localStorage.getItem(localStorageKey)).length;
        numberOfJobs.innerHTML = `${newNumberOfJobs} JOBS`;
        body.classList.remove('modal');
    }

    var handleAddJobsFromLocalStorage = () => {
        var savedJobs = JSON.parse(localStorage.getItem(localStorageKey));

        if (savedJobs) {
            savedJobs.forEach(([company, job, dateAdded]) => {
                handleAddSingleJob(company, job, dateAdded);
            })
            numberOfJobs.innerHTML = savedJobs.length > 1
                ? `${savedJobs.length} JOBS`
                : `${savedJobs.length} JOB`
        }
    }

    handleAddJobsFromLocalStorage();

    addButton.addEventListener('click', () => {
        addModal.classList.remove('hide');
        body.classList.add('modal');
    });

    deleteBtn.addEventListener('click', handleDelete);

    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        var newSelection = [company.value, position.value, new Date().getTime()];
        var existingItems = localStorage.getItem(localStorageKey)
            ? JSON.parse(localStorage.getItem(localStorageKey))
            : [];

        if (!existingItems.some((arr) => arr[0] === newSelection[0] && arr[1] === newSelection[1])) {
            localStorage.setItem(localStorageKey, JSON.stringify(
                existingItems.concat([newSelection])
            ));
            handleAddSingleJob(newSelection[0], newSelection[1], newSelection[2]);
        }
        addModal.classList.add('hide');
        company.value = '';
        position.value = '';
    });
})();
