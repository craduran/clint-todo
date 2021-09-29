import {collection , Firestore, getFirestore, addDoc} from 'firebase/firestore';

export const WriteToCloudFirestore = () => {
    const sendData = async () => {
        try {
            //try to send data
            const db = getFirestore();
            const docRef = await addDoc(collection(db, "todos"), {
                first: "Ada",
                last: "Lovelace",
                born: 1815
            });
        } catch (err) {
            console.log(err); 
        }
    }
    return (
        <button onClick={sendData}>
            Send data to Firestore
        </button>
    )
}