//Define Student object
/**
 * Object containing data of a student.
 * @typedef {Object} Student
 * @property {string} avatar
 * @property {string} name
 * @property {string} email
 * @property {string} joined
*/

/**
 * ul where the students are loaded
 * @type {HTMLUListElement}
 */
const studentList = document.querySelector('ul.student-list')

/**
 * Desired number of students per page
 */
const studentsPerPage = 10

/**
 * Recursively converts every li from student-list ul into a array of objects containing data about the students,
 * one student at a time
 * @param {Student[]} students The array that the next student will be added to. Default is [ ]
 * @returns {Student[]} Array of students.
 */
const getStudentsFromList = (students = []) => {
    
    // if the student-list ul has no children, we are done. Return the data.  
    if (!studentList.firstElementChild) return students
    
   

    // if child li exists, get the first li and remove it from the dom
    const li = studentList.removeChild(studentList.firstElementChild)

    // get all the data
    const avatar = li.querySelector('img.avatar').src
    const name = li.querySelector('h3').textContent
    const email = li.querySelector('span.email').textContent
    const joined = li.querySelector('span.date').textContent

    // put all the data in student object and add it to the students array
    const student = { avatar, name, email, joined }
    students.push(student)

    // get the next student
    return getStudentsFromList(students)
}

/**
 * Convert a student object into a li, then add it to the dom as a child to student-list ul
 * @param {Student} student A student object that contains data about that student
 */
const createStudentListItem = student => {
    const { avatar, name, email, joined } = student

    // create avatar img
    const img = document.createElement('img')
    img.classList.add('avatar')
    img.src = avatar

    // create name h3
    const h3 = document.createElement('h3')
    h3.textContent = name

    // create email span
    const emailSpan = document.createElement('span')
    emailSpan.classList.add('email')
    emailSpan.textContent = email

    // create joined-date span
    const joinedSpan = document.createElement('span')
    joinedSpan.classList.add('date')
    joinedSpan.textContent = joined

    // create student-details div, add avatar, name and email to it
    const studentDiv = document.createElement('div')
    studentDiv.classList.add('student-details')
    studentDiv.appendChild(img)
    studentDiv.appendChild(h3)
    studentDiv.appendChild(emailSpan)

    // create joined-details div, add joined date to it
    const joinedDiv = document.createElement('div')
    joinedDiv.classList.add('joined-details')
    joinedDiv.appendChild(joinedSpan)

    // create li, add both divs to it
    const li = document.createElement('li')
    li.className = 'student-item cf'
    li.appendChild(studentDiv)
    li.appendChild(joinedDiv)

    studentList.appendChild(li)
}

/**
 * Recursively remove all li children of student-list ul, one at a time
 */
const emptyStudentList = () => {

    // exit function if there ul has no children
    if (!studentList.firstElementChild) return

    // otherwise remove the first child from the dom
    studentList.removeChild(studentList.firstElementChild)

    // remove next one
    emptyStudentList()
}

/**
 * Update UI by recursively loading students on the dom
 * @param {Student[]} studentsToLoad Array of students to be loaded
 */
const loadStudents = studentsToLoad => {

    // if there are no more students to load, exit the function
    if (studentsToLoad.length === 0) return

    // remove first student from array, 
    const nextStudent = studentsToLoad.shift()
    createStudentListItem(nextStudent)

    loadStudents(studentsToLoad)
}

/**
 * Callback for when user clicks on a page link to update UI
 * @param {MouseEvent} onclick mouse click event object
 */
const loadPage = onclick => {
    onclick.preventDefault()

    // remove all students currently on the page
    emptyStudentList()

    // by switching active page to the one user clicked on
    document.querySelector('.pagination a.active').classList.remove('active')
    event.target.classList.add('active')
    
    // get a copy of the page data that we need to load based on the page the user clicked
    const pageToGet = parseInt(event.target.textContent) - 1
    const studentsToLoad = [ ...pages[pageToGet] ]

    // load the new students on the page based on page data
    loadStudents(studentsToLoad)
}

/**
 * Recursively create page links based on the numberOfPages global variable
 * @param {number} pageNumber Page number that is currently being created. Default is 1.
 */
const createPageLinks = (pageNumber = 1) => {

    // exit function if all pages are created
    if (pageNumber > numberOfPages) return
    
    // Get the ul where we will put the link(s)
    const pagesList = document.querySelector('.pagination > ul')

    // create a tag, add href, textContent, event listener
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = pageNumber
    a.addEventListener('click', loadPage)

    // set initial active page to page 1
    if (pageNumber === 1) a.classList.add('active')

    // create li, append a tag to li, append li to ul
    const li = document.createElement('li')
    li.appendChild(a)
    pagesList.appendChild(li)

    // create next page link
    createPageLinks(++pageNumber)
}

/**
 * Recursively create an array of students from global students array, length based on the studentsPerPage global variable, adding one student at a time
 * @param {Student[]} page Array where the next set of students will be  added to. Default is [ ].
 * @returns Array of students corresponding to a page
 */
const createPage = (page = []) => {

    // if we reached the students per page limit, or there are no students left in the global array
    // stop recursion and return the page array
    if (page.length === studentsPerPage || students.length === 0) return page

    // remove studente from top of students array and add it to current page array
    const nextStudent = students.shift()
    page.push(nextStudent)

    // add next student
    return createPage(page)
}

/**
 * Recursively create an array of pages, length based on the numberOfPages global variable, creating one page at a time
 * @param {Student[][]} pages Array that the next page will be added to. Default is [ ].
 * @returns Array of pages
 */
const createPages = (pages = []) => {

    // if all pages are created, stop recursion and return pages array
    if (pages.length === numberOfPages) return pages

    // create page, add it to array, create next page
    const newPage = createPage()
    pages.push(newPage)
    return createPages(pages)
}

/**
 * Temporary variable that holds student data before the data is sorted into pages
 * @type {Student[]}
 */
const students = getStudentsFromList()

/**
 * Calculated from total students divided by the studentsPerPage global variable (rounded up)
 */
const numberOfPages = Math.ceil(students.length / studentsPerPage)

createPageLinks()

/**
 * holds all students divided into pages
 * @type {Student[][]}
 */
const pages = createPages()

// Initially load students using a copy of the first page data
loadStudents([ ...pages[0] ])
