//  IN THIS VERSION PERSON CAN ONLY BORROW ONE BOOK AT TIME

// for caluculating days between borrowing and returning book
const FindLeapYear = (year) => {
    let cnt = 0
    for (let i = 1600; i < year; i++) {
        if ((i % 4 == 0) && (i % 100 != 0) || (i % 400 == 0)) {
            cnt++
        }
    }
    return cnt
}

const calculateDaysBetweenDates = (string1) => {


    const daysToDate = (string) => {

        let days = 0

        if (Number(string.slice(3, 5)) == 1) { days += 0 }
        else if (Number(string.slice(3, 5)) == 2) { days += 28 * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 3) { days += (28 + 31) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 4) { days += (28 + 31 + 30) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 5) { days += (28 + 31 + 30 + 31) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 6) { days += (28 + 31 + 30 + 31 + 30) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 7) { days += (28 + 31 + 30 + 31 + 30 + 31) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 8) { days += (28 + 31 + 30 + 31 + 30 + 31 + 31) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 9) { days += (28 + 31 + 30 + 31 + 30 + 31 + 31 + 30) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 10) { days += (28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 11) { days += (28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30) * 24 * 3600 }
        else if (Number(string.slice(3, 5)) == 12) { days += (28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + 31) * 24 * 3600 }

        let daysFromYears = (Number(string.slice(-5, -1)) - 2000) * 365
        let numberOfDays = Number(string.slice(0, 2)) * 24 * 3600
        let summDaysFrom = numberOfDays + daysFromYears
        let daysFromLeapYear = FindLeapYear(daysFromYears) * 24 * 3600

        let totalDays = summDaysFrom + daysFromLeapYear + days
        if (FindLeapYear(string.slice(-5, -1))) { totalDays += 24 * 3600 }
        return totalDays / 3600 / 24
    }


    return Math.trunc(daysToDate(string1) - daysToDate(getCurrentTime().slice(0, 9)))
}


const getCurrentTime = () => {     //  for generating timestamp, time and date for every transaction
    const currentDate = new Date();
    return currentDate.toLocaleString();
}

// for generating birth date and jmbg
const generateBirthDate = () => {
    const leapYears = [1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004]
    let year = Math.trunc(Math.random() * 65 + 1939)        // aprox. people who are currentlu alive 
    let month = Math.trunc(Math.random() * 11 + 1)
    let day = 0;
    if (month == 2) {
        for (let i = 0; i < leapYears.length; i++) {
            const leapYear = leapYears[i];
            if (leapYear == year) {
                day = Math.trunc(Math.random() * 28 + 1)
            }
            else day = Math.trunc(Math.random() * 27 + 1)
        }
    }
    else if (month == 4 || 6 || 9 || 11) day = Math.trunc(Math.random() * 29 + 1)
    else day = Math.trunc(Math.random() * 23 + 1)
    if (day < 10) { day = "0" + day }
    if (month < 10) { month = "0" + month }
    return "" + day + "." + month + "." + year
}
let JMBGS = [];
const generateJMBG = (date) => {
    firstPartOfJMBG = ""
    for (let i = 0; i < date.length; i++) {
        const element = date[i];
        if (element == ".") continue
        else firstPartOfJMBG += element
    }
    let secondPartOfJMBG = Math.trunc(Math.random() * 899999 + 100000)  // second part of jmbg is unique for every person
    let jmbg = 0
    if (!JMBGS.includes(secondPartOfJMBG)) {
        jmbg = firstPartOfJMBG + secondPartOfJMBG
    }
    JMBGS.push(secondPartOfJMBG)
    return jmbg
}
// for creating accounts in library
createAcc = (person) => {
    person.memberOfLibrary = true
    return {
        firstName: person.firstName,
        lastName: person.lastName,
        jmbg: person.jmbg,
        id: person.jmbg.slice(-6),  // first account id
        currentBook: undefined,
        allBorrowedBooks: []        // all books that person are borrowed from library 
    }
}
// for creating transactions for every type
const TransactionBorrow = (account, transactionID) => {
    return {
        firstName: account.firstName,
        lastName: account.lastName,
        book: account.currentBook,
        type: "Borrow",
        timeStamp: getCurrentTime(),
        transactionID: transactionID

    }
}
const TransactionReturn = (account, transactionID) => {
    return {
        firstName: account.firstName,
        lastName: account.lastName,
        book: account.currentBook,
        type: "Return",
        timeStamp: getCurrentTime(),
        transactionID
    }
}
const TransactionDonate = (firstName, lastName, book, bookAuthor, transactionID) => {
    return {
        firstName,
        lastName,
        book,
        bookAuthor,
        type: "Donate",
        timeStamp: getCurrentTime(),
        transactionID
    }
}
const penaltyTransaction = (account, amount, numberOfDaysPersonHaveBook = 0, transactionID) => {
    return {
        firstName: account.firstName,
        lastName: account.lastName,
        ammount: amount,
        book: account.currentBook,
        type: "penalty for overdue",
        timeStamp: getCurrentTime(),
        overdue: numberOfDaysPersonHaveBook + " days",  // how long person kept book
        transactionID
    }
}
class Book {
    bookName;
    bookAuthor;
    bookYear;       // when was book published
    status;         // is book avaiable or borrowed 
    constructor(bookName, bookAuthor, bookYear, status = "Avaiable") {
        this.bookName = bookName,
            this.bookAuthor = bookAuthor,
            this.bookYear = bookYear,
            this.status = status
    }
}
class Library {
    libraryName;
    listOfBooks = []; // list of all books in library
    numberOfAccounts = 0;
    numberOfBooks = 0;
    accounts = [];      // list of all accounts in library
    transactions = [];    // list of all transactions in library
    penalties = [];       // list of all penalties in library
    libraryId;
    constructor(libraryName, libraryId) {
        this.libraryName = libraryName,
            this.libraryId = libraryId,
            this.listOfBooks = [],
            this.accounts = []
    }
    createAccount(account) {
        account.accId = this.accounts.length + 1         // second id for every account, for esasier handling with system
        this.accounts.push(account)                     
        this.numberOfAccounts += 1;                     
    }
    closeAccount(account_ID) {
        this.accounts.forEach(account => {
            for (let i = 0; i < PEOPLE.length; i++) {
                const person = PEOPLE[i];       /// PEOPLE is array which contain all created persons
                if (account.jmbg == person.jmbg) {          // if jmbg from acc is same as jmbg from person then 
                    person.memberOfLibrary = false          // change his memberOfLibrary status to false
                }
            }
            if (account.accId == account_ID) {              // if person doesen't have book borrowed only then he can close acc
                if (account.currentBook == undefined) {
                    this.numberOfAccounts -= 1
                    this.accounts.splice(account.accId - 1, 1)
                    return console.log("You are suscesfuly closed your account")
                }
                else { return console.log("Please return books before closing your account") }
            }
        });
    }
    donateBook(person, book) {
        this.transactionID = this.transactions.length
        this.transactions.push(TransactionDonate(person.firstName, person.lastName, book.bookName, book.bookAuthor, this.transactionID))
        this.listOfBooks.push(book)
        this.numberOfBooks += 1
        console.log("Thank you " + person.firstName + " " + person.lastName + " for donating '" + book.bookName + "' book")
    }
    borrowBook(book, person, ID) {
        this.accounts.forEach(account => {
            if (account.currentBook == undefined) {         // if person doesn't have book only then he can borrow book
                if (account.accId == ID) {
                    this.transactionID = this.transactions.length
                    this.transactions.push(TransactionBorrow(account, this.transactionID))
                    console.log("Thank you " + person.firstName + " " + person.lastName + " for borrowing '" + book.bookName + "' book")
                    account.currentBook = book
                    account.allBorrowedBooks.push(book)
                    book.status = "borrowed"
                    account.date = getCurrentTime();
                    this.listOfBooks.splice(libary.listOfBooks.indexOf(book), 1) // after book is borrowed then it is deleted from
                    person.currentBook = book                                     // array listOfBooks in library

                }
            }
            else return console.log("Before borrowing new book, please return old one")
        });
    }
    returnBook(book, person, account_ID) {

        person.currentBook = undefined,
            this.accounts.forEach(account => {
                if (account.accId == account_ID) {
                    const dateOfBorrowingBook = account.date.slice(0, 9)        // calculate did person overdue 
                    const numberOfDaysPersonHaveBook = calculateDaysBetweenDates(dateOfBorrowingBook)
                    if (numberOfDaysPersonHaveBook > 20) {
                        this.fineAlert()
                    }
                    this.transactionID = this.transactions.length
                    this.transactions.push(TransactionReturn(account, this.transactionID))
                    account.currentBook = undefined
                    book.status = "Available"
                    this.listOfBooks.push(book)
                    console.log("Thank you " + person.firstName + " " + person.lastName + " for returning '" + book.bookName + "' book")
                }
            });
    }
    payFine(amount, account_ID) {
        this.accounts.forEach(account => {              // ckeck does account is same as one who need to pay fine
            if (account.accId == account_ID) {
                this.transactionID = this.transactions.length

                console.log("Thank you " + account.firstName + " " + account.lastName + " .You are suscesfuly payed fine")
                this.penalties.push(penaltyTransaction(account, amount, this.transactionID))
            }
        });
    }
    fineAlert() {
        console.log("You must pay fine for overdue")
    }
    findBookByName(nameOfBook) {
        for (let i = 0; i < this.listOfBooks.length; i++) {
            const book = this.listOfBooks[i]
            if (book.bookName == nameOfBook) return book
        }
    }
    findBookByAuthor(authorOfBook) {
        const booksFromAuthor = []      
        for (let i = 0; i < this.listOfBooks.length; i++) {
            const book = this.listOfBooks[i]
            if (book.bookAuthor == authorOfBook) {
                booksFromAuthor.push(book)
            }
        }
        return booksFromAuthor  // because one author can have more books this function returns array 
    }
    findAccountByACCID(accId1 = 0) {
        for (let i = 0; i < this.accounts.length; i++) {
            const account = this.accounts[i];
            if (account.accId == accId1) return account
        }
    }
    findAccountByName(name = "0", lastname = "") {
        const listOfAcounts = []
        for (let i = 0; i < this.accounts.length; i++) {
            const account = this.accounts[i];
            if (account.firstName == name && account.lastName == lastname) listOfAcounts.push(account)
        }
        return listOfAcounts    // because one author can have more books this function returns array 
    }
}


class Person {
    firstName;
    lastName;
    birthDate;
    jmbg;
    memberOfLibrary;        //  is person member of library
    constructor(firstName, lastName) {
        this.firstName = firstName,
            this.lastName = lastName,
            this.birthDate = generateBirthDate(),
            this.jmbg = generateJMBG(this.birthDate),
            this.memberOfLibrary = false
    }
}

// creating library, persons, books 
let libary = new Library("First Library", 1)
let theTrial = new Book("The Trial", "Franz Kafka", 1925, "Available");
let annaKarenina = new Book("Anna Karenina", "Leo Tolstoy", 1878, "Available");
let toKillAMockingbird = new Book("To Kill a Mockingbird", "Harper Lee", 1960, "Available");
let toKillAMockingbird1 = new Book("To Kill a Mockingbird", "Harper Lee", 1960, "Available")
let janeDoe = new Person("Jane", "Doe")
let johnDoe = new Person("John", "Doe")
let Childhood = new Book("Childhood", "Leo Tolstoy", 1852)

const PEOPLE = [];      // array with all created people
PEOPLE.push(janeDoe, johnDoe)

// creating accounts 
libary.createAccount(createAcc(janeDoe))
libary.createAccount(createAcc(johnDoe))

// donating books
libary.donateBook(janeDoe, theTrial)
libary.donateBook(janeDoe, toKillAMockingbird)
libary.donateBook(janeDoe, annaKarenina)
libary.donateBook(johnDoe, Childhood)
libary.donateBook(johnDoe,toKillAMockingbird1)

// testing 

// libary.borrowBook(theTrial, janeDoe, 1)
libary.borrowBook(toKillAMockingbird, janeDoe, 1)
libary.borrowBook(toKillAMockingbird1, johnDoe, 2)
libary.returnBook(toKillAMockingbird1, johnDoe, 2)
// libary.returnBook(toKillAMockingbird, janeDoe, 1)
// libary.payFine(100, 1)

// console.log(libary.findBookByAuthor("Leo Tolstoy"))

console.log(libary.accounts)
console.log(libary.listOfBooks)