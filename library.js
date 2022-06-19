// u slucaju da je potrebno ucitati vise ljudi
// const importNamesAndCreateListOfPeople = (txtFile) => {
//     let temp = [];
//     const { count, timeStamp } = require('console');
//     const { readFileSync, promises: fsPromises, copyFile } = require('fs');
//     const { prependOnceListener } = require('process');
//     const { addAbortSignal } = require('stream');
//     const { threadId } = require('worker_threads');
//     const contents = readFileSync(txtFile, 'utf-8');
//     temp = contents.split(/\r?\n/);
//     for (let i = 0; i < temp.length; i++) {
//         const element = temp[i];
//     }
//     return temp;
// }
// let listOfPeople = importNamesAndCreateListOfPeople("employees.txt")
// import { calculateDaysBetweenDates,FindLeapYear} from "./functionForCalculatingDaysBetweenDates.js";
const { timeStamp } = require("console");
// console.log(calculateDaysBetweenDates(convertTimeStamp(getCurrentTime()))
// )

// 
const getCurrentTime = () => {     // funkcija koja daje timestamp
    const currentDate = new Date();
    return currentDate.toLocaleString();
}

// funkcija za konvertovanje getTime u pravi format
// const convertTimeStamp = (string) => {
//     let newFormat = ""
//     for (let i = 0; i < 9; i++) {
//         const element = string[i];
//         if (element == ".") { newFormat += "/" }
//         else { newFormat += element }

//     }
//     return newFormat

// }
// funkcije za generisanje random datuma rodjenja i maticnog broja
//maticni broj se kasnije koristio kao id tj uniaktni dio maticnog broja ali kako se uvijek random daje maticni broj prilikom
// svakog pokretanja programa dodao i jos jedna id broj cisto da se moze testirati 
const generateBirthDate = () => {
    const leapYears = [1940, 1944, 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004]
    let year = Math.trunc(Math.random() * 65 + 1939)        //1939 do 2004 od 18god do 65 godina
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
        id: person.jmbg.slice(-6),  // id je orginalno trebao da bude unikatni dio maticnog broja
        currentBook: undefined,  // knjiga koja je trenutno posudjena
        allBorrowedBooks: []        // sve knjige koje su bile posudjene
    }
}

//funkcije za biljezenje transakcija
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
const penaltyTransaction = (account, amount,numberOfDaysPersonHaveBook = 0) => {
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
    bookName;       // ime knjige
    bookAuthor;     // autor knjige
    bookYear;       // godina izdavanja
    status;         // da li je knjiga izdana nekome ili nije (moze se staviti i koji je zanr data knjiga i slicno)

    constructor(bookName, bookAuthor, bookYear, status = "Avaiable") {
        this.bookName = bookName,
            this.bookAuthor = bookAuthor,
            this.bookYear = bookYear,
            this.status = status
    }
}

class Library {
    libraryName;        // ime biblioteke
    listOfBooks = []; // spisak svih knjiga koje se nalaze u biblioteci
    numberOfAccounts = 0;
    numberOfBooks = 0;
    accounts = [];      // spisak svih acc korisinika date biblioteke
    transactions = [];    // spisak svih transakcija u biblioteci(vracanje, izdavanje, doniranje knjiga itd)
    penalties = [];       // spisak svih korisnika koji su imali overdue
    libraryId;                 // id biblioteke
    constructor(libraryName, libraryId) {
        this.libraryName = libraryName,
            this.libraryId = libraryId,
            this.listOfBooks = [],
            this.accounts = []
    }
    createAccount(account) {
        account.accId = this.accounts.length + 1         // dodatni id acc koji sam dodjelio radi testiranja 
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
            if(account.currentBook == undefined) {

                // if (account.id == person.jmbg.slice(-6)) {
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
    returnBook(book, person, account_ID,numberOfDaysPersonHaveBook=0) {

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
                console.log("You are suscesfuly payed fine")
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
        for (let i = 0; i < this.listOfBooks.length; i++) {
            const book = this.listOfBooks[i]
            if (book.bookAuthor == authorOfBook) return book
        }
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
    memberOfLibrary;        //  da li je clan biblioteke, za vise biblioteka moze se dodati i koje je clan biblioteke
    constructor(firstName, lastName) {
        this.firstName = firstName,
            this.lastName = lastName,
            this.birthDate = generateBirthDate(),
            this.jmbg = generateJMBG(this.birthDate),
            this.memberOfLibrary = false
    }
}
let libary = new Library("First Library", 1)
let theTrial = new Book("The Trial", "Franz Kafka", 1925, "Available");
let annaKarenina = new Book("Anna Karenina", "Leo Tolstoy", 1878, "Available");
let toKillAMockingbird = new Book("To Kill a Mockingbird", "Harper Lee", 1960, "Available");
let janeDoe = new Person("Jane", "Doe")
let johnDoe = new Person("John", "Doe")
libary.createAccount(createAcc(janeDoe))
libary.createAccount(createAcc(johnDoe))
libary.donateBook(janeDoe, theTrial)
libary.donateBook(janeDoe, toKillAMockingbird)
libary.donateBook(janeDoe, annaKarenina)
libary.borrowBook(theTrial, janeDoe, 1)
libary.borrowBook(toKillAMockingbird, janeDoe, 1)
libary.borrowBook(annaKarenina, johnDoe, 2)
libary.returnBook(annaKarenina, johnDoe, 2)
// libary.returnBook(toKillAMockingbird, janeDoe, 1)
// libary.payFine(100, 1)


// console.log(libary.findAccountByName("Jane","Doe"))
// libary.returnBook(theTrial, janeDoe)
// console.log(libary.findAccountByName("Jane"))
// console.log(libary.findAccountByACCID(1))
// console.log(libary.findAccountByACCID(2))
// console.log(libary.closeAccount(2))
// console.log(libary.accounts[0])
// libary.closeAccount(2)
console.log(libary.findAccountByACCID(1))

