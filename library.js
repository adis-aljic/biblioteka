
const getCurrentTime = () => {     //  for generating timestamp
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
    let secondPartOfJMBG = Math.trunc(Math.random() * 899999 + 100000)
    let jmbg = 0
    if (!JMBGS.includes(secondPartOfJMBG)) {
        jmbg = firstPartOfJMBG + secondPartOfJMBG
    }
    JMBGS.push(secondPartOfJMBG)
    return jmbg
}
createAcc = (person) => {
    person.memberOfLibrary = true
    return {
        firstName: person.firstName,
        lastName: person.lastName,
        jmbg: person.jmbg,
        id: person.jmbg.slice(-6),  // first account id
        currentBook: undefined,
        allBorrowedBooks: []
    }
}
// for creating transactions for every type
const TransactionBorrow = (account) => {
    return {
        firstName: account.firstName,
        lastName: account.lastName,
        book: account.currentBook,
        type: "Borrow",
        timeStamp: getCurrentTime()
    }
}
const TransactionReturn = (account) => {
    return {
        firstName: account.firstName,
        lastName: account.lastName,
        book: account.currentBook,

        type: "Return",
        timeStamp: getCurrentTime()
    }
}
const TransactionDonate = (firstName, lastName, book, bookAuthor) => {
    return {
        firstName,
        lastName,
        book,
        bookAuthor,
        type: "Donate",
        timeStamp: getCurrentTime()
    }
}
const penaltyTransaction = (account, amount, numberOfDaysPersonHaveBook = 0) => {
    return {
        firstName: account.firstName,
        lastName: account.lastName,
        ammount: amount,
        book: account.currentBook,
        type: "penalty for overdue",
        timeStamp: getCurrentTime(),
        overdue: numberOfDaysPersonHaveBook + " days"
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
            if (account.accId == account_ID) {
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
        this.transactions.push(TransactionDonate(person.firstName, person.lastName, book.bookName, book.bookAuthor))
        this.listOfBooks.push(book)
        this.numberOfBooks += 1
        console.log("Thank you " + person.firstName + " " + person.lastName + " for donating '" + book.bookName + "' book")
    }
    borrowBook(book, person, ID) {
        this.accounts.forEach(account => {
            if (account.currentBook == undefined) {
                if (account.accId == ID) {
                    this.transactions.push(TransactionBorrow(account))
                    console.log("Thank you " + person.firstName + " " + person.lastName + " for borrowing '" + book.bookName + "' book")
                    account.currentBook = book
                    account.allBorrowedBooks.push(book)
                    book.status = "borrowed"
                    account.date = getCurrentTime();
                    this.listOfBooks.splice(libary.listOfBooks.indexOf(book), 1)
                    person.currentBook = book
                }
            }
            else return console.log("Before borrowing new book, please return old one")
        });
    }
    returnBook(book, person, account_ID, numberOfDaysPersonHaveBook = 0) {
        person.currentBook = undefined,
            this.accounts.forEach(account => {

                if (numberOfDaysPersonHaveBook > 20) {
                    this.fineAlert()
                }
                if (account.accId == account_ID) {
                    this.transactions.push(TransactionReturn(account))
                    account.currentBook = undefined
                    book.status = "Available"
                    this.listOfBooks.push(book)
                    console.log("Thank you " + person.firstName + " " + person.lastName + " for returning '" + book.bookName + "' book")
                }
            });
    }
    payFine(amount, account_ID) {
        this.accounts.forEach(account => {
            if (account.accId == account_ID) {
                console.log("Thank you " + account.firstName + " " + account.lastName +" .You are suscesfuly payed fine")
                this.penalties.push(penaltyTransaction(account, amount))
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
        return booksFromAuthor
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
        return listOfAcounts
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
let janeDoe = new Person("Jane", "Doe")
let johnDoe = new Person("John", "Doe")
let Childhood = new Book("Childhood","Leo Tolstoy",1852)

// creating accounts 
libary.createAccount(createAcc(janeDoe))
libary.createAccount(createAcc(johnDoe))

// donating books
libary.donateBook(janeDoe, theTrial)
libary.donateBook(janeDoe, toKillAMockingbird)
libary.donateBook(janeDoe, annaKarenina)
libary.donateBook(johnDoe,Childhood)

// testing 

libary.borrowBook(theTrial, janeDoe, 1)
libary.borrowBook(toKillAMockingbird, janeDoe, 1)
libary.borrowBook(annaKarenina, johnDoe, 2)
libary.returnBook(annaKarenina, johnDoe, 2)
libary.returnBook(toKillAMockingbird, janeDoe, 1)
libary.payFine(100, 1)

console.log(libary.findBookByAuthor("Leo Tolstoy"))

