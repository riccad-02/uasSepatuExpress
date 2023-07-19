const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;

const multer = require('multer')
const path = require('path')
var cors = require('cors');
app.use(cors({
    origin:'*'
}));
// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// script upload

app.use(express.static("./public"))
 //! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
 
var upload = multer({
    storage: storage
}); // script untuk penggunaan multer saat upload
 
//=================== 17 maret 2023 == Penjelasan teori
 

// create data / insert data
app.post('/api/sepatu',upload.single('image'),(req, res) => {


    const data = { ...req.body };
     const kode_sepatu = req.body.kode_sepatu;
    const nama_sepatu = req.body.nama_sepatu;
    const pembeli = req.body.pembeli;
    const size_sepatu = req.body.size_sepatu;

    if (!req.file) {
        console.log("No file upload");
        const querySql = 'INSERT INTO sepatu (kode_sepatu,nama_sepatu,pembeli,size_sepatu) values (?,?,?,?);';
         
        // jalankan query
        koneksi.query(querySql,[ nim,nama, tanggal_lahir,alamat], (err, rows, field) => {
            // error handling
            if (err) {
                return res.status(500).json({ message: 'Gagal insert data!', error: err });
            }
       
            // jika request berhasil
            res.status(201).json({ success: true, message: 'Berhasil insert data!' });
        });
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename;
        const foto =   imgsrc;
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySql = 'INSERT INTO sepatu (kode_sepatu,nama_sepatu,pembeli,size_sepatu,foto) values (?,?,?,?,?);';
 
// jalankan query
koneksi.query(querySql,[kode_sepatu,nama_sepatu,pembeli,size_sepatu,foto], (err, rows, field) => {
    // error handling
    if (err) {
        return res.status(500).json({ message: 'Gagal insert data!', error: err });
    }

    // jika request berhasil
    res.status(201).json({ success: true, message: 'Berhasil insert data!' });
});
}
});




// read data / get data
app.get('/api/sepatu', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM sepatu';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


// update data
app.put('/api/sepatu/:kode_sepatu', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM sepatu WHERE kode_sepatu = ?';
    const kode_sepatu = req.body.kode_sepatu;
    const nama_sepatu = req.body.nama_sepatu;
    const pembeli = req.body.pembeli;
    const size_sepatu = req.body.size_sepatu;

    const queryUpdate = 'UPDATE sepatu SET nama_sepatu=?,pembeli=?,size_sepatu=? WHERE kode_sepatu = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.kode_sepatu, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [nama_sepatu,pembeli,size_sepatu, req.params.kode_sepatu], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// delete data
app.delete('/api/sepatu/:kode_sepatu', (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM sepatu WHERE kode_sepatu = ?';
    const queryDelete = 'DELETE FROM sepatu WHERE kode_sepatu = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.kode_sepatu, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.kode_sepatu, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: 'Berhasil hapus data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// buat server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
