require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');
app.use(express.json());
app.use(express.urlencoded({ 
    extended: false,
 })
);



db.sequelize.sync().then((result) => {
        app.listen(port, () => {
            console.log("Server started");
        })
    })
        .catch((err) => {
            console.log(err);
        });

app.post("/music", async (req, res) => {
    const data = req.body;
    try {
        const music = await db.music.create(data);  
        res.send(music);
    } catch (error) {
        res.send(error);
    }
})

app.get("/music",  async (req, res) => {
    try {
        const music = await db.music.findAll();  
        res.send(music);
    } catch (error) {
        res.send(err);
    }
})

app.put("/music/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;      
    
    try {
        const music = await db.music.findByPk(id);
        if (!music) {
            return res.status(404).send({ message: "music tidak tersedia" });
        }
        await music.update(data);
        res.send({ message: "music berhasil diupdate", music });
    } catch (error) {
        res.status(500).send(err);
    }
})




app.delete("/music/:id", async (req, res) => {
    const id = req.params.id;   
    
    try {
        const music = await db.music.findByPk(id);
        if (!music) {
            return res.status(404).send({ message: "music tidak tersedia" });
        }
        await music.destroy();
        res.send({ message: "music berhasil dihapus" });
    } catch (error) {
        res.status(500).send(err);
    }
})

app.listen(port, async () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    try {
        await db.sequelize.authenticate();
        console.log('Koneksi database berhasil.');

       
        await db.sequelize.sync({ force: false }); 
        console.log('Model database tersinkronisasi.');

    } catch (error) {
        console.error('Gagal terhubung atau sinkronisasi database:', error);
    }
});

