console.log("Script is running");

import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

//firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDb-W8PQ3pH9wz0-TYDrlnXYsRsXI1aT6s",
    authDomain: "khairatabadapp.firebaseapp.com",
    databaseURL: "https://khairatabadapp-default-rtdb.firebaseio.com",
    projectId: "khairatabadapp",
    storageBucket: "khairatabadapp.appspot.com",
    messagingSenderId: "193348443927",
    appId: "1:193348443927:web:2fb28cfc1ca0785abfa152",
    measurementId: "G-P7KFGVDTPZ"
};
//Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
console.log("Firebase initialized successfully");

let registerContainer = document.getElementById("registerContainer");
let form = document.getElementById("form");
let registerForm = document.getElementById("registrationForm");

//showing the registration form on click
if (registerContainer) {
    registerContainer.addEventListener("click", function (event) {
        event.preventDefault();
        registerContainer.style.display = "none";
        form.style.display = "block";
    })
}

//Variable to access database collection
let boothFields = document.getElementById("boothFields");
let boothFrom = document.getElementById("boothFrom");
let boothTo = document.getElementById("boothTo");
const uniqueCode = "1234";
const activationCode = document.getElementById("activationCode");
let btnPage = document.getElementById("btnPage");

//checking for activation code is correct
if (activationCode) {
    activationCode.addEventListener("change", (e) => {
        e.preventDefault();
        if (uniqueCode === activationCode.value) {
            boothFrom.style.display = "block";
            boothTo.style.display = "block";
            boothFields.style.display = "block";
        } else {
            alert("Please enter right code to Register!!!");
        }
    });
}

// sending form data to firebase
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const mobileNumber = document.getElementById("mobileNumber").value;
        const activationCode = document.getElementById("activationCode").value;
        const boothFrom = document.getElementById("boothFrom").value;
        const boothTo = document.getElementById("boothTo").value;
        if (uniqueCode === activationCode) {
            const registrationCollection = collection(firestore, "registrationData");
            getDocs(registrationCollection).then((snapshot) => {
                snapshot.forEach((doc) => {
                    const fn = doc.data().firstName;
                    if (firstName === fn) {
                        console.log("Already Exists");
                    }
                });
                // Save Form Data To Firebase
                addDoc(registrationCollection, {
                    firstName: firstName,
                    lastName: lastName,
                    mobileNumber: mobileNumber,
                    activationCode: activationCode,
                    boothFrom: boothFrom,
                    boothTo: boothTo,
                })
                    .then(() => {
                        // Alert
                        alert("Registered Successfully");
                        console.log(firstName, lastName, mobileNumber, activationCode);
                        btnPage.style.display = "block";
                        form.style.display = "none";
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        }
    });
}

//getting form data
let stdNo = 0;
let tbody = document.getElementById("tableBody");

function addItemToTable(firstName, lastName, mobileNumber, activationCode, boothFrom, boothTo) {

    let trow = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    let td5 = document.createElement("td");
    let td6 = document.createElement("td");
    let td7 = document.createElement("td");

    td1.innerHTML = ++stdNo;
    td2.innerHTML = firstName;
    td3.innerHTML = lastName;
    td4.innerHTML = mobileNumber;
    td5.innerHTML = activationCode;
    td6.innerHTML = boothFrom;
    td7.innerHTML = boothTo;

    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    trow.appendChild(td7);

    tbody.appendChild(trow);
}

function addAllITemToTable(theStudents) {
    stdNo = 0;
    tbody.innerHTML = "";
    theStudents.forEach(element => {
        addItemToTable(element.firstName, element.lastName, element.mobileNumber, element.activationCode, element.boothFrom, element.boothTo);
    })
}

// async function getAllData() {
//     console.log("Fetching data from Firestore");
//     const querySnapshot = await getDocs(collection(firestore, "registrationData"));
//     if (querySnapshot.empty) {
//         console.log("No documents found in the 'registrationData' collection");
//         return;
//     }
//
//     const students = [];
//     querySnapshot.forEach(doc => {
//         students.push(doc.data());
//     });
//     console.log("Data fetched successfully:", students);
//
//     addAllITemToTable(students);
// }


async function getAllData() {
    console.log("Fetching data from Firestore");
    try {
        const querySnapshot = await getDocs(collection(firestore, "registrationData"));
        if (querySnapshot.empty) {
            console.log("No documents found in the 'registrationData' collection");
            return;
        }

        const students = [];
        querySnapshot.forEach(doc => {
            students.push(doc.data());
        });
        console.log("Data fetched successfully:", students);
        addAllITemToTable(students);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getAllData();
});
