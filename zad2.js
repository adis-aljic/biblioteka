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

const { timeStamp } = require("console");

// funkcija za racunanje da li je overdue

const days = (date) =>{
let date_1 = new Date(date);
let date_2 = new Date();

    let difference = date_1.getTime() - date_2.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
}
const getTime = () => {     // funkcija koja daje timestamp
    const currentDate = new Date();
    return currentDate.toLocaleString();
}
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
        borrowedBook: undefined,  // knjiga koja je trenutno posudjena
        borrowBooks: []        // sve knjige koje su bile posudjene
    }
}
const TransactionBorrow  = (account) => {
    return{
        firstName : account.firstName,
        lastName : account.lastName,
        book: account.borrowedBook,
        type : "Borrow",
        timeStamp: getTime()
    }}
const TransactionReturn  = (account) => {
    return{
        firstName : account.firstName,
        lastName : account.lastName,
        book: account.borrowedBook,

        type : "Return",
        timeStamp: getTime()
    }}
const TransactionDonate  = (firstName, lastName,book,bookAuthor) => {
    return{
        firstName,
        lastName,
        book,
        bookAuthor,
        type : "Donate",
        timeStamp: getTime()
    }}



class Book {
    bookName;       // ime knjige
    bookAuthor;     // autor knjige
    bookYear;       // godina izdavanja
    status;         // da li je knjiga izdana nekome ili nije (moze se staviti i koji je zanr data knjiga i slicno)

    constructor(bookName, bookAuthor, bookYear, status="Avaiable") {
        this.bookName = bookName,
            this.bookAuthor = bookAuthor,
            this.bookYear = bookYear,
            this.status = status
    }
}
class Library {
    libraryName;        // ime biblioteke
    listOfBooks = [];    // spisak svih knjiga koje se nalaze u biblioteci
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
    }
    donateBook(person,book) {
        this.transactions.push(TransactionDonate(person.firstName, person.lastName, book.bookName,book.bookAuthor))
        this.listOfBooks.push(book)
            

    }
    borrowBook(book, person,ID) {
        person.borrowedBook = book

        this.accounts.forEach(account => {
            // if (account.id == person.jmbg.slice(-6)) {
                if (account.accId == ID) {
                this.transactions.push(TransactionBorrow(account))
                account.borrowedBook = book
                account.borrowBooks.push(book)
                book.status = "borrowed"
                account.date = getTime();
                this.listOfBooks.splice(libary.listOfBooks.indexOf(book), 1)
            }
        });
    }
    returnBook(book, person,account_ID) {

        person.borrowedBook = undefined,
            this.accounts.forEach(account => {
                
                if(days(account.date) > 20) {
                    this.payFine()
                }
                if (account.accId == account_ID) {
                    this.transactions.push(TransactionReturn(account))
                    account.borrowedBook = undefined
                    book.status = "Available"
                    this.listOfBooks.push(book)
                }
            });

    }
    payFine() {
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
    findAccountByName(name = "0") {
        const listOfAcounts = []
        for (let i = 0; i < this.accounts.length; i++) {
            const account = this.accounts[i];
            console.log(account)
            if (account.firstName == name) listOfAcounts.push(account)
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
let johnDoe = new Person("John","Doe")
libary.createAccount(createAcc(janeDoe))
libary.createAccount(createAcc(johnDoe))
libary.donateBook(janeDoe,theTrial)
libary.donateBook(janeDoe,toKillAMockingbird)
libary.donateBook(janeDoe,annaKarenina)
libary.borrowBook(theTrial, janeDoe,1)
libary.borrowBook(toKillAMockingbird, janeDoe,1)
libary.borrowBook(annaKarenina,johnDoe,2)
libary.returnBook(annaKarenina,johnDoe,2)
libary.returnBook(toKillAMockingbird,janeDoe,1)




// libary.returnBook(theTrial, janeDoe)
// console.log(libary.findAccountByName("Jane"))
// console.log(johnDoe)
// console.log(libary.findAccountByACCID(2))
console.log(libary.transactions)