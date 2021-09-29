import {collection , Firestore, getFirestore, addDoc, getDocs} from 'firebase/firestore';

export const ReadFromCloudData = () => {
    const readData = async () => {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "todos"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data().Name)}`);
        });
    }
    return (
        <button onClick={readData}>
            Read Data From Cloud Store
        </button>
    )
}