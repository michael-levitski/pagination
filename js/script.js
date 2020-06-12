const studentList = document.querySelector('ul.student-list')
const studentsPerPage = 10

const getStudentsFromList = (students = []) => {
    if (!studentList.firstElementChild) return students

    const li = studentList.removeChild(studentList.firstElementChild)

    const avatar = li.querySelector('img.avatar').src
    const name = li.querySelector('h3').textContent
    const email = li.querySelector('span.email').textContent
    const joined = li.querySelector('span.date').textContent

    const student = { avatar, name, email, joined }
    students.push(student)
    return getStudentsFromList(students)
}

const createStudentListItem = student => {
    const { avatar, name, email, joined } = student

    const img = document.createElement('img')
    img.classList.add('avatar')
    img.src = avatar

    const h3 = document.createElement('h3')
    h3.textContent = name

    const emailSpan = document.createElement('span')
    emailSpan.classList.add('email')
    emailSpan.textContent = email

    const joinedSpan = document.createElement('span')
    joinedSpan.classList.add('date')
    joinedSpan.textContent = joined

    const studentDiv = document.createElement('div')
    studentDiv.classList.add('student-details')
    studentDiv.appendChild(img)
    studentDiv.appendChild(h3)
    studentDiv.appendChild(emailSpan)

    const joinedDiv = document.createElement('div')
    joinedDiv.classList.add('joined-details')
    joinedDiv.appendChild(joinedSpan)

    const li = document.createElement('li')
    li.className = 'student-item cf'
    li.appendChild(studentDiv)
    li.appendChild(joinedDiv)

    studentList.appendChild(li)
}

const emptyStudentList = () => {
    if (!studentList.firstElementChild) return

    studentList.removeChild(studentList.firstElementChild)
    emptyStudentList()
}

const loadStudents = students => {
    if (students.length === 0) return

    const nextStudent = students.shift()
    createStudentListItem(nextStudent)
    loadStudents(students)
}

const loadPage = event => {
    event.preventDefault()
    emptyStudentList()

    document.querySelector('.pagination a.active').classList.remove('active')
    event.target.classList.add('active')
    
    const pageToGet = parseInt(event.target.textContent) - 1
    const studentsToLoad = [ ...pages[pageToGet] ]
    loadStudents(studentsToLoad)
}

const createPageLinks = (page = 1) => {
    if (page > numberOfPages) return
    
    const pagesList = document.querySelector('.pagination > ul')

    const a = document.createElement('a')
    a.href = '#'
    a.textContent = page
    a.addEventListener('click', loadPage)
    if (page === 1) a.classList.add('active')

    const li = document.createElement('li')
    li.appendChild(a)
    pagesList.appendChild(li)

    createPageLinks(++page)
}

const createPage = (page = []) => {
    if (students.length === 0 || page.length === studentsPerPage) return page

    const nextStudent = students.shift()
    page.push(nextStudent)
    return createPage(page)
}

const createPages = (pages = []) => {
    if (pages.length === numberOfPages) return pages

    const newPage = createPage()
    pages.push(newPage)
    return createPages(pages)
}

const students = getStudentsFromList()
const numberOfPages = Math.ceil(students.length / studentsPerPage)

createPageLinks()

const pages = createPages()
loadStudents([ ...pages[0] ])
