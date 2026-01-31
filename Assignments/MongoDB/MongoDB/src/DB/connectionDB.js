import { MongoClient } from 'mongodb';



// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// export const db = client.db("DB_name")
export const db = client.db("BookStore")

export const checkConnection = async () => {
    try {
        await client.connect();
        console.log('Connected successfully to server');
    } catch (error) {
        console.log('fail to connect server');
    }
}