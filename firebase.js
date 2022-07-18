import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore'
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    // apiKey: "AIzaSyDpBcLAsK5V28MY_tovr0lL17JeSdNHRYA",
    // authDomain: "sqa-vetline.firebaseapp.com",
    // projectId: "sqa-vetline",
    // storageBucket: "sqa-vetline.appspot.com",
    // messagingSenderId: "1086296581211",
    // appId: "1:1086296581211:web:433cb9b3a8f149ca7f4b7e",
    // measurementId: "G-JQVQF7PFT2"
    apiKey: "AIzaSyB_KLgBQPVOKTfB3pxQYXXFb7I2npn2k2Y",
    authDomain: "whatsapp2-0-eeb7e.firebaseapp.com",
    projectId: "whatsapp2-0-eeb7e",
    storageBucket: "whatsapp2-0-eeb7e.appspot.com",
    messagingSenderId: "505337147425",
    appId: "1:505337147425:web:3e09a3556b1d93e80e3360",
    measurementId: "G-C99FTX0FVZ"
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { db, auth, provider }



// {% comment %} <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js" integrity="sha512-q/dWJ3kcmjBLU4Qc47E4A9kTB4m3wuTY7vkFJDTZKjTs8jhyGQnaUrxa0Ytd0ssMZhbNua9hE+E7Qv1j+DyZwA==" crossorigin="anonymous"></script>
// <script type="text/javascript" charset="utf-8">
//     var socket = io('http://127.0.0.1:5000/');
//     socket.on('connect', function() {
//         socket.emit('my event', {data: 'Yes I am connected!'});

//         socket.on('new_message', (message)=>{
//             console.log(message)
//         });
//     });
// </script> {% endcomment %}